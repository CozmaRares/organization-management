import { z } from "zod";
import { varchar } from "./utils";

export const ClientValidator = z.object({
  name: varchar(),
  address: varchar(),
  cif: varchar(),
  workpoint: varchar(),
});
