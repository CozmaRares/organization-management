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
import { MoreHorizontal, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DataForm from "@/components/DataForm";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import GridLoader from "@/components/GridLoader";
import { ProductDefaults, ProductSchema } from "@/lib/zod/product";

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
                <EditProduct
                  data={product}
                  className={classes}
                />
              </li>
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <DeleteProduct
                  productName={product.name}
                  className={classes}
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
      footer={<AddProduct />}
    />
  );
}

function AddProduct() {
  const createMutation = api.products.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger className="flex h-10 flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Plus className="h-4 w-4" />
        Adaugă Produs
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adaugă Poodus</DialogTitle>
          <DialogDescription>Adaugă datele produsului aici.</DialogDescription>
        </DialogHeader>
        <DataForm
          buttonText="Adaugă"
          onSubmit={data => createMutation.mutate(data)}
          defaultValues={ProductDefaults}
          columns={columns}
          schema={ProductSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditProduct({
  data,
  className,
}: {
  data: Product;
  className?: string;
}) {
  const updateMutation = api.products.update.useMutation();

  return (
    <Dialog>
      <DialogTrigger className={className}>Schimbă datele</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Datele Produsului</DialogTitle>
          <DialogDescription>
            <span className="block">Modifică datele produsului aici.</span>
          </DialogDescription>
        </DialogHeader>

        <DataForm
          buttonText="Salvează"
          onSubmit={data => {
            updateMutation.mutate({ ...data, pathParam: data.name });
          }}
          columns={columns}
          defaultValues={data}
          schema={ProductSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

function DeleteProduct({
  productName,
  className,
}: {
  productName: string;
  className?: string;
}) {
  const deleteMutation = api.products.delete.useMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>
        Șterge client
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esti absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Această acținue nu poate fi anulată.</p>
            <p>Datele vor fi șterse definitiv de pe server.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(productName)}
            variant="destructive"
          >
            Continuă
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
