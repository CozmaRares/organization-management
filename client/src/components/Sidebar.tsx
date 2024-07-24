import { routeTree } from "@/routeTree.gen";
import { Link, ParseRoute, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import ThemeSwitch from "@/components/ThemeSwitch";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  ClipboardMinus,
  Coins,
  House,
  LayoutDashboard,
  ListCheck,
  NotebookTabs,
  ReceiptText,
  Settings,
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
type Routes = RoutesGeneric<{ nested?: RoutesGeneric<{}> }>;

const routes: Routes = Object.freeze({
  "/": { text: "Home", icon: <House /> },
  "/furnizori": { text: "Furnizori", icon: <Truck /> },
  "/clienti": {
    text: "Clienti",
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
    <aside className={cn("flex flex-col justify-between p-3", className)}>
      <nav>
        <Nav routes={routes} />
      </nav>
      <div className="flex flex-row justify-center gap-3">
        <Link
          to="/settings"
          className="btn group rounded-lg p-2"
        >
          <Settings className="transition-transform group-hover:rotate-180" />
        </Link>
        <ThemeSwitch />
      </div>
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

const linkStyles = "group/link flex w-full flex-row gap-2";
const iconStyles =
  "flex w-[2em] items-center justify-center transition-transform duration-300 group-hover/link:rotate-[360deg] group-hover/link:scale-[1.2]";

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
    >
      <CollapsibleTrigger asChild>
        <div className={cn("flex items-center justify-between p-3", className)}>
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
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
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
