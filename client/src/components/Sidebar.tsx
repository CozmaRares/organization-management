import { routeTree } from "@/routeTree.gen";
import { Link, ParseRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import ThemeSwitch from "@/components/ThemeSwitch";
import {
  Banknote,
  ClipboardMinus,
  Coins,
  Handshake,
  House,
  ListCheck,
  PiggyBank,
  ReceiptText,
  Settings,
  Truck,
  Users,
} from "lucide-react";

type Props = {
  className?: string;
};

type ValidRoutes = ParseRoute<typeof routeTree>["fullPath"];
type Routes = Partial<
  Record<
    ValidRoutes,
    {
      text: string;
      icon: JSX.Element;
      nested?: Partial<
        Record<
          ValidRoutes,
          {
            text: string;
            icon: JSX.Element;
          }
        >
      >;
    }
  >
>;

const routes: Routes = Object.freeze({
  "/": {
    text: "Home",
    icon: <House />,
  },
  "/furnizori": {
    text: "Furnizori",
    icon: <Truck />,
  },
  "/clienti": {
    text: "Clienti",
    icon: <Users />,
  },
  "/facturi": {
    text: "Facturi",
    icon: <ReceiptText />,
    nested: {
      // TODO:
      "/clienti": { text: "Clienti", icon: <PiggyBank /> },
      "/furnizori": { text: "Furnizori", icon: <Handshake /> },
    },
  },
  "/cheltuieli": { text: "Cheltuieli", icon: <Coins /> },
  "/taskuri": { text: "Task-uri", icon: <ListCheck /> },
  "/rapoarte": { text: "Raporte", icon: <ClipboardMinus /> },
  "/salarii": { text: "Salarii", icon: <Banknote /> },
});

const listStyles = "p-2 space-y-2";
const itemStyles = "card bg-background rounded-md";
const linkStyles = "block w-full p-3 flex flex-row gap-2 group/link";
const iconStyles =
  "flex w-[2em] items-center justify-center transition-transform duration-300 group-hover/link:rotate-[360deg] group-hover/link:scale-[1.2]";

export default function Sidebar({ className }: Props) {
  return (
    <aside className={cn("flex flex-col justify-between p-3", className)}>
      <nav>
        <ul className={cn(listStyles, "w-full")}>
          {Object.entries(routes).map(([path, { text, icon, nested }]) => (
            <li
              key={path}
              className={cn(itemStyles, {
                "group/item relative": nested !== undefined,
              })}
            >
              <Link
                to={path}
                className={linkStyles}
              >
                <span className={iconStyles}>{icon}</span>
                {text}
              </Link>
              {nested && (
                <ul
                  className={cn(
                    listStyles,
                    "pointer-events-none absolute left-3/4 top-0 z-10 rounded-md border-2 bg-background opacity-0",
                    "group-hover/item:pointer-events-auto group-hover/item:left-[90%] group-hover/item:opacity-100",
                    "transition-[left,opacity]",
                  )}
                >
                  {Object.entries(nested).map(([path, { text, icon }]) => (
                    <li
                      className={itemStyles}
                      key={"nested-" + path}
                    >
                      <Link
                        to={path}
                        className={linkStyles}
                      >
                        <span className={iconStyles}>{icon}</span>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-row justify-center gap-3">
        <Link
          to="/settings"
          className="card rounded-lg p-2"
        >
          <Settings />
        </Link>
        <ThemeSwitch />
      </div>
    </aside>
  );
}
