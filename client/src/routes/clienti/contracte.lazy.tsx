import DataTable from "@/components/DataTable";
import { startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogContentDataForm, {
  DialogContentDataFormProps,
} from "@/components/DialogContentDataForm";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import { ClientContractSchema } from "@/lib/zod/client";
import Error from "@/components/Error";
import AnimateEllipses from "@/components/AnimateEllipses";
import { api } from "@/lib/api";
import { clientContractStatus, clientContractType } from "@/lib/dbEnums";
import { formatCurrency } from "@/lib/utils";

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
      toggleVisibility: true,
      inputType: { type: "input" },
    },
  },
  {
    accessorKey: "type",
    header: "Tip",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
    meta: {
      toggleVisibility: true,
      inputType: { type: "select", options: clientContractType },
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
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Bucăți</div>,
    cell: props => {
      const amount = parseFloat(props.getValue() as string);
      return <div className="text-right font-medium">{amount}</div>;
    },
    meta: {
      toggleVisibility: true,
      inputType: { type: "input" },
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Preț</div>,
    cell: props => {
      const amount = parseFloat(props.getValue() as string);
      const formatted = formatCurrency(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    meta: {
      toggleVisibility: true,
      inputType: { type: "input" },
    },
  },
  {
    accessorKey: "date",
    header: "Data Ef.",
    meta: {
      toggleVisibility: true,
      inputType: { type: "date" },
    },
  },
  {
    accessorKey: "details",
    header: "Detalii",
    meta: {
      toggleVisibility: true,
      inputType: { type: "textarea" },
    },
  },
] as const satisfies ColumnDef<Contract>[];

const dialogContentInputs: DialogContentDataFormProps<
  never,
  never,
  never
>["inputs"] = columns
  .filter(col => {
    return "accessorKey" in col && "meta" in col;
  })
  .map(({ accessorKey, header, meta }) => ({
    id: accessorKey,
    label: header,
    inputType: meta.inputType,
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
        title="Adaugă Contract"
        description={
          <>
            <span className="block">Adaugă datele contractului aici.</span>
            <span className="block">Salvează când ai terminat.</span>
          </>
        }
        buttonText="Adaugă"
        onSubmit={data => createMutation.mutate(data)}
        inputs={dialogContentInputs}
        schema={ClientContractSchema}
      />
    </Dialog>
  );
}
