import { useState } from "react";
import { format } from "date-fns";
import PolylineSvg from "../../../components/PolylineSvg";

interface TableRowProps {
  activity: any;
  selected: boolean;
  onSelect: (activity: any) => void;
}

export default function TableRow({
  activity,
  selected,
  onSelect,
}: TableRowProps) {
  const handleRowClick = () => {
    onSelect(activity);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`cursor-pointer hover:bg-blue-50 ${
        selected ? "bg-gray-50" : ""
      }`}
    >
      <td className="relative px-7 sm:w-12 sm:px-6">
        {selected && (
          <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600" />
        )}
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          checked={selected}
          onChange={() => onSelect(activity)}
        />
      </td>
      <td className="whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900">
        <PolylineSvg
          encodedPolyline={activity.activity_data.map?.summary_polyline || ""}
          width={25}
          height={25}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {activity.activity_data.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {format(
          new Date(activity.activity_data.start_date),
          "dd/MM/yyyy HH:mm:ss"
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {activity.activity_data.type}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {(activity.activity_data.distance / 1000).toFixed(2)} km
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {activity.activity_data.average_speed.toFixed(2)} m/s
      </td>
    </tr>
  );
}
