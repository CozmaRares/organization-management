import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/facturi/furnizori')({
  component: () => <div>Hello /facturi/furnizori!</div>
})