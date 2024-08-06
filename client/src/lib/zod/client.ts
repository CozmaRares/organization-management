import { z } from "zod";
import { varchar } from "./utils";
import { clientContractStatus, clientContractType } from "../dbEnums";

export const ClientSchema = z.object({
  name: varchar(),
  address: varchar(),
  cif: varchar(),
  workpoint: varchar(),
});

export const ClientContractSchema = z.object({
  clientName: varchar(),
  license: varchar(),
  quantity: z.number({ required_error: "Este obligatoriu" }).positive().int(),
  price: z.number({ required_error: "Este obligatoriu" }).positive(),
  type: z.enum(clientContractType, { required_error: "Este obligatoriu" }),
  date: z.date({ required_error: "Este obligatoriu" }),
  details: varchar(),
  status: z.enum(clientContractStatus, { required_error: "Este obligatoriu" }),
});
