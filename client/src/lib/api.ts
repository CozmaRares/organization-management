import useQuery from "@/hooks/useQuery";
import { z } from "zod";
import { QueryClient } from "@tanstack/react-query";
import useUpdate from "@/hooks/useUpdate";
import { ClientContract, Client } from "./zod/client";
import useCreate from "@/hooks/useCreate";
import useDelete from "@/hooks/useDelete";
import { Product } from "./zod/product";
import { Supplier, SupplierBill } from "./zod/supplier";

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
  supplierBills: {
    url: "/api/facturi-furnizori",
    key: ["supplier bills"],
  },
} as const satisfies Record<string, APIData>);

type ClientInput = z.input<typeof Client.schema>;
type ClientContractInput = z.input<typeof ClientContract.schema>;
type ProductInput = z.input<typeof Product.schema>;
type SupplierInput = z.input<typeof Supplier.schema>;
type SupplierBillInput = z.input<typeof SupplierBill.schema>;

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
          validator: z.array(Client.schema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.clients.key }),
    },
    create: {
      useMutation: () =>
        useCreate<ClientInput>({
          url: apiData.clients.url,
          onSuccessInvalidateKeys: apiData.clients.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<ClientInput>({
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
            validator: z.array(ClientContract.schema),
          }),
        invalidate: () =>
          queryClient.invalidateQueries({
            queryKey: apiData.clientContracts.key,
          }),
      },
      create: {
        useMutation: () =>
          useCreate<ClientContractInput>({
            url: apiData.clientContracts.url,
            onSuccessInvalidateKeys: apiData.clientContracts.key,
          }),
      },
      update: {
        useMutation: () =>
          useUpdate<ClientContractInput>({
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
          validator: z.array(Product.schema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.products.key }),
    },
    create: {
      useMutation: () =>
        useCreate<ProductInput>({
          url: apiData.products.url,
          onSuccessInvalidateKeys: apiData.products.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<ProductInput>({
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
          validator: z.array(Supplier.schema),
        }),
      invalidate: () =>
        queryClient.invalidateQueries({ queryKey: apiData.suppliers.key }),
    },
    create: {
      useMutation: () =>
        useCreate<SupplierInput>({
          url: apiData.suppliers.url,
          onSuccessInvalidateKeys: apiData.suppliers.key,
        }),
    },
    update: {
      useMutation: () =>
        useUpdate<SupplierInput>({
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
    bills: {
      get: {
        useQuery: () =>
          useQuery({
            url: apiData.supplierBills.url,
            queryKey: apiData.supplierBills.key,
            validator: z.array(SupplierBill.schema),
          }),
        invalidate: () =>
          queryClient.invalidateQueries({ queryKey: apiData.supplierBills.key }),
      },
      create: {
        useMutation: () =>
          useCreate<SupplierBillInput>({
            url: apiData.supplierBills.url,
            onSuccessInvalidateKeys: apiData.supplierBills.key,
          }),
      },
      update: {
        useMutation: () =>
          useUpdate<SupplierBillInput>({
            url: apiData.supplierBills.url,
            onSuccessInvalidateKeys: apiData.supplierBills.key,
          }),
      },
      delete: {
        useMutation: () =>
          useDelete({
            url: apiData.supplierBills.url,
            onSuccessInvalidateKeys: apiData.supplierBills.key,
          }),
      },
    },
  },
} as const satisfies API);
