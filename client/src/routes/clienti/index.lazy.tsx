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
import { fuzzyFilter, startsWithFilter } from "@/lib/filters";
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
import { ClientSchema } from "@/lib/zod/client";
import Error from "@/components/Error";
import AnimateEllipses from "@/components/AnimateEllipses";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { cn, makeDataFormInputs } from "@/lib/utils";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type Client = z.output<typeof ClientSchema>;

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<Client>) => (
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
    accessorKey: "cif",
    header: "CIF",
    filterFn: startsWithFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <InputFilter
          placeholder="Filtrează CIF..."
          value={(table.getColumn("cif")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("cif")?.setFilterValue(event.target.value)
          }
        />
      ),
      toggleVisibility: true,
      inputType: { type: "input" },
      columnName: "CIF",
    },
  },
  {
    accessorKey: "address",
    header: "Adresă",
    filterFn: fuzzyFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <InputFilter
          placeholder="Filtrează adresa..."
          value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("address")?.setFilterValue(event.target.value)
          }
        />
      ),
      inputType: { type: "textarea" },
      toggleVisibility: true,
      columnName: "Adresă",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

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
              <SheetDescription>Execută acțiuni extra</SheetDescription>
            </SheetHeader>

            <ul className="space-y-2 pt-4">
              <li>
                <button
                  className={classes}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(client.cif)
                      .then(() => toast({ title: "Copiat CIF cu success" }))
                  }
                >
                  Copiază CIF
                </button>
              </li>
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <EditClient
                  data={client}
                  className={classes}
                />
              </li>
              <div className="h-[1px] w-full bg-accent" />
              <li>
                <DeleteClient
                  clientName={client.name}
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

const dataFormInputs = makeDataFormInputs(columns);

function Page() {
  const { isPending, isFetching, error, data } = api.clients.get.useQuery();

  if (isPending) return <AnimateEllipses text="Se încarcă" />;

  if (isFetching) return <AnimateEllipses text="Se colectează datele" />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={<AddClient />}
    />
  );
}

function AddClient() {
  const createMutation = api.clients.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger className="flex h-10 flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Plus className="h-4 w-4" />
        Adaugă Client
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adaugă Client</DialogTitle>
          <DialogDescription>Adaugă datele clientului aici.</DialogDescription>
        </DialogHeader>
        <DataForm
          buttonText="Adaugă"
          onSubmit={data => createMutation.mutate(data)}
          inputs={dataFormInputs}
          schema={ClientSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditClient({ data, className }: { data: Client; className?: string }) {
  const updateMutation = api.clients.update.useMutation();

  return (
    <Dialog>
      <DialogTrigger className={className}>Schimbă datele</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica Datele Clientului</DialogTitle>
          <DialogDescription>
            <span className="block">Modifică datele clientului aici.</span>
          </DialogDescription>
        </DialogHeader>

        <DataForm
          buttonText="Salvează"
          onSubmit={data => {
            updateMutation.mutate({ ...data, pathParam: data.name });
          }}
          inputs={dataFormInputs}
          defaultValues={data}
          schema={ClientSchema}
        />
      </DialogContent>
    </Dialog>
  );
}

function DeleteClient({
  clientName,
  className,
}: {
  clientName: string;
  className?: string;
}) {
  const deleteMutation = api.clients.delete.useMutation();

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
            onClick={() => deleteMutation.mutate(clientName)}
            variant="destructive"
          >
            Continuă
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
