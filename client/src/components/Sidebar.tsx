import { routeTree } from "@/routeTree.gen";
import { Link, ParseRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

type ValidRoutes = ParseRoute<typeof routeTree>["fullPath"];
type Routes = Partial<
  Record<
    ValidRoutes,
    {
      text: string;
      nested?: Partial<Record<ValidRoutes, string>>;
    }
  >
>;

const routes: Routes = Object.freeze({
  "/": {
    text: "Home",
  },
  "/furnizori": {
    text: "Furnizori",
  },
  "/clienti": {
    text: "Clients",
  },
  "/facturi": {
    text: "Facturi",
    nested: {
      // TODO:
      "/clienti": "Clienti",
      "/furnizori": "Furnizori",
    },
  },
  "/cheltuieli": { text: "Cheltuieli" },
  "/taskuri": { text: "Task-uri" },
  "/rapoarte": { text: "Raporte" },
  "/salarii": { text: "Salarii" },
});

const listStyles = "p-2 space-y-2";
const itemStyles = "bg-background card rounded-md";
const linkStyles = "block w-full p-3";

export default function Sidebar({ className }: Props) {
  return (
    <aside className={className}>
      <nav>
        <ul className={cn(listStyles, "w-full")}>
          {Object.entries(routes).map(([path, { text, nested }]) => (
            <li
              key={path}
              className={cn(itemStyles, {
                "group relative": nested !== undefined,
              })}
            >
              <Link
                to={path}
                className={linkStyles}
              >
                {text}
              </Link>
              <ul
                className={cn(
                  listStyles,
                  "pointer-events-none absolute left-3/4 top-0 z-10 rounded-md border-2 bg-background opacity-0",
                  "group-hover:pointer-events-auto group-hover:left-[90%] group-hover:opacity-100",
                  "transition-[left,opacity]",
                )}
              >
                {Object.entries(nested ?? {}).map(([path, text]) => (
                  <li
                    className={itemStyles}
                    key={"nested-" + path}
                  >
                    <Link
                      to={path}
                      className={linkStyles}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
