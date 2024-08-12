import { z } from "zod";
import { varchar } from "./utils";

export const ProductSchema = z.object({
  name: varchar(),
  vat: z
    .number({ required_error: "Este obligatoriu" })
    .nonnegative("Numărul trebuie să fie non-negativ")
    .or(z.string())
    .transform(num => {
      if (typeof num == "number") return num;
      return Number(num);
    }),
  stock: z
    .number({ required_error: "Este obligatoriu" })
    .nonnegative("Numărul trebuie să fie non-negativ")
    .or(z.string())
    .transform(num => {
      if (typeof num == "number") return num;
      return Number(num);
    }),
});

type Product = z.input<typeof ProductSchema>;
export const ProductDefaults: Product = {
  name: "",
  vat: 19,
  stock: 0,
};
