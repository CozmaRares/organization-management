import { z } from "zod";
import * as zu from "./utils";
import { clientContractStatus } from "../dbEnums";

const ClientSchema = z.object({
  name: zu.varchar(),
  address: zu.varchar(),
  cif: zu.varchar(),
});

export const Client: zu.Schemas<typeof ClientSchema, typeof ClientSchema> = {
  schemas: {
    api: ClientSchema,
    user: ClientSchema,
  },
};

const ClientContractSchemaAPI = z.object({
  id: zu.int(),
  clientName: zu.varchar(),
  date: zu.date.api(),
  details: zu.varchar(),
  status: zu._enum(clientContractStatus),
});

const ClientContractSchemaUser = z.object({
  clientName: zu.varchar(),
  date: zu.date.user(),
  details: zu.varchar(),
  status: zu._enum(clientContractStatus),
});

export const ClientContract: zu.Schemas<
  typeof ClientContractSchemaAPI,
  typeof ClientContractSchemaUser
> = {
  schemas: {
    api: ClientContractSchemaAPI,
    user: ClientContractSchemaUser,
  },
  defaultValues: {
    date: new Date(),
    status: "standby",
  },
};
