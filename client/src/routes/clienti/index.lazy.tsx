import DataTable from "@/components/DataTable";
import { fuzzyFilter, startsWithFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import { Client } from "@/lib/zod/client";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import GridLoader from "@/components/GridLoader";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";
import ActionMenu, { actionButtonClasses } from "@/components/ActionMenu";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type ClientOutput = z.output<typeof Client.schema>;

const columns: ColumnDef<ClientOutput>[] = [
  {
    accessorKey: "name",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<ClientOutput>) => (
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
    filterFn: startsWithFilter as FilterFn<ClientOutput>,
    meta: {
      filterComponent: (table: Table<ClientOutput>) => (
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
    filterFn: fuzzyFilter as FilterFn<ClientOutput>,
    meta: {
      filterComponent: (table: Table<ClientOutput>) => (
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

      return (
        <ActionMenu
          actions={[
            <button
              className={actionButtonClasses}
              onClick={() =>
                navigator.clipboard
                  .writeText(client.cif)
                  .then(() => toast({ title: "Copiat CIF cu success" }))
              }
            >
              Copiază CIF
            </button>,
            <UpdateX
              triggerText="Schimbă datele"
              title="Modifica Datele Clientului"
              desctiption="Modifică datele clientului  aici."
              columns={columns}
              schema={Client.schema}
              apiUpdate={api.clients.update.useMutation}
              defaultValues={client}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge client"
              id={client.name}
              className={actionButtonClasses}
              apiDelete={api.clients.delete.useMutation}
            />,
          ]}
        />
      );
    },
    size: 70,
  },
];

function Page() {
  const { isPending, isFetching, error, data } = api.clients.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={
        <AddX
          title="Adaugă Client"
          desctiption="Adaugă datele clientului aici."
          columns={columns}
          apiCreate={api.clients.create.useMutation}
          {...Client}
        />
      }
    />
  );
}
