import { z } from "zod";
import { zint, zvarchar } from "./utils";

export const ProductSchema = z.object({
  name: zvarchar(),
  vat: zint(),
  stock: zint(),
});

type Product = z.input<typeof ProductSchema>;
export const ProductDefaults: Product = {
  name: "",
  vat: 19,
  stock: 0,
};
