import DataTable from "@/components/DataTable";
import { startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import { ClientContract } from "@/lib/zod/client";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { clientContractStatus } from "@/lib/dbEnums";
import GridLoader from "@/components/GridLoader";
import AddX from "@/components/mutations/AddX";

export const Route = createLazyFileRoute("/clienti/contracte")({
  component: Page,
});

type ClientContractOutput = z.output<typeof ClientContract.schema>;

const columns = [
  {
    accessorKey: "clientName",
    header: "Client",
    filterFn: startsWithFilter as FilterFn<ClientContractOutput>,
    meta: {
      filterComponent: (table: Table<ClientContractOutput>) => (
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
    cell: ({ cell }) => (
      <div className="capitalize">{cell.getValue<string>()}</div>
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
] as const satisfies ColumnDef<ClientContractOutput>[];

function Page() {
  const { isPending, isFetching, error, data } =
    api.clients.contracts.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={
        <AddX
          title="Adaugă Contract"
          desctiption="Adaugă datele contractului aici."
          columns={columns}
          apiCreate={api.clients.contracts.create.useMutation}
          {...ClientContract}
        />
      }
    />
  );
}
