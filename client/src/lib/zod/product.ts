import { z } from "zod";
import * as zu from "./utils";

const ProductSchemaAPI = z.object({
  name: zu.varchar(),
  vat: zu.int(),
  stock: zu.int(),
});

const ProductSchemaUser = z.object({
  name: zu.varchar(),
  vat: zu.int(),
});

export const Product: zu.Schemas<typeof ProductSchemaAPI, typeof ProductSchemaUser> = {
  schemas: {
    api: ProductSchemaAPI,
    user: ProductSchemaUser,
  },
  defaultValues: {
    vat: 19,
  },
};
