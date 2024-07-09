import FilterArea from "@/components/FilterArea";
import Shortcuts from "@/components/Shortcuts";
import Sidebar from "@/components/Sidebar";
import ThemeSwitch from "@/components/ThemeSwitch";
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
      <div className="grid max-h-screen min-h-screen w-full grid-cols-[minmax(150px,1fr),minmax(0,10fr)] grid-rows-[auto,auto,minmax(0,1fr)]">
        <div className="col-span-full flex flex-row gap-3 border-b p-3">
          <Shortcuts className="flex-grow" />
          <ThemeSwitch />
        </div>
        <Sidebar className="col-span-1 col-start-1 row-start-2 row-end-4 border-r" />
        <FilterContextProvider>
          <FilterArea className="border-b" />
          <div className="overflow-scroll p-4">
            <Outlet />
          </div>
        </FilterContextProvider>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});

// TODO: responsive design
