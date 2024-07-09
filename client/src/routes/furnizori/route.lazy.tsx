import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/furnizori")({
  component: Suppliers,
});

function Suppliers() {
  return <div>Hello suppliers!</div>;
}
