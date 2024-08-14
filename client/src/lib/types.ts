import { RowData, Table } from "@tanstack/react-table";
import { z } from "zod";

export type InputType =
  | { type: "input" }
  | { type: "textarea" }
  | { type: "date" }
  | { type: "select"; options: readonly string[] };

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    inputType?: InputType;
    inputWrapperClassName?: string,
    columnName: string;
    filterComponent?: (table: Table<TData>) => React.ReactNode;
    toggleVisibility?: boolean;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZodCustom<T extends z.ZodSchema<any, any, any>> = {
  schema: T;
  defaultValues?: Partial<z.input<T>>;
};
