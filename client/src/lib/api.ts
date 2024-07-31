import useQuery from "@/hooks/useQuery";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import useUpdate from "@/hooks/useUpdate";
import { ClientValidator } from "./zod/client";
import useCreate from "@/hooks/useCreate";
import useDelete from "@/hooks/useDelete";

export const queryClient = new QueryClient();

type API<T> = Record<string, Record<string, T>>;

export const apiKeys = Object.freeze({
  clients: {
    get: ["clients", "get"],
  },
} as const satisfies API<string[]>);

type Client = z.infer<typeof ClientValidator>;

type APIEntries =
  | {
      useQuery: () => unknown;
      invalidate: () => Promise<void>;
    }
  | { useMutation: (...args: unknown[]) => unknown };

export const api = Object.freeze({
  clients: {
    get: {
      useQuery: () =>
        useQuery({
          queryKey: apiKeys.clients.get,
          url: "/api/clienti",
          validator: z.array(ClientValidator),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiKeys.clients.get }),
    },
    create: {
      useMutation: () =>
        useCreate<Client>({
          url: "/api/clienti",
          onSuccessInvalidateKeys: apiKeys.clients.get,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<Client>({
          url: "/api/clienti",
          onSuccessInvalidateKeys: apiKeys.clients.get,
        }),
    },
    delete: {
      useMutation: () =>
        useDelete({
          url: "/api/clienti",
          onSuccessInvalidateKeys: apiKeys.clients.get,
        }),
    },
  },
} as const satisfies API<APIEntries>);
