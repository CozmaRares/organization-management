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
import { DataFormInput } from "@/lib/types";
import { formatDateDisplay } from "@/lib/utils";

export const Route = createLazyFileRoute("/clienti/contracte")({
  component: Page,
});

type FromAPI = z.output<typeof ClientContract.schemas.api>;
type FromUser = z.input<typeof ClientContract.schemas.user>;

const columns: ColumnDef<FromAPI>[] = [
  {
    accessorKey: "clientName",
    header: "Client",
    filterFn: startsWithFilter as FilterFn<FromAPI>,
    meta: {
      filterComponent: (table: Table<FromAPI>) => (
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
      columnName: "Status",
    },
  },
  {
    accessorKey: "date",
    header: "Data Ef.",
    cell: ({ cell }) => <div>{formatDateDisplay(cell.getValue<Date>())}</div>,
    meta: {
      toggleVisibility: true,
      columnName: "Data Ef.",
    },
  },
  {
    accessorKey: "details",
    header: "Detalii",
    meta: {
      toggleVisibility: true,
      columnName: "Detalii",
    },
  },
];

const dataFormInputs: Array<DataFormInput<keyof FromUser>> = [
  {
    id: "clientName",
    label: "Client",
    inputType: { type: "input" },
    inputWrapperClassName: "col-span-2",
  },
  {
    id: "status",
    label: "Status",
    inputType: {
      type: "select",
      options: clientContractStatus,
    },
  },
  {
    id: "date",
    label: "Data Ef.",
    inputType: { type: "date" },
  },
  {
    id: "details",
    label: "Detalii",
    inputType: { type: "textarea" },
    inputWrapperClassName: "col-span-2",
  },
];

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
          dataFormInputs={dataFormInputs}
          apiCreate={api.clients.contracts.create.useMutation}
          schema={ClientContract.schemas.user}
          defaultValues={ClientContract.defaultValues}
        />
      }
    />
  );
}
