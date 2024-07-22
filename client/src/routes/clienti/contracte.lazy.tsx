import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/clienti/contracte')({
  component: () => <div>Hello /clienti/contracte!</div>
})
