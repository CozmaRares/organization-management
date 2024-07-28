import useQuery from "@/hooks/useQuery";
import { createLazyFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const ClientValidator = z.object({
  name: z.string(),
  address: z.string(),
  cif: z.string(),
  workplace: z.string(),
});

function Index() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["clients"],
    url: "/api/clienti",
    validator: z.array(ClientValidator),
  });

  if (isPending) return "Loading...";

  if (isFetching) return "Fetching...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <ul>
      {data.map(({ name, address, cif, workplace }, idx) => (
        <li key={idx}>
          <p>{name}</p>
          <p>{address}</p>
          <p>{cif}</p>
          <p>{workplace}</p>
        </li>
      ))}
    </ul>
  );
}
