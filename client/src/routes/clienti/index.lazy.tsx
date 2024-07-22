// TODO: advanced filters
// https://github.com/TanStack/table/discussions/4133

import DataTable from "@/components/DataTable";
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
  },
];

const data = [
  {
    nume: "a",
    adresa: "a",
    cif: "a",
    punct_lucru: "a",
  },
];

function Page() {
  return (
    <DataTable
      columns={columns}
      data={data}
      filters={() => null}
    />
  );
}
