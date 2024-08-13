import { z } from "zod";
import { zdate, zenum, zvarchar } from "./utils";
import { clientContractStatus } from "../dbEnums";

export const ClientSchema = z.object({
  name: zvarchar(),
  address: zvarchar(),
  cif: zvarchar(),
});

export const ClientContractSchema = z.object({
  clientName: zvarchar(),
  date: zdate(),
  details: zvarchar(),
  status: zenum(clientContractStatus),
});
