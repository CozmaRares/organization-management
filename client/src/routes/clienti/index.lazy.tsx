// TODO: advanced filters
// https://github.com/TanStack/table/discussions/4133

import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, Table } from "@tanstack/react-table";

export const Route = createLazyFileRoute("/clienti/")({
  component: Page,
});

type Client = {
  nume: string;
  adresa: string;
  cif: string;
  punct_lucru: string;
};

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "nume",
    header: "Nume",
    meta: {
      filterComponent: (table: Table<unknown>) => (
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
    meta: {
      filterComponent: (table: Table<unknown>) => (
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
    accessorKey: "cif",
    header: "CIF",
    filterFn: (row, _, filterValue) => {
      return row.original.cif.startsWith(filterValue);
    },
    meta: {
      filterComponent: (table: Table<unknown>) => (
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
    accessorKey: "punct_lucru",
    header: "Punct de Lucru",
    meta: {
      filterComponent: (table: Table<unknown>) => (
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
];

const data = [
  {
    nume: "aa",
    adresa: "a",
    cif: "12345",
    punct_lucru: "a",
  },
  {
    nume: "bb",
    adresa: "a",
    cif: "23456",
    punct_lucru: "a",
  },
];

function Page() {
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  );
}
