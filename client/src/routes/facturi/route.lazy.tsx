import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/facturi")({
  component: () => <div>Hello /invoices!</div>,
});
