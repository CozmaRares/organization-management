import { routeTree } from "@/routeTree.gen";
import { Link, ParseRoute, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  ClipboardMinus,
  Coins,
  LayoutDashboard,
  ListCheck,
  NotebookTabs,
  ReceiptText,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

type Props = {
  className?: string;
};

type ValidRoute = ParseRoute<typeof routeTree>["fullPath"];
type RouteInfo = {
  text: string;
  icon: JSX.Element;
};
type RoutesGeneric<T> = Partial<Record<ValidRoute, RouteInfo & T>>;
// eslint-disable-next-line @typescript-eslint/ban-types
type Routes = RoutesGeneric<{ nested?: RoutesGeneric<{}> }>;

const routes: Routes = Object.freeze({
  "/furnizori": { text: "Furnizori", icon: <Truck /> },
  "/clienti": {
    text: "Clienți",
    icon: <Users />,
    nested: {
      "/clienti/contracte": { text: "Contracte", icon: <NotebookTabs /> },
    },
  },
  "/facturi": {
    text: "Facturi",
    icon: <ReceiptText />,
    nested: {},
  },
  "/cheltuieli": { text: "Cheltuieli", icon: <Coins /> },
  "/taskuri": { text: "Task-uri", icon: <ListCheck /> },
  "/rapoarte": { text: "Raporte", icon: <ClipboardMinus /> },
  "/salarii": { text: "Salarii", icon: <Banknote /> },
} satisfies Routes);

export default function Sidebar({ className }: Props) {
  return (
    <aside
      className={cn(
        "flex max-h-full flex-col justify-between overflow-scroll p-3",
        className,
      )}
    >
      <nav>
        <Nav routes={routes} />
      </nav>
    </aside>
  );
}

type NavProps = { routes: Routes };

function Nav({ routes }: NavProps) {
  const location = useRouterState().location.pathname;

  return (
    <ul className="space-y-2 p-2">
      {Object.entries(routes).map(([path, { text, icon, nested }]) => (
        <NavItem
          key={`sidebar-nav-item-${path}`}
          path={path}
          text={text}
          icon={icon}
          nested={nested}
          active={isLinkActive(location, path, text)}
        />
      ))}
    </ul>
  );
}

function isLinkActive(location: string, path: string, text: string) {
  if (path == "/") return location == "/";

  if (text == "Dashboard") return location == path;

  return location.startsWith(path);
}

type NavItemProps = {
  path: string;
  text: string;
  icon: JSX.Element;
  nested?: Routes;
  active: boolean;
};

const activeBg = "bg-primary/30";

function NavItem({ path, text, icon, nested, active }: NavItemProps) {
  const hasNested = nested && Object.entries(nested).length > 0;

  const itemStyles = cn("btn bg-background rounded-md", active && activeBg);

  if (!hasNested)
    return (
      <li className={itemStyles}>
        <NavLink
          path={path}
          text={text}
          icon={icon}
        />
      </li>
    );

  return (
    <li>
      <CollapsibleMenu
        path={path}
        text={text}
        icon={icon}
        nested={nested}
        className={itemStyles}
      />
    </li>
  );
}

type CollapsibleMenuProps = {
  path: string;
  text: string;
  icon: JSX.Element;
  nested: Routes;
  className?: string;
};

const linkStyles = "flex w-full flex-row gap-2 rounded-md";
const iconStyles = "flex w-[2em] items-center justify-center";

function CollapsibleMenu({
  path,
  text,
  icon,
  nested,
  className,
}: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group"
    >
      <CollapsibleTrigger
        className="cursor-pointer"
        asChild
      >
        <button
          className={cn(
            "flex w-full items-center justify-between p-3 group-hover:bg-primary/40",
            className,
            isOpen && "rounded-bl-none bg-primary/20",
          )}
        >
          <div className={linkStyles}>
            <span className={iconStyles}>{icon}</span>
            {text}
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative">
        <div className="absolute left-0 top-0 z-0 h-full w-[3px] bg-primary/20 transition-colors group-hover:bg-primary/40" />
        <Nav
          routes={{
            [path]: {
              text: "Dashboard",
              icon: <LayoutDashboard />,
            },
            ...nested,
          }}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

type NavLinkProps = {
  path: string;
  text: string;
  icon: JSX.Element;
};

function NavLink({ path, text, icon }: NavLinkProps) {
  return (
    <Link
      to={path}
      className={cn(linkStyles, "p-3")}
    >
      <span className={iconStyles}>{icon}</span>
      {text}
    </Link>
  );
}
