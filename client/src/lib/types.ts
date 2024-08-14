import { RowData, Table } from "@tanstack/react-table";

export type InputType =
  | { type: "input" }
  | { type: "textarea" }
  | { type: "date" }
  | { type: "select"; options: readonly string[] };

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    inputWrapperClassName?: string;
    columnName: string;
    filterComponent?: (table: Table<TData>) => React.ReactNode;
    toggleVisibility?: boolean;
  }
}

export type DataFormInput<T extends string> = {
  id: T;
  label: string;
  inputType: InputType;
  inputWrapperClassName?: string;
};
