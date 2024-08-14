import DataTable from "@/components/DataTable";
import { equalsFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import GridLoader from "@/components/GridLoader";
import { Product } from "@/lib/zod/product";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";
import ActionMenu, { actionButtonClasses } from "@/components/ActionMenu";
import { DataFormInput } from "@/lib/types";

export const Route = createLazyFileRoute("/produse/")({
  component: Page,
});

type FromAPI = z.output<typeof Product.schemas.api>;
type FromUser = z.input<typeof Product.schemas.user>;

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
    accessorKey: "vat",
    header: "TVA",
    filterFn: equalsFilter as FilterFn<FromAPI>,
    cell: ({ cell }) => <div>{cell.getValue<number>()} %</div>,
    meta: {
      filterComponent: (table: Table<FromAPI>) => (
        <InputFilter
          placeholder="Filtrează TVA..."
          value={(table.getColumn("vat")?.getFilterValue() as number) ?? ""}
          onChange={event => {
            const value = event.target.value;

            if (value == "") table.getColumn("vat")?.setFilterValue("");

            if (/^\d+$/.test(value))
              table.getColumn("vat")?.setFilterValue(Number(value));
          }}
        />
      ),
      toggleVisibility: true,
      columnName: "TVA",
    },
  },
  {
    accessorKey: "stock",
    header: "Stoc",
    filterFn: equalsFilter as FilterFn<FromAPI>,
    meta: {
      filterComponent: (table: Table<FromAPI>) => (
        <InputFilter
          placeholder="Filtrează stoc..."
          value={(table.getColumn("stock")?.getFilterValue() as number) ?? ""}
          onChange={event => {
            const value = event.target.value;
            if (/^\d*$/.test(value))
              table.getColumn("stock")?.setFilterValue(Number(value));
          }}
        />
      ),
      toggleVisibility: true,
      columnName: "Stoc",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <ActionMenu
          actions={[
            <UpdateX
              triggerText="Schimbă datele"
              title="Modifica Datele Produsului"
              desctiption="Modifică datele produsului aici."
              schema={Product.schemas.user}
              dataFormInputs={dataFormInputs}
              pathParam={product.name}
              apiUpdate={api.products.update.useMutation}
              defaultValues={product}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge produs"
              pathParam={product.name}
              className={actionButtonClasses}
              apiDelete={api.products.delete.useMutation}
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
    id: "vat",
    label: "TVA",
    inputType: {
      type: "input",
    },
  },
];

// TODO: add show supplier stock action

function Page() {
  const { isPending, isFetching, error, data } = api.products.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={
        <AddX
          title="Adaugă Produs"
          desctiption="Adaugă datele produsului aici."
          apiCreate={api.products.create.useMutation}
          schema={Product.schemas.user}
          defaultValues={Product.defaultValues}
          dataFormInputs={dataFormInputs}
        />
      }
    />
  );
}
