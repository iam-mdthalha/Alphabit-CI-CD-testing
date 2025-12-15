export type AudienceType = "Industry" | "Government" | "Academia" | "Public";
export type EventType = "Online" | "In-Person";
export type TicketType = "Free" | "Chargeable" | "FREE";

export const isValidEventType = (value: any): value is EventType => {
  return value === "Online" || value === "In-Person";
};

export const isValidTicketType = (value: any): value is TicketType => {
  const normalized = String(value).toLowerCase();
  return normalized === "free" || normalized === "chargeable";
};

export interface AdminEvent {
  id: number;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  audience?: AudienceType[];
  eventName?: string;
  eventDescription?: string;
  eventType?: EventType;
  eventDate?: string;
  eventStartTime?: string;
  eventEndTime?: string;
  eventCity?: string;
  eventAddress?: string;
  ticketType?: TicketType | string;
  audienceType?: string;
  plant?: string;
  createdAt?: string;
  imageUrls?: string[];
}

export interface EventResponse {
  id: number;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventAddress: string;
  eventCity: string;
  plant: string;
  eventType: string;
  ticketType: string;
  audienceType: string;
  createdAt?: string;
  imageUrls?: string[];
}

export interface EventFormData {
  id?: number;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventAddress: string;
  eventCity: string;
  plant: string;
  eventType: string;
  ticketType: string;
  audienceType: string;
}
