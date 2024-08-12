import { z } from "zod";
import { varchar } from "./utils";
import { supplierStatus } from "../dbEnums";

export const SupplierSchema = z.object({
  name: varchar(),
  status: z.enum(supplierStatus, { required_error: "Este obligatoriu" }),
});
