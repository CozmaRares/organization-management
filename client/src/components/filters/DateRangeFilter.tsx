import { formatDateDisplay } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ro } from "date-fns/locale";

type Props = {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  placeholder: string;
  className?: string;
};

export default function DateRangeFilter({
  date,
  setDate,
  placeholder,
  className,
}: Props) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[26ch] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Dates
              placeholder={placeholder}
              from={date?.from}
              to={date?.to}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={ro}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type DatesProps = {
  from?: Date;
  to?: Date;
  placeholder: string;
};

function Dates({ from, to, placeholder }: DatesProps) {
  if (!from) return <span>{placeholder}</span>;

  if (!to) return formatDateDisplay(from);

  return (
    <>
      {formatDateDisplay(from)} - {formatDateDisplay(to)}
    </>
  );
}
