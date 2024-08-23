interface TableHeaderProps {
  sortConfig: { key: string; direction: string } | null;
  handleSort: (key: string) => void;
  isAllSelected: boolean; // New prop to track if all activities are selected
  handleSelectAll: () => void; // New prop for the select all function
}

export default function TableHeader({
  sortConfig,
  handleSort,
  isAllSelected,
  handleSelectAll,
}: TableHeaderProps) {
  const getSortIndicator = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <thead className="sticky top-0 bg-blue-50 z-10">
      <tr>
        <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
        </th>
        <th
          scope="col"
          className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer w-12"
        >
          Route
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left truncate text-sm font-semibold text-gray-900 cursor-pointer w-48"
          onClick={() => handleSort("name")}
        >
          Title {getSortIndicator("name")}
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer w-48"
          onClick={() => handleSort("start_date")}
        >
          Date {getSortIndicator("start_date")}
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer w-48"
          onClick={() => handleSort("type")}
        >
          Type {getSortIndicator("type")}
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer w-48"
          onClick={() => handleSort("distance")}
        >
          Distance {getSortIndicator("distance")}
        </th>
        <th
          scope="col"
          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer w-48"
        >
          Strava Link
        </th>
      </tr>
    </thead>
  );
}
