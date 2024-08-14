import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/rapoarte/")({
  component: () => <div>Hello /reports!</div>,
});
