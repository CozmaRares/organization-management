import { z } from "zod";
import * as zu from "./utils";
import { supplierStatus } from "../dbEnums";

const SupplierSchema = z.object({
  name: zu.varchar(),
  status: zu._enum(supplierStatus),
});

export const Supplier: zu.Schemas<
  typeof SupplierSchema,
  typeof SupplierSchema
> = {
  schemas: {
    api: SupplierSchema,
    user: SupplierSchema,
  },
  defaultValues: {
    status: "activ",
  },
};

const SupplierBillSchemaAPI = z.object({
  id: zu.int(),
  supplierName: zu.varchar(),
  issuedDate: zu.date.api(),
  dueDate: zu.date.api(),
  total: zu.float(),
  paid: zu.float(),
});

const SupplierBillSchemaUser = z.object({
  supplierName: zu.varchar(),
  issuedDate: zu.date.user(),
  dueDate: zu.date.user(),
  total: zu.float(),
});

export const SupplierBill: zu.Schemas<
  typeof SupplierBillSchemaAPI,
  typeof SupplierBillSchemaUser
> = {
  schemas: {
    api: SupplierBillSchemaAPI,
    user: SupplierBillSchemaUser,
  },
  defaultValues: {
    issuedDate: new Date(),
    dueDate: new Date(),
  },
};
