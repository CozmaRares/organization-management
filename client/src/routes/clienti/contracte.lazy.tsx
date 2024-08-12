import DataTable from "@/components/DataTable";
import { startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DataForm from "@/components/DataForm";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import { ClientContractSchema } from "@/lib/zod/client";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { clientContractStatus } from "@/lib/dbEnums";
import GridLoader from "@/components/GridLoader";

export const Route = createLazyFileRoute("/clienti/contracte")({
  component: Page,
});

type Contract = z.output<typeof ClientContractSchema>;

const columns = [
  {
    accessorKey: "clientName",
    header: "Client",
    filterFn: startsWithFilter as FilterFn<Contract>,
    meta: {
      filterComponent: (table: Table<Contract>) => (
        <InputFilter
          placeholder="Filtrează client..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
        />
      ),
      toggleVisibility: true,
      inputType: { type: "input" },
      columnName: "Client",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    meta: {
      toggleVisibility: true,
      inputType: {
        type: "select",
        options: clientContractStatus,
      },
      columnName: "Status",
    },
  },
  {
    accessorKey: "date",
    header: "Data Ef.",
    meta: {
      toggleVisibility: true,
      inputType: { type: "date" },
      columnName: "Data Ef.",
    },
  },
  {
    accessorKey: "details",
    header: "Detalii",
    meta: {
      toggleVisibility: true,
      inputType: { type: "textarea" },
      columnName: "Detalii",
    },
  },
] as const satisfies ColumnDef<Contract>[];

function Page() {
  const { isPending, isFetching, error, data } =
    api.clients.contracts.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={<AddContract />}
    />
  );
}

function AddContract() {
  const createMutation = api.clients.contracts.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger className="flex h-10 flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Plus className="h-4 w-4" />
        Adaugă Contract
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă Contract</DialogTitle>
          <DialogDescription>
            Adaugă datele contractului aici.
          </DialogDescription>
        </DialogHeader>

        <DataForm
          buttonText="Adaugă"
          onSubmit={data => createMutation.mutate(data)}
          columns={columns}
          schema={ClientContractSchema}
        />
      </DialogContent>
    </Dialog>
  );
}
