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
import { fuzzyFilter } from "@/lib/filters";
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
import useQuery from "@/hooks/useQuery";
import { z } from "zod";
import { ClientValidator } from "@/lib/zod/client";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type Client = z.infer<typeof ClientValidator>;

const columns = [
  {
    accessorKey: "cif",
    header: "CIF",
    filterFn: (row, columnID, filterValue) => {
      return (row.getValue(columnID) as string).startsWith(filterValue);
    },
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
    accessorKey: "workplace",
    header: "Punct de Lucru",
    filterFn: fuzzyFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <InputFilter
          placeholder="Filtrează punct de lucru..."
          value={
            (table.getColumn("workplace")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("workplace")?.setFilterValue(event.target.value)
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
                <DropdownMenuItem>
                  <DialogTrigger>Schimbă datele</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertDialogTrigger>Șterge client</AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContentDataForm
              title="Modifica Datele Clientului"
              description={
                <>
                  <p>Modifică datele clientului aici.</p>
                  <p>Dă click pe salveaza cand ai terminat.</p>
                </>
              }
              footer={<Button type="submit">Salvează</Button>}
              inputs={dialogContentInputs.map(inp => ({
                ...inp,
                defaultValue: client[inp.id],
              }))}
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
                <AlertDialogAction variant="destructive">
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
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["clients"],
    url: "/api/clienti",
    validator: z.array(ClientValidator),
  });

  if (isPending) return "Loading...";

  if (isFetching) return "Fetching...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={<AddClient />}
    />
  );
}

function AddClient() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          type="button"
          variant="outline"
          className="flex flex-row items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adaugă Client
        </Button>
      </DialogTrigger>
      <DialogContentDataForm
        title="Adaugă Client"
        footer={<Button type="submit">Adaugă</Button>}
        inputs={dialogContentInputs}
      />
    </Dialog>
  );
}
