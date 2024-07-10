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
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <ul className="contents">
        {shortcuts.map(([path, name]) => (
          <li key={path}>
            <Link
              to={`/${path}`}
              className="card block min-w-[4ch] rounded-full px-2 py-1 text-center"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <button className="card ml-auto rounded-lg p-2">
        Modifica scurtaturile
      </button>
    </div>
  );
}