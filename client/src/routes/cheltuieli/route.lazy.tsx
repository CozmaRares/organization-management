import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/cheltuieli")({
  component: () => <div>Hello /spending!</div>,
});
