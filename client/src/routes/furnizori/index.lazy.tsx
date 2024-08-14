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
import { DataFormInput } from "@/lib/types";

export const Route = createLazyFileRoute("/furnizori/")({
  component: Page,
});

type FromAPI = z.output<typeof Supplier.schemas.api>;
type FromUser = z.input<typeof Supplier.schemas.user>;

const columns: ColumnDef<FromAPI>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<FromAPI>) => (
        <InputFilter
          placeholder="Filtrează numele..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      ),
      columnName: "Nume",
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ cell }) => (
      <div className="capitalize">{cell.getValue<string>()}</div>
    ),
    meta: {
      filterComponent: (table: Table<FromAPI>) => (
        <InputFilter
          placeholder="Filtrează status..."
          value={(table.getColumn("status")?.getFilterValue() as number) ?? ""}
          onChange={event => {
            table.getColumn("status")?.setFilterValue(event.target.value);
          }}
        />
      ),
      toggleVisibility: true,
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
              schema={Supplier.schemas.user}
              dataFormInputs={dataFormInputs}
              pathParam={supplier.name}
              apiUpdate={api.suppliers.update.useMutation}
              defaultValues={supplier}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge furnizor"
              pathParam={supplier.name}
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

const dataFormInputs: Array<DataFormInput<keyof FromUser>> = [
  {
    id: "name",
    label: "Nume",
    inputType: { type: "input" },
  },
  {
    id: "status",
    label: "Status",
    inputType: {
      type: "select",
      options: supplierStatus,
    },
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
          apiCreate={api.suppliers.create.useMutation}
          schema={Supplier.schemas.user}
          dataFormInputs={dataFormInputs}
          defaultValues={Supplier.defaultValues}
        />
      }
    />
  );
}
