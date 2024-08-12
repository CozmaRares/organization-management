import { DataFormProps } from "@/components/DataForm";
import { ColumnDef } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateDisplay(date: Date) {
  return format(date, "dd LLL y", { locale: ro });
}

export function formatDateStore(date: Date) {
  return format(date, "yyyy-MM-dd", { locale: ro });
}

export function daysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ro-Ro", {
    style: "currency",
    currency: "RON",
  }).format(amount);
}

export function makeDataFormInputs<T>(
  columns: ColumnDef<T>[],
): DataFormProps<never, never, never>["inputs"] {
  return columns
    .filter(col => "accessorKey" in col && "meta" in col)
    .map(col => ({
      id: (col as { accessorKey: string }).accessorKey,
      label: col.meta!.columnName,
      inputType: col.meta!.inputType,
    }));
}
