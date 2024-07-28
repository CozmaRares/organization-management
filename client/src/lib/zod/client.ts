import { z } from "zod";

export const ClientValidator = z.object({
  name: z.string(),
  address: z.string(),
  cif: z.string(),
  workplace: z.string(),
});
