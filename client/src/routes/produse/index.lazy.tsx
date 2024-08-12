import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DataTable from "@/components/DataTable";
import { buttonVariants } from "@/components/ui/button";
import { equalsFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import { MoreHorizontal, X } from "lucide-react";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import GridLoader from "@/components/GridLoader";
import { ProductDefaults, ProductSchema } from "@/lib/zod/product";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";

export const Route = createLazyFileRoute("/produse/")({
  component: Page,
});

type Product = z.output<typeof ProductSchema>;

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<Product>) => (
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
    filterFn: equalsFilter as FilterFn<Product>,
    cell: ({ cell }) => <div>{cell.getValue<number>()} %</div>,
    meta: {
      filterComponent: (table: Table<Product>) => (
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
    filterFn: equalsFilter as FilterFn<Product>,
    meta: {
      filterComponent: (table: Table<Product>) => (
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

      const classes = cn(
        buttonVariants({ variant: "ghost" }),
        "w-full justify-start",
      );

      return (
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "aspect-square h-fit p-0",
            )}
          >
            <span className="sr-only">Deschide meniul</span>
            <MoreHorizontal className="h-[1em]" />
          </SheetTrigger>
          <SheetContent>
            <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>

            <SheetHeader className="items-center">
              <SheetTitle>Acțiuni</SheetTitle>
              <SheetDescription>Acțiuni adiționale</SheetDescription>
            </SheetHeader>

            <ul className="space-y-2 pt-4">
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <UpdateX
                  triggerText="Schimbă datele"
                  title="Modifica Datele Produsului"
                  desctiption="Modifică datele produsului aici."
                  columns={columns}
                  schema={ProductSchema}
                  apiUpdate={api.products.update.useMutation}
                  defaultValues={product}
                  className={classes}
                />
              </li>
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <DeleteX
                  triggerText="Șterge produs"
                  id={product.name}
                  className={classes}
                  apiDelete={api.products.delete.useMutation}
                />
              </li>
            </ul>
          </SheetContent>
        </Sheet>
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
          schema={ProductSchema}
          defaultValues={ProductDefaults}
          apiCreate={api.products.create.useMutation}
        />
      }
    />
  );
}
