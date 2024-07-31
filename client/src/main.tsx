import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import Error from "./components/Error";
import { Home } from "lucide-react";
import { queryClient } from "./lib/api";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return (
      <Error title="Nu s-a găsit pagina!">
        <Link
          to="/"
          className="inline-flex flex-row items-center gap-1 rounded-md bg-primary/90 p-2 text-xl text-primary-foreground transition-colors hover:bg-primary"
        >
          <Home />
          Pagina principală
        </Link>
      </Error>
    );
  },
});

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
