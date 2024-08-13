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

export const Route = createLazyFileRoute("/produse/")({
  component: Page,
});

type ProductOutput = z.output<typeof Product.schema>;

const columns: ColumnDef<ProductOutput>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<ProductOutput>) => (
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
    accessorKey: "vat",
    header: "TVA",
    filterFn: equalsFilter as FilterFn<ProductOutput>,
    cell: ({ cell }) => <div>{cell.getValue<number>()} %</div>,
    meta: {
      filterComponent: (table: Table<ProductOutput>) => (
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
      inputType: { type: "input" },
      columnName: "TVA",
    },
  },
  {
    accessorKey: "stock",
    header: "Stoc",
    filterFn: equalsFilter as FilterFn<ProductOutput>,
    meta: {
      filterComponent: (table: Table<ProductOutput>) => (
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
      inputType: { type: "input" },
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
              columns={columns}
              schema={Product.schema}
              apiUpdate={api.products.update.useMutation}
              defaultValues={product}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge produs"
              id={product.name}
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
          columns={columns}
          apiCreate={api.products.create.useMutation}
          {...Product}
        />
      }
    />
  );
}
