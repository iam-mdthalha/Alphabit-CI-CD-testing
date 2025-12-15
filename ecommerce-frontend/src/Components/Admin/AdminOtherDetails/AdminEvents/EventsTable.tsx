import React from "react";
import EventsActions from "./EventsActions";
import { AdminEvent } from "Types/Admin/AdminEventType";

type Props = {
  items: AdminEvent[];
  onView: (item: AdminEvent) => void;
  onEdit: (item: AdminEvent) => void;
  onDelete: (id: number) => void;
};

const EventsTable: React.FC<Props> = ({ items, onView, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Event Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Event Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Venue
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 align-top w-1/5">
                    <div className="text-gray-800">
                      {it.startDate || "No date"}
                    </div>
                    <div className="text-gray-500 mt-1 text-xs">
                      {it.endDate || "No date"}
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top w-1/5 font-medium text-gray-800">
                    {it.name || it.eventName || "No name"}
                  </td>

                  <td className="px-4 py-4 align-top w-2/5 text-gray-700">
                    {it.description || it.eventDescription || "No description"}
                  </td>

                  <td className="px-4 py-4 align-top w-1/5 text-gray-700">
                    {it.eventAddress || it.venue || "No address"}
                  </td>

                  <td className="px-4 py-4 align-top w-28">
                    <EventsActions
                      onView={() => onView(it)}
                      onEdit={() => onEdit(it)}
                      onDelete={() => onDelete(it.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
