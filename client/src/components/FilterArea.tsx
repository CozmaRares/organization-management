import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  className?: string;
};

export default function FilterArea({ className }: Props) {
  const filters = ["data", "cantitate"];

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr),auto] grid-rows-2 p-3",
        className,
      )}
    >
      <h2 className="mb-3 text-lg">Filtre</h2>
      <ul className="flex flex-row gap-2">
        {filters.map(filter => (
          <li
            key={filter}
            className="card flex flex-row items-center gap-1 rounded-full p-1 pl-3"
          >
            {filter}
            <button className="scale-75 rounded-full p-1 transition-colors hover:bg-background/40">
              <X />
            </button>
          </li>
        ))}
      </ul>
      <button className="card col-start-2 row-span-full flex flex-col self-center rounded-lg p-2">
        <span>Schimba</span>
        <span>filtrele</span>
      </button>
    </div>
  );
}
