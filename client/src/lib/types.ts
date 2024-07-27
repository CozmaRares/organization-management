import { RowData, Table } from "@tanstack/react-table";

export type InputType = "input" | "textarea" | "date";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    inputType?: InputType;
    filterComponent?: (table: Table<TData>) => React.ReactNode;
    columnVisibilityName: string;
  }
}
