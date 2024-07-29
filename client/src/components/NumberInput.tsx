import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  initialValue: number;
  onChange: (value: number) => boolean;
  className?: string;
};

const numberRegex = /^\d*$/;

export default function NumberInput({
  initialValue,
  onChange,
  className,
}: Props) {
  const [value, setValue] = useState<number | string>(initialValue);

  return (
    <div
      className={cn(
        "flex h-10 flex-row items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <input
        className="w-full bg-inherit text-inherit focus-visible:outline-none"
        value={value}
        onChange={e => {
          const value = e.target.value;
          if (value.length == 0) return setValue("");
          if (numberRegex.test(value) && !onChange(Number(value)))
            setValue(initialValue);
        }}
      />
      <div className="flex h-fit w-fit flex-col items-center justify-center gap-0.5 pr-0.5 text-muted-foreground">
        <button
          onClick={() => onChange(initialValue + 1)}
          className="aspect-square rounded-full p-0.5 transition-colors hover:bg-primary/30 hover:text-foreground"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          onClick={() => onChange(initialValue - 1)}
          className="aspect-square rounded-full p-0.5 transition-colors hover:bg-primary/30 hover:text-foreground"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
