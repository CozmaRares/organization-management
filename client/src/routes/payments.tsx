// TODO: remove me

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments")({
  component: DemoPage,
});

import { Payment, columns } from "@/components/payments/columns";
import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

export default function DemoPage() {
  return (
    <div className="container py-10">
      <DataTable
        columns={columns}
        data={data}
        filters={table => (
          <>
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? ""
              }
              onValueChange={value =>
                value == "clear"
                  ? table.getColumn("status")?.setFilterValue("")
                  : table.getColumn("status")?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="clear">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={event =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-[200px]"
            />
          </>
        )}
      />
    </div>
  );
}
