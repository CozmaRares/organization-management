// TODO: advanced filters
// https://github.com/TanStack/table/discussions/4133

import DataTable from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";

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
  },
  {
    accessorKey: "adresa",
    header: "Adresa",
  },
  {
    accessorKey: "cif",
    header: "CIF",
    filterFn: (row, _, filterValue) => {
      return row.original.cif.startsWith(filterValue);
    },
  },
  {
    accessorKey: "punct_lucru",
    header: "Punct de Lucru",
  },
];

const data = [
  {
    nume: "a",
    adresa: "a",
    cif: "12345",
    punct_lucru: "a",
  },
  {
    nume: "a",
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
      filters={table => (
        <Input
          placeholder="Filter CIF..."
          value={(table.getColumn("cif")?.getFilterValue() as string) ?? ""}
          onChange={event =>
            table.getColumn("cif")?.setFilterValue(event.target.value)
          }
          className="max-w-[200px]"
        />
      )}
    />
  );
}
