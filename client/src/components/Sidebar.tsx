import { routeTree } from "@/routeTree.gen";
import { Link, ParseRoute, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Banknote,
  ChevronDown,
  ClipboardMinus,
  Coins,
  LayoutDashboard,
  ListCheck,
  NotebookTabs,
  PackageSearch,
  ReceiptText,
  Truck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  className?: string;
};

type ValidRoute = ParseRoute<typeof routeTree>["fullPath"];
type RouteInfo = {
  path: ValidRoute;
  text: string;
  icon: JSX.Element;
};
type Route =
  | RouteInfo
  | { text: string; icon: JSX.Element; nested: RouteInfo[] };

const routes: readonly Route[] = Object.freeze([
  { path: "/produse", text: "Produse", icon: <PackageSearch /> },
  { path: "/furnizori", text: "Furnizori", icon: <Truck /> },
  {
    text: "Clienți",
    icon: <Users />,
    nested: [
      { path: "/clienti", text: "Dashboard", icon: <LayoutDashboard /> },
      { path: "/clienti/contracte", text: "Contracte", icon: <NotebookTabs /> },
    ],
  },
  {
    text: "Facturi",
    icon: <ReceiptText />,
    nested: [
      { path: "/facturi/furnizori", text: "Furnizori", icon: <Truck /> },
      { path: "/facturi/clienti", text: "Clienți", icon: <Users /> },
    ],
  },
  { path: "/cheltuieli", text: "Cheltuieli", icon: <Coins /> },
  { path: "/taskuri", text: "Task-uri", icon: <ListCheck /> },
  { path: "/rapoarte", text: "Raporte", icon: <ClipboardMinus /> },
  { path: "/salarii", text: "Salarii", icon: <Banknote /> },
]);

export default function Sidebar({ className }: Props) {
  return (
    <aside
      className={cn("flex max-h-full flex-col justify-between p-3", className)}
    >
      <ScrollArea className="max-h-full">
        <nav>
          <Nav routes={routes} />
        </nav>
      </ScrollArea>
    </aside>
  );
}

type NavProps = { routes: readonly Route[] };

function Nav({ routes }: NavProps) {
  return (
    <ul className="space-y-2 p-2">
      {routes.map((route, idx) => (
        <NavItem
          key={`sidebar-nav-item-${idx}`}
          route={route}
        />
      ))}
    </ul>
  );
}

type NavItemProps = {
  route: Route;
};

function NavItem({ route }: NavItemProps) {
  const hasNested = "nested" in route;

  const itemStyles = "btn bg-background rounded-md";

  if (!hasNested)
    return (
      <li
        className={cn(
          itemStyles,
          "hover:bg-primary/40 has-[[data-active=true]]:bg-primary/30",
          "ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        )}
      >
        <NavLink
          path={route.path}
          text={route.text}
          icon={route.icon}
        />
      </li>
    );

  return (
    <li>
      <CollapsibleMenu
        text={route.text}
        icon={route.icon}
        nested={route.nested}
        className={itemStyles}
      />
    </li>
  );
}

type CollapsibleMenuProps = {
  text: string;
  icon: JSX.Element;
  nested: RouteInfo[];
  className?: string;
};

const linkStyles = "flex w-full flex-row gap-2 rounded-md outline-none";
const iconStyles = "flex w-[2em] items-center justify-center";

function CollapsibleMenu({
  text,
  icon,
  nested,
  className,
}: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation().pathname;

  const isActive = useMemo(
    () => nested.some(route => route.path.startsWith(location)),
    [location, nested],
  );

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
            "flex w-full items-center justify-between p-3 transition-[border-bottom-left-radius] group-hover:bg-primary/40",
            "outline-none ring-offset-background transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className,
            isOpen && "rounded-bl-none bg-accent",
            isActive && "bg-primary/30",
          )}
        >
          <div className={linkStyles}>
            <span className={iconStyles}>{icon}</span>
            {text}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
          <span className="sr-only">Toggle</span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative">
        <div className="absolute left-0 top-0 z-0 h-full w-[3px] bg-primary/20 transition-colors group-hover:bg-primary/40" />
        <Nav routes={nested} />
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
  const location = useLocation().pathname;

  return (
    <Link
      to={path}
      className={cn(linkStyles, "p-3")}
      data-active={location === path}
    >
      <span className={iconStyles}>{icon}</span>
      {text}
    </Link>
  );
}
