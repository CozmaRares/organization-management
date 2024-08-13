import { z } from "zod";
import { zint, zvarchar } from "./utils";
import { ZodCustom } from "../types";

const ProductSchema = z.object({
  name: zvarchar(),
  vat: zint(),
  stock: zint(),
});

export const Product: ZodCustom<typeof ProductSchema> = {
  schema: ProductSchema,
  defaultValues: {
    vat: 19,
    stock: 0,
  },
};
