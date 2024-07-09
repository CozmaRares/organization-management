import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/taskuri")({
  component: () => <div>Hello /tasks!</div>,
});
