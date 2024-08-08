import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/facturi/clienti')({
  component: () => <div>Hello /facturi/clienti!</div>
})