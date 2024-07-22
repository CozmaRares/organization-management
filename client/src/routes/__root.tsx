import FilterArea from "@/components/FilterArea";
import Shortcuts from "@/components/Shortcuts";
import Sidebar from "@/components/Sidebar";
import FilterContextProvider from "@/context/filter-context";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/router-devtools").then(res => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRoute({
  component: () => (
    <div>
      <div className="grid max-h-screen min-h-screen w-full grid-cols-[repeat(32,minmax(0,1fr))] grid-rows-[auto,auto,minmax(0,1fr)] [--sidebar-cols:4]">
        <Shortcuts className="col-span-full border-b p-3" />
        <Sidebar className="col-[span_var(--sidebar-cols)/span_var(--sidebar-cols)] col-start-1 row-start-2 row-end-4 border-r" />
        <FilterContextProvider>
          <FilterArea className="col-[calc(var(--sidebar-cols)+1)/-1] row-start-2 border-b shadow-lg shadow-foreground/10" />
          <div className="col-[calc(var(--sidebar-cols)+1)/-1] row-start-3 overflow-scroll p-4">
            <Outlet />
          </div>
        </FilterContextProvider>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});

// TODO: responsive design
