import { z } from "zod";
import { zdate, zenum, zvarchar } from "./utils";
import { clientContractStatus } from "../dbEnums";
import { ZodCustom } from "../types";

const ClientSchema = z.object({
  name: zvarchar(),
  address: zvarchar(),
  cif: zvarchar(),
});

export const Client: ZodCustom<typeof ClientSchema> = {
  schema: ClientSchema,
};

const ClientContractSchema = z.object({
  clientName: zvarchar(),
  date: zdate(),
  details: zvarchar(),
  status: zenum(clientContractStatus),
});

export const ClientContract: ZodCustom<typeof ClientContractSchema> = {
  schema: ClientContractSchema,
  defaultValues: {
    date: new Date(),
    status: "standby",
  },
};
