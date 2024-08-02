import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fuzzyFilter, startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import DialogContentDataForm from "@/components/DialogContentDataForm";
import InputFilter from "@/components/filters/InputFilter";
import { InputType } from "@/lib/types";
import { z } from "zod";
import { ClientValidator } from "@/lib/zod/client";
import Error from "@/components/Error";
import AnimateEllipses from "@/components/AnimateEllipses";
import { api } from "@/lib/api";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type Client = z.infer<typeof ClientValidator>;

const columns = [
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
      columnVisibilityName: "CIF",
    },
  },
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
      columnVisibilityName: "Nume",
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
      inputType: "textarea",
      columnVisibilityName: "Adresă",
    },
  },
  {
    accessorKey: "workpoint",
    header: "Punct de Lucru",
    filterFn: fuzzyFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <InputFilter
          placeholder="Filtrează punct de lucru..."
          value={
            (table.getColumn("workpoint")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("workpoint")?.setFilterValue(event.target.value)
          }
        />
      ),
      inputType: "textarea",
      columnVisibilityName: "Punct de lucru",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      const deleteMutation = api.clients.delete.useMutation();
      const updateMutation = api.clients.update.useMutation();

      return (
        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="aspect-square h-fit p-0"
                >
                  <span className="sr-only">Deschide meniu</span>
                  <MoreHorizontal className="h-[1em]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(client.cif)}
                >
                  Copiază CIF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                  <DialogTrigger className="w-full px-2 py-1.5 text-left">
                    Schimbă datele
                  </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <AlertDialogTrigger className="w-full px-2 py-1.5 text-left">
                    Șterge client
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContentDataForm
              title="Modifica Datele Clientului"
              description={
                <>
                  <span className="block">
                    Modifică datele clientului aici.
                  </span>
                  <span className="block">Salvează când ai terminat.</span>
                </>
              }
              buttonText="Salvează"
              onSubmit={data => {
                updateMutation.mutate({ ...data, pathParam: client.name });
              }}
              inputs={dialogContentInputs}
              defaultValues={client}
              schema={ClientValidator}
            />

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
                  onClick={() => deleteMutation.mutate(client.name)}
                  variant="destructive"
                >
                  Continuă
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      );
    },
    size: 70,
  },
] as const satisfies ColumnDef<Client>[];

const dialogContentInputs = columns
  .filter(col => {
    return "accessorKey" in col;
  })
  .map(({ accessorKey, header, meta }) => ({
    id: accessorKey,
    label: header,
    inputType: ("inputType" in meta ? meta.inputType : "input") as InputType,
  }));

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
      <DialogContentDataForm
        title="Adaugă Client"
        description={
          <>
            <span className="block">Adaugă datele clientului aici.</span>
            <span className="block">Salvează când ai terminat.</span>
          </>
        }
        buttonText="Adaugă"
        onSubmit={data => {
          createMutation.mutate(data);
        }}
        inputs={dialogContentInputs}
        schema={ClientValidator}
      />
    </Dialog>
  );
}
