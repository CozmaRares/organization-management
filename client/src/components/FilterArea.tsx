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
          <li className="flex flex-row items-center gap-1 rounded-full bg-slate-500/30 py-1 pl-2">
            {filter}
            <button className="scale-75 rounded-full p-1 transition-colors hover:bg-black/50">
              <X />
            </button>
          </li>
        ))}
      </ul>
      <button className="col-start-2 hover:bg-slate-500/40 transition-colors row-span-full flex flex-col self-center rounded-lg bg-slate-500/30 p-2">
        <span>Schimba</span>
        <span>filtrele</span>
      </button>
    </div>
  );
}
