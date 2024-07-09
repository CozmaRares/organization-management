import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

type Props = {
  className?: string;
};

// TODO: remove
const jason = JSON.stringify([
  ["/aa", "aa"],
  ["/bb", "bb"],
  ["/cc", "cc"],
]);

export default function Shortcuts({ className }: Props) {
  const shortcuts = JSON.parse(
    localStorage.getItem("shortcuts") ?? jason,
  ) as string[];

  return (
    <div className={cn("flex flex-row items-center p-3", className)}>
      <ul className="flex flex-grow flex-row gap-2">
        {shortcuts.map(([path,name]) => (
          <li key={path}>
            <Link
              to={`/${path}`}
              className="block min-w-[4ch] rounded-full bg-slate-500/40 px-2 py-1 text-center"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <button className="rounded-lg bg-slate-500/30 p-2 transition-colors hover:bg-slate-500/40">
        Modifica scurtaturile
      </button>
    </div>
  );
}
