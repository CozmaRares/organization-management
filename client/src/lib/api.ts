import useQuery from "@/hooks/useQuery";
import { z } from "zod";
import { ClientValidator } from "./zod/client";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

type API<T> = Record<string, Record<string, T>>;

export const apiKeys = Object.freeze({
  clients: {
    get: ["clients", "get"],
  },
} as const satisfies API<string[]>);

type Fn = (...args: unknown[]) => unknown;
type APIEntries = { query: Fn; invalidate: Fn } | { mutate: Fn };

export const api = {
  clients: {
    get: {
      query: () =>
        useQuery({
          queryKey: apiKeys.clients.get,
          url: "/api/clienti",
          validator: z.array(ClientValidator),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiKeys.clients.get }),
    },
  },
} as const satisfies API<APIEntries>;
