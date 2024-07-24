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
import { Input } from "@/components/ui/input";
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
import DialogContentDataForm, {
  DialogContentDataFormProps,
} from "@/components/DialogContentDataForm";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type Client = {
  nume: string;
  adresa: string;
  cif: string;
  punct_lucru: string;
};

const dialogContentInputs = [
  {
    id: "cif",
    label: "CIF",
    inputType: "input",
  },
  {
    id: "nume",
    label: "Nume",
    inputType: "input",
  },
  {
    id: "adresa",
    label: "Adresa",
    inputType: "textarea",
  },
  {
    id: "punct_lucru",
    label: "Punct de Lucru",
    inputType: "textarea",
  },
] as const satisfies DialogContentDataFormProps["inputs"];

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "cif",
    header: "CIF",
    filterFn: (row, columnID, filterValue) => {
      return (row.getValue(columnID) as string).startsWith(filterValue);
    },
    meta: {
      filterComponent: (table: Table<Client>) => (
        <Input
          placeholder="Filtreaza CIF..."
          value={(table.getColumn("cif")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("cif")?.setFilterValue(event.target.value)
          }
        />
      ),
    },
  },
  {
    accessorKey: "nume",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<Client>) => (
        <Input
          placeholder="Filtreaza numele..."
          value={(table.getColumn("nume")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("nume")?.setFilterValue(event.target.value)
          }
        />
      ),
    },
  },
  {
    accessorKey: "adresa",
    header: "Adresa",
    filterFn: fuzzyFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <Input
          placeholder="Filtreaza adresa..."
          value={(table.getColumn("adresa")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("adresa")?.setFilterValue(event.target.value)
          }
        />
      ),
    },
  },
  {
    accessorKey: "punct_lucru",
    header: "Punct de Lucru",
    filterFn: fuzzyFilter as FilterFn<Client>,
    meta: {
      filterComponent: (table: Table<Client>) => (
        <Input
          placeholder="Filtreaza punct de lucru..."
          value={
            (table.getColumn("punct_lucru")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("punct_lucru")?.setFilterValue(event.target.value)
          }
        />
      ),
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
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Deschide meniu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actiuni</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(client.cif)}
                >
                  Copiaza CIF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DialogTrigger>Schimba datele</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertDialogTrigger>Sterge client</AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContentDataForm
              title="Modifica Datele Clientului"
              description={
                <>
                  <p>Modifica datele clientului aici.</p>
                  <p>Da click pe salveaza cand ai terminat.</p>
                </>
              }
              footer={<Button type="submit">Salveaza</Button>}
              inputs={dialogContentInputs.map(inp => ({
                ...inp,
                defaultValue: client[inp.id],
              }))}
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Esti absolut sigur?</AlertDialogTitle>
                <AlertDialogDescription>
                  <p>Aceasta actinue nu poate fi anulata.</p>
                  <p>Datele vor fi sterse definitiv de pe server.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuleaza</AlertDialogCancel>
                <AlertDialogAction variant="destructive">
                  Continua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      );
    },
    size: 70,
  },
];

const data = new Array(1)
  .fill([
    {
      nume: "aa",
      adresa: "a",
      cif: "12345",
      punct_lucru: "Aiud, Alba",
    },
    {
      nume: "bb",
      adresa: "a",
      cif: "23456",
      punct_lucru: "Gladiolelor, Alba Iulia",
    },
  ])
  .flat();

function Page() {
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
          Adauga Client
        </Button>
      </DialogTrigger>
      <DialogContentDataForm
        title="Adauga Client"
        footer={<Button type="submit">Adauga</Button>}
        inputs={dialogContentInputs}
      />
    </Dialog>
  );
}
