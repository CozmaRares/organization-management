import Shortcuts from "@/components/Shortcuts";
import Sidebar from "@/components/Sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";

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
      <div className="grid max-h-screen min-h-screen w-full grid-cols-[repeat(32,minmax(0,1fr))] grid-rows-[auto,minmax(0,1fr)] [--sidebar-cols:4]">
        <Shortcuts className="col-span-full border-b p-3" />
        <Sidebar className="col-[span_var(--sidebar-cols)/span_var(--sidebar-cols)] col-start-1 row-start-2 row-end-4 border-r" />
        <div className="col-[calc(var(--sidebar-cols)+1)/-1] row-start-2 overflow-scroll">
          <div className="container px-4 py-4">
            <Outlet />
          </div>
        </div>
      </div>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools />
      <Toaster />
    </div>
  ),
});

// TODO: responsive design
