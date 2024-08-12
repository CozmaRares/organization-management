import useQuery from "@/hooks/useQuery";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import useUpdate from "@/hooks/useUpdate";
import { ClientContractSchema, ClientSchema } from "./zod/client";
import useCreate from "@/hooks/useCreate";
import useDelete from "@/hooks/useDelete";
import { ProductSchema } from "./zod/product";
import { SupplierSchema } from "./zod/supplier";

export const queryClient = new QueryClient();

type APIData = {
  url: string;
  key: string[];
};

const apiData = Object.freeze({
  clients: {
    url: "/api/clienti",
    key: ["clients"],
  },
  clientContracts: {
    url: "/api/contracte-clienti",
    key: ["client contracts"],
  },
  products: {
    url: "/api/produse",
    key: ["products"],
  },
  suppliers: {
    url: "/api/furnizori",
    key: ["suppliers"],
  },
} as const satisfies Record<string, APIData>);

type Client = z.input<typeof ClientSchema>;
type ClientContract = z.input<typeof ClientContractSchema>;
type Product = z.input<typeof ProductSchema>;
type Supplier = z.input<typeof SupplierSchema>;

type APIEntry =
  | {
      useQuery: () => unknown;
      invalidate: () => Promise<void>;
    }
  | { useMutation: (...args: unknown[]) => unknown };

type API = {
  [key: string]: API | APIEntry;
};

export const api = Object.freeze({
  clients: {
    get: {
      useQuery: () =>
        useQuery({
          url: apiData.clients.url,
          queryKey: apiData.clients.key,
          validator: z.array(ClientSchema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.clients.key }),
    },
    create: {
      useMutation: () =>
        useCreate<Client>({
          url: apiData.clients.url,
          onSuccessInvalidateKeys: apiData.clients.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<Client>({
          url: apiData.clients.url,
          onSuccessInvalidateKeys: apiData.clients.key,
        }),
    },
    delete: {
      useMutation: () =>
        useDelete({
          url: apiData.clients.url,
          onSuccessInvalidateKeys: apiData.clients.key,
        }),
    },
    contracts: {
      get: {
        useQuery: () =>
          useQuery({
            url: apiData.clientContracts.url,
            queryKey: apiData.clientContracts.key,
            validator: z.array(ClientContractSchema),
          }),
        invalidate: () =>
          queryClient.invalidateQueries({
            queryKey: apiData.clientContracts.key,
          }),
      },
      create: {
        useMutation: () =>
          useCreate<ClientContract>({
            url: apiData.clientContracts.url,
            onSuccessInvalidateKeys: apiData.clientContracts.key,
          }),
      },
      update: {
        useMutation: () =>
          useUpdate<ClientContract>({
            url: apiData.clientContracts.url,
            onSuccessInvalidateKeys: apiData.clientContracts.key,
          }),
      },
      delete: {
        useMutation: () =>
          useDelete({
            url: apiData.clientContracts.url,
            onSuccessInvalidateKeys: apiData.clientContracts.key,
          }),
      },
    },
  },
  products: {
    get: {
      useQuery: () =>
        useQuery({
          url: apiData.products.url,
          queryKey: apiData.products.key,
          validator: z.array(ProductSchema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.products.key }),
    },
    create: {
      useMutation: () =>
        useCreate<Product>({
          url: apiData.products.url,
          onSuccessInvalidateKeys: apiData.products.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<Product>({
          url: apiData.products.url,
          onSuccessInvalidateKeys: apiData.products.key,
        }),
    },
    delete: {
      useMutation: () =>
        useDelete({
          url: apiData.products.url,
          onSuccessInvalidateKeys: apiData.products.key,
        }),
    },
  },
  suppliers: {
    get: {
      useQuery: () =>
        useQuery({
          url: apiData.suppliers.url,
          queryKey: apiData.suppliers.key,
          validator: z.array(SupplierSchema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.suppliers.key }),
    },
    create: {
      useMutation: () =>
        useCreate<Supplier>({
          url: apiData.suppliers.url,
          onSuccessInvalidateKeys: apiData.suppliers.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<Supplier>({
          url: apiData.suppliers.url,
          onSuccessInvalidateKeys: apiData.suppliers.key,
        }),
    },
    delete: {
      useMutation: () =>
        useDelete({
          url: apiData.suppliers.url,
          onSuccessInvalidateKeys: apiData.suppliers.key,
        }),
    },
  },
} as const satisfies API);
