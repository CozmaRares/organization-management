import { z } from "zod";
import { zdate, zfloat, zint, zvarchar, zenum } from "./utils";
import { supplierStatus } from "../dbEnums";
import { ZodCustom } from "../types";

const SupplierSchema = z.object({
  name: zvarchar(),
  status: zenum(supplierStatus),
});

export const Supplier: ZodCustom<typeof SupplierSchema> = {
  schema: SupplierSchema,
  defaultValues: {
    status: "activ",
  },
};

const SupplierBillSchema = z.object({
  id: zint(),
  supplierName: zvarchar(),
  issuedDate: zdate(),
  dueDate: zdate(),
  total: zfloat(),
  paid: zfloat(),
});

export const SupplierBill: ZodCustom<typeof SupplierBillSchema> = {
  schema: SupplierBillSchema,
  defaultValues: {
    issuedDate: new Date(),
    dueDate: new Date(),
    paid: 0,
  },
};
