import DataTable from "@/components/DataTable";
import { dateRangeFilter } from "@/lib/filters";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ColumnDef, FilterFn, Table } from "@tanstack/react-table";
import InputFilter from "@/components/filters/InputFilter";
import { z } from "zod";
import Error from "@/components/Error";
import { api } from "@/lib/api";
import GridLoader from "@/components/GridLoader";
import AddX from "@/components/mutations/AddX";
import UpdateX from "@/components/mutations/UpdateX";
import DeleteX from "@/components/mutations/DeleteX";
import ActionMenu, { actionButtonClasses } from "@/components/ActionMenu";
import { SupplierBill } from "@/lib/zod/supplier";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import { DateRange } from "react-day-picker";
import { formatDateDisplay } from "@/lib/utils";

export const Route = createLazyFileRoute("/facturi/furnizori")({
  component: Page,
});

type SupplierBillOutput = z.output<typeof SupplierBill.schema>;

const columns: ColumnDef<SupplierBillOutput>[] = [
  {
    accessorKey: "supplierName",
    header: "Furnizor",
    meta: {
      filterComponent: (table: Table<SupplierBillOutput>) => (
        <InputFilter
          placeholder="Filtrează furnizor..."
          value={
            (table.getColumn("supplierName")?.getFilterValue() as string) ?? ""
          }
          onChange={event =>
            table.getColumn("supplierName")?.setFilterValue(event.target.value)
          }
        />
      ),
      inputType: { type: "input" },
      inputWrapperClassName: "col-span-2",
      columnName: "Furnizor",
    },
  },
  {
    accessorKey: "issuedDate",
    header: "Data Emisă",
    filterFn: dateRangeFilter as FilterFn<SupplierBillOutput>,
    cell: ({ cell }) => (
      <div>{formatDateDisplay(new Date(cell.getValue<string>()))}</div>
    ),
    meta: {
      filterComponent: (table: Table<SupplierBillOutput>) => (
        <DateRangeFilter
          placeholder="Filtrează dată emisă..."
          date={
            table.getColumn("issuedDate")?.getFilterValue() as
              | DateRange
              | undefined
          }
          setDate={range =>
            table.getColumn("issuedDate")?.setFilterValue(range)
          }
        />
      ),
      toggleVisibility: true,
      inputType: { type: "date" },
      columnName: "Data Emisă",
    },
  },
  {
    accessorKey: "dueDate",
    header: "Data Scadentă",
    filterFn: dateRangeFilter as FilterFn<SupplierBillOutput>,
    cell: ({ cell }) => (
      <div>{formatDateDisplay(new Date(cell.getValue<string>()))}</div>
    ),
    meta: {
      filterComponent: (table: Table<SupplierBillOutput>) => (
        <DateRangeFilter
          placeholder="Filtrează dată scadentă..."
          date={
            table.getColumn("dueDate")?.getFilterValue() as
              | DateRange
              | undefined
          }
          setDate={range => table.getColumn("dueDate")?.setFilterValue(range)}
        />
      ),
      inputType: { type: "date" },
      toggleVisibility: true,
      columnName: "Data Scadentă",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const bill = row.original;

      return (
        <ActionMenu
          actions={[
            <UpdateX
              triggerText="Schimbă datele"
              title="Modifica Datele Facturii"
              desctiption="Modifică datele facturii aici."
              columns={columns}
              schema={SupplierBill.schema}
              apiUpdate={api.suppliers.bills.update.useMutation}
              pathParam={`${bill.id}`}
              defaultValues={bill}
              className={actionButtonClasses}
            />,
            <DeleteX
              triggerText="Șterge factură"
              pathParam={`${bill.id}`}
              className={actionButtonClasses}
              apiDelete={api.suppliers.bills.delete.useMutation}
            />,
          ]}
        />
      );
    },
    size: 70,
  },
];

function Page() {
  const { isPending, isFetching, error, data } =
    api.suppliers.bills.get.useQuery();

  if (isPending || isFetching) return <GridLoader />;

  if (error) return <Error title="Hopa! E bai!">{error.message}</Error>;

  return (
    <DataTable
      columns={columns}
      data={data}
      footer={
        <AddX
          title="Adaugă Factură"
          desctiption="Adaugă datele clientului aici."
          columns={columns}
          apiCreate={api.suppliers.bills.create.useMutation}
          {...SupplierBill}
        />
      }
    />
  );
}

