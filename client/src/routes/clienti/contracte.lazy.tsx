import DataTable from "@/components/DataTable";
import { startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogContentDataForm from "@/components/DialogContentDataForm";
import InputFilter from "@/components/filters/InputFilter";
import { InputType } from "@/lib/types";
import { z } from "zod";
import { ClientContractSchema } from "@/lib/zod/client";
import Error from "@/components/Error";
import AnimateEllipses from "@/components/AnimateEllipses";
import { api } from "@/lib/api";

export const Route = createLazyFileRoute("/clienti/contracte")({
  component: Page,
});

type Contract = z.infer<typeof ClientContractSchema>;

const columns = [
  {
    accessorKey: "client_name",
    header: "Nume Client",
    filterFn: startsWithFilter as FilterFn<Contract>,
    meta: {
      filterComponent: (table: Table<Contract>) => (
        <InputFilter
          placeholder="Filtrează client..."
          value={
            (table.getColumn("client_name")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("client_name")?.setFilterValue(event.target.value)
          }
        />
      ),
      columnVisibilityName: "Nume Client",
    },
  },
  {
    accessorKey: "license",
    header: "Licență",
    filterFn: startsWithFilter as FilterFn<Contract>,
    meta: {
      filterComponent: (table: Table<Contract>) => (
        <InputFilter
          placeholder="Filtrează licența..."
          value={(table.getColumn("license")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("license")?.setFilterValue(event.target.value)
          }
        />
      ),
      columnVisibilityName: "Licență",
    },
  },
  {
    accessorKey: "quantity",
    header: "Bucăți",
    meta: {
      columnVisibilityName: "Bucăți",
    },
  },
  {
    accessorKey: "price",
    header: "Preț",
    meta: {
      columnVisibilityName: "Preț",
    },
  },
  {
    accessorKey: "type",
    header: "Tip",
    meta: {
      columnVisibilityName: "Tip",
    },
  },
  {
    accessorKey: "date",
    header: "Data Ef.",
    meta: {
      columnVisibilityName: "Data Ef.",
    },
  },
  {
    accessorKey: "details",
    header: "Detalii",
    meta: {
      columnVisibilityName: "Detalii",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      columnVisibilityName: "Status",
    },
  },
] as const satisfies ColumnDef<Contract>[];

const dialogContentInputs = columns
  .filter(col => {
    return "accessorKey" in col;
  })
  .map(({ accessorKey, header, meta }) => ({
    id: accessorKey,
    label: header,
    inputType: ("inputType" in meta ? meta.inputType : "input") as InputType,
  }));

function Page() {
  const { isPending, isFetching, error, data } =
    api.clients.contracts.get.useQuery();

  if (isPending) return <AnimateEllipses text="Se încarcă" />;

  if (isFetching) return <AnimateEllipses text="Se colectează datele" />;

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
      <DialogContentDataForm
        title="Adaugă Client"
        description={
          <>
            <span className="block">Adaugă datele clientului aici.</span>
            <span className="block">Salvează când ai terminat.</span>
          </>
        }
        buttonText="Adaugă"
        onSubmit={data => {
          createMutation.mutate(data);
        }}
        inputs={dialogContentInputs}
        schema={ClientContractSchema}
      />
    </Dialog>
  );
}
