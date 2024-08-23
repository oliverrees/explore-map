import { useState } from "react";
import {
  today,
  getLocalTimeZone,
  parseAbsolute,
} from "@internationalized/date";
import { RangeCalendar } from "@nextui-org/react";
import { MapIcon } from "@heroicons/react/24/outline";

interface DateRangeSelectorProps {
  onUpdate: (range: { start: Date | null; end: Date | null }) => void;
  ctaText?: string;
  showCancel?: boolean;
  initialDates?: { start: string; end: string };
}

export function LiveActivitySelector({
  onUpdate,
  ctaText = "Create Live Map",
  showCancel = false,
  initialDates,
}: DateRangeSelectorProps) {
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 1500;

  const [value, setValue] = useState<any>({
    start: initialDates?.start
      ? parseAbsolute(initialDates?.start, getLocalTimeZone())
      : today(getLocalTimeZone()),
    end: initialDates?.end
      ? parseAbsolute(initialDates?.end, getLocalTimeZone())
      : today(getLocalTimeZone()).add({ weeks: 1 }),
  });

  const handleDateChange = () => {
    const startDate = value.start.toDate(getLocalTimeZone());
    const endDate = value.end.toDate(getLocalTimeZone());

    onUpdate({
      start: startDate,
      end: endDate,
    });
  };

  return (
    <div>
      <div className="bg-white shadow rounded-lg w-full flex items-center justify-center">
        <RangeCalendar
          aria-label="Date Range Selector"
          minValue={today(getLocalTimeZone())}
          visibleMonths={isDesktop ? 3 : 1}
          classNames={{
            base: "shadow-none rounded-none border-none bg-white py-2",
            content: "bg-none",
            gridHeader: "bg-none shadow-none",
            headerWrapper: "bg-white border-none",
            gridHeaderRow: "bg-white ",
            gridBodyRow: "bg-white ",
            gridHeaderCell: "bg-white",
            grid: "bg-white",
          }}
          value={value}
          onChange={(range) => setValue(range)}
        />
      </div>
      <div className="flex justify-center gap-4 mt-4 w-full">
        <button
          type="button"
          onClick={handleDateChange}
          className="block rounded-md bg-blue-600 px-6 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 w-full"
        >
          <MapIcon className="h-5 w-5 inline-block -mt-0.5 mr-2" />
          {ctaText}
        </button>
        {showCancel && (
          <button
            type="button"
            onClick={() => onUpdate({ start: null, end: null })}
            className="block rounded-md bg-red-500 text-white border px-3 py-1.5 text-center text-sm font-semibold leading-6 shadow-sm w-full"
          >
            Remove Live Range
          </button>
        )}
      </div>
    </div>
  );
}
