import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/salarii")({
  component: () => <div>Hello /wages!</div>,
});
