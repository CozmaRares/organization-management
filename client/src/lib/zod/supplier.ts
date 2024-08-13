import { z } from "zod";
import { zdate, zfloat, zint, zvarchar, zenum } from "./utils";
import { supplierStatus } from "../dbEnums";

export const SupplierSchema = z.object({
  name: zvarchar(),
  status: zenum(supplierStatus),
});

export const SupplierBillSchema = z.object({
  id: zint(),
  supplierName: zvarchar(),
  issuedDate: zdate(),
  dueDate: zdate(),
  total: zfloat(),
  paid: zfloat(),
});
