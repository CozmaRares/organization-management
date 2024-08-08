import { z } from "zod";
import { varchar } from "./utils";
import { clientContractStatus } from "../dbEnums";
import { formatDateStore } from "../utils";

export const ClientSchema = z.object({
  name: varchar(),
  address: varchar(),
  cif: varchar(),
});

export const ClientContractSchema = z.object({
  clientName: varchar(),
  date: z
    .date({ required_error: "Este obligatoriu" })
    .or(z.string())
    .transform(date => {
      if (typeof date == "string") return date;
      return formatDateStore(date);
    }),
  details: varchar(),
  status: z.enum(clientContractStatus, { required_error: "Este obligatoriu" }),
});
