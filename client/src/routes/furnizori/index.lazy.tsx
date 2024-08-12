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
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, Table } from "@tanstack/react-table";
import { MoreHorizontal, X } from "lucide-react";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import GridLoader from "@/components/GridLoader";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";
import { SupplierSchema } from "@/lib/zod/supplier";
import { supplierStatus } from "@/lib/dbEnums";

export const Route = createLazyFileRoute("/furnizori/")({
  component: Page,
});

type Supplier = z.output<typeof SupplierSchema>;

const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<Supplier>) => (
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
      filterComponent: (table: Table<Supplier>) => (
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
                  title="Modifica Datele Furnizorului"
                  desctiption="Modifică datele furnizorului aici."
                  columns={columns}
                  schema={SupplierSchema}
                  apiUpdate={api.suppliers.update.useMutation}
                  defaultValues={supplier}
                  className={classes}
                />
              </li>
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <DeleteX
                  triggerText="Șterge furnizor"
                  id={supplier.name}
                  className={classes}
                  apiDelete={api.suppliers.delete.useMutation}
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
          schema={SupplierSchema}
          apiCreate={api.suppliers.create.useMutation}
        />
      }
    />
  );
}
