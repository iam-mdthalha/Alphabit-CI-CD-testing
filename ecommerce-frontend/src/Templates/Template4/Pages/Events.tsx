import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ElectricBorder from "Components/reactbits/ElectricBorder/ElectricBorder";
import RegistrationForm from "Templates/Template4/Components/Events/RegistrationForm";
import { notifications } from "@mantine/notifications";
import { useGetAllEventsQuery } from "Services/EventApiSlice";
import { AdminEvent } from "Types/Admin/AdminEventType";
import {
  useCreateEventRegistrationMutation,
} from "Services/EventRegistrationApiSlice";
import dayjs from "dayjs";

interface CustomEvent {
  id: string;
  eventHdrId: number;
  dateTime: string;
  eventDetails: string;
  venue: string;
  tickets: string;
  audience: string[];
  status: string;
  borderColor: string;
}

const getBorderColor = (index: number): string => {
  const colors = [
    "#A5B4FC",
    "#86EFAC",
    "#FCA5A5",
    "#FCD34D",
    "#C4B5FD",
    "#67E8F9",
    "#FDA4AF",
    "#86E3CE",
  ];
  return colors[index % colors.length];
};

const Events: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const plant = process.env.REACT_APP_PLANT || "";

  const {
    data: apiEvents = [],
    isLoading,
    error,
  } = useGetAllEventsQuery({ plant });

  const [createEventRegistration] = useCreateEventRegistrationMutation();

  const events: CustomEvent[] = useMemo(() => {
    return apiEvents.map((apiEvent, index): CustomEvent => {
      const audienceArray: string[] = apiEvent.audienceType
        ? apiEvent.audienceType.split(",").map((a: string) => a.trim())
        : apiEvent.audience
        ? apiEvent.audience.map((a) => String(a))
        : [];

      const ticketTypeString = apiEvent.ticketType?.toString() || "";
      const isFreeTicket = ticketTypeString.toLowerCase() === "free";

      return {
        id: apiEvent.id?.toString() || index.toString(),
        eventHdrId: apiEvent.id ?? index,
        dateTime: `${apiEvent.eventDate || ""} ${
          apiEvent.eventStartTime || ""
        } - ${apiEvent.eventEndTime || ""}`,
        eventDetails: apiEvent.eventName || apiEvent.name || "",
        venue: apiEvent.eventAddress || apiEvent.venue || "",
        tickets: isFreeTicket ? "Register Now" : "Buy Tickets",
        audience: audienceArray,
        status: isFreeTicket ? "Free" : "Paid",
        borderColor: getBorderColor(index),
      };
    });
  }, [apiEvents]);

 useEffect(() => {
  
  setIsVisible(true);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); 
      }
    },
    { threshold: 0.1 }
  );

  if (containerRef.current) observer.observe(containerRef.current);

  return () => observer.disconnect();
}, []);


  useEffect(() => {
    if (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load events",
        color: "red",
      });
    }
  }, [error]);

  const handleRegister = useCallback((event: CustomEvent) => {
    setSelectedEvent(event);
    setShowRegistration(true);
  }, []);

  const handleRegistrationSubmit = useCallback(
    async (formData: any) => {
      if (!selectedEvent || !selectedEvent.eventHdrId) {
        notifications.show({
          title: "Error",
          message: "Event information is missing. Please refresh and try again.",
          color: "red",
        });
        return;
      }

      try {
        const fullName = (formData.fullName || "").trim();
        const [firstName, ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        const registrationPayload = {
          eventHdrId: selectedEvent.eventHdrId,
          firstName: firstName || fullName,
          lastName: lastName || "",
          email: formData.email,
          contactNumber: formData.mobileNumber,
          address: "",
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pin: "",
        };

        await createEventRegistration({
          data: registrationPayload,
          plant,
        }).unwrap();

        notifications.show({
          title: "🎉 Registration Successful!",
          message: `You've successfully registered for ${selectedEvent.eventDetails}`,
          color: "blue",
        });

        setShowRegistration(false);
        setSelectedEvent(null);
      } catch (error: any) {
        console.error("Registration error:", error);
        notifications.show({
          title: "Error",
          message:
            error?.data?.message ||
            "Failed to submit registration. Please try again.",
          color: "red",
        });
      }
    },
    [selectedEvent, createEventRegistration, plant]
  );

  useEffect(() => {
    console.log("API Events data:", apiEvents);
    console.log("Transformed events:", events);
  }, [apiEvents, events]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center p-8 font-gilroyRegular">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintageText mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            Loading Events...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            Failed to Load Events
          </h2>
          <p className="text-slate-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            No Events Scheduled
          </h2>
          <p className="text-slate-600">
            Check back later for upcoming events!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 p-4 md:p-8 font-gilroyRegular tracking-wider"
      >
        <div className="text-center text-vintageText mb-12">
          <h1 className="text-4xl md:text-6xl font-melodramaRegular font-semibold mb-4">
            Upcoming Events
          </h1>
          <p className="text-slate-600 text-lg">
            Click on any event to see details and register
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              apiEvent={apiEvents[index]}
              index={index}
              isVisible={isVisible}
              activeEvent={activeEvent}
              onCardClick={setActiveEvent}
              onRegisterClick={handleRegister}
            />
          ))}
        </div>
      </div>

      {showRegistration && selectedEvent && (
        <RegistrationForm
          event={selectedEvent}
          onSubmit={handleRegistrationSubmit}
          onClose={() => setShowRegistration(false)}
        />
      )}
    </>
  );
};

interface EventCardProps {
  event: CustomEvent;
  apiEvent: AdminEvent;
  index: number;
  isVisible: boolean;
  activeEvent: string | null;
  onCardClick: (id: string | null) => void;
  onRegisterClick: (event: CustomEvent) => void;
}

const EventCard: React.FC<EventCardProps> = React.memo(
  ({
    event,
    apiEvent,
    index,
    isVisible,
    activeEvent,
    onCardClick,
    onRegisterClick,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const { leftDate, leftTime, right } = useMemo(() => {
      const dateStr = apiEvent.eventDate || "";
      const startTime = apiEvent.eventStartTime || "";
      const endTime = apiEvent.eventEndTime || "";

      return {
        leftDate: dateStr,
        leftTime: startTime,
        right: endTime,
      };
    }, [apiEvent.eventDate, apiEvent.eventStartTime, apiEvent.eventEndTime]);

    const toggleDetails = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      onCardClick(activeEvent === event.id ? null : event.id);
    };

    const CardWrapper = isHovered ? ElectricBorder : "div";

    const wrapperProps = isHovered
      ? {
          color: event.borderColor,
          speed: 0.08,
          chaos: 0.05,
          thickness: 1,
          className: "rounded-2xl",
        }
      : { className: "rounded-2xl border border-slate-200 shadow-sm" };

    return (
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <div
          className="rounded-2xl cursor-pointer transition-transform duration-150 hover:scale-[1.01]"
          onClick={() => toggleDetails()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardWrapper {...wrapperProps}>
            <div className="bg-white/90 rounded-2xl p-6 md:p-8">
              <div>
                <div className="hidden md:grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full mt-1"
                        style={{ backgroundColor: event.borderColor }}
                      />
                      <div>
                        <p className="font-medium">{leftDate}</p>
                        <p>
                          {leftTime}
                          {right && (
                            <span className="text-sm text-slate-600 mt-1">
                              to {right}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <h3 className="font-bold text-xl">
                      {apiEvent.eventName || apiEvent.name}
                    </h3>
                    <p className="text-vintageText font-semibold">
                      {apiEvent.eventAddress ||
                        apiEvent.venue ||
                        "Online Event"}
                      {apiEvent.eventCity && `, ${apiEvent.eventCity}`}
                    </p>
                  </div>

                  <div className="col-span-4 flex gap-2 justify-center">
                    <RegisterButton
                      text={
                        apiEvent.ticketType?.toString().toLowerCase() === "free"
                          ? "Register Now"
                          : "Buy Tickets"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegisterClick(event);
                      }}
                    />
                    <button
                      className="px-3 py-1 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      onClick={(e) => toggleDetails(e)}
                    >
                      {activeEvent === event.id
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                  </div>
                </div>

                <div className="md:hidden space-y-4">
                  <h3 className="font-bold text-lg">
                    {apiEvent.eventName || apiEvent.name}
                  </h3>
                  <p className="text-vintageText font-semibold">
                    {apiEvent.eventAddress || apiEvent.venue || "Online Event"}
                    {apiEvent.eventCity && `, ${apiEvent.eventCity}`}
                  </p>
                  <div>
                    <div className="font-medium">{leftDate}</div>
                    <div className="font-medium">{leftTime}</div>
                    {right && (
                      <div className="text-sm text-slate-600">to {right}</div>
                    )}
                  </div>
                </div>

                {activeEvent === event.id && (
                  <div className="mt-6 pt-6 border-t border-slate-200 animate-in slide-in-from-top duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                      {apiEvent.imageUrls && apiEvent.imageUrls.length > 0 && (
                        <div className="">
                          <div className="grid-cols-1">
                            {apiEvent.imageUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Event ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-slate-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/300x200?text=Image+Not+Found";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Event Description
                          </h4>
                          <p className="text-slate-600">
                            {apiEvent.eventDescription ||
                              apiEvent.description ||
                              "No description available."}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mt-2 mb-4">
                            More Details
                          </h4>
                          <ul className="text-slate-600 space-y-2">
                            <li>
                              <strong className="text-sm">Ticket:</strong>{" "}
                              {apiEvent.ticketType || "Not specified"}
                            </li>
                            <li>
                              <strong className="text-sm">Event Type:</strong>{" "}
                              {apiEvent.eventType || "Not specified"}
                            </li>
                          </ul>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <strong className="text-sm">Audience Type:</strong>{" "}
                            {event.audience.map((a, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 border border-yellow-500 rounded-full text-xs text-yellow-500 bg-white/70"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    );
  }
);

EventCard.displayName = "EventCard";

const RegisterButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <button
    onClick={onClick}
    className="bg-vintageText text-vintageBg text-xs lg:text-base px-4 py-2 rounded-xl hover:bg-opacity-90 font-medium transition-colors"
  >
    {text}
  </button>
);

export default Events;
