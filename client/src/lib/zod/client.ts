import { z } from "zod";
import { varchar } from "./utils";
import { clientContractStatus, clientContractType } from "../dbEnums";
import { formatDateStore } from "../utils";

export const ClientSchema = z.object({
  name: varchar(),
  address: varchar(),
  cif: varchar(),
  workpoint: varchar(),
});

export const ClientContractSchema = z.object({
  clientName: varchar(),
  license: varchar(),
  quantity: z
    .string({ required_error: "Este obligatoriu" })
    .min(1, "Câmpul trebuie să aibă cel puțin 1 caracter")
    .or(z.number())
    .pipe(
      z.coerce
        .number({ invalid_type_error: "Cămpul nu este număr" })
        .positive("Numărul trebuie să fie pozitiv")
        .int("Numărul trebuie să fie întreg"),
    ),
  price: z
    .string({ required_error: "Este obligatoriu" })
    .min(1, "Câmpul trebuie să aibă cel puțin 1 caracter")
    .or(z.number())
    .pipe(
      z.coerce
        .number({ invalid_type_error: "Cămpul nu este număr" })
        .positive("Numărul trebuie să fie pozitiv"),
    ),
  type: z.enum(clientContractType, { required_error: "Este obligatoriu" }),
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
