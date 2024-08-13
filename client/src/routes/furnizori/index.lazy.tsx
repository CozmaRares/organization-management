import DataTable from "@/components/DataTable";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, Table } from "@tanstack/react-table";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import GridLoader from "@/components/GridLoader";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";
import { Supplier } from "@/lib/zod/supplier";
import { supplierStatus } from "@/lib/dbEnums";
import ActionMenu, { actionButtonClasses } from "@/components/ActionMenu";

export const Route = createLazyFileRoute("/furnizori/")({
  component: Page,
});

type SupplierOutput = z.output<typeof Supplier.schema>;

const columns: ColumnDef<SupplierOutput>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<SupplierOutput>) => (
        <InputFilter
          placeholder="Filtrează numele..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      ),
      inputType: { type: "input" },
      columnName: "Nume",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterComponent: (table: Table<SupplierOutput>) => (
        <InputFilter
          placeholder="Filtrează status..."
          value={(table.getColumn("status")?.getFilterValue() as number) ?? ""}
          onChange={event => {
            table.getColumn("status")?.setFilterValue(event.target.value);
          }}
        />
      ),
      toggleVisibility: true,
      inputType: { type: "select", options: supplierStatus },
      columnName: "Status",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <ActionMenu
          actions={[
            <UpdateX
              triggerText="Schimbă datele"
              title="Modifica Datele Furnizorului"
              desctiption="Modifică datele furnizorului aici."
              columns={columns}
              schema={Supplier.schema}
              apiUpdate={api.suppliers.update.useMutation}
              defaultValues={supplier}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge furnizor"
              id={supplier.name}
              className={actionButtonClasses}
              apiDelete={api.suppliers.delete.useMutation}
            />,
          ]}
        />
      );
    },
    size: 70,
  },
];

// TODO: add show supplier stock action

function Page() {
  const { isPending, isFetching, error, data } = api.suppliers.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={
        <AddX
          title="Adaugă Furnizor"
          desctiption="Adaugă datele furnizorului aici."
          columns={columns}
          apiCreate={api.suppliers.create.useMutation}
          {...Supplier}
        />
      }
    />
  );
}
