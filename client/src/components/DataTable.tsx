import {
  ColumnDef,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Table as TanStackTable,
  RowData,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  footer?: ReactNode;
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterComponent?: (table: TanStackTable<TData>) => React.ReactNode;
  }
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  footer,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // TODO: store filters in search params
  // https://tanstack.com/table/latest/docs/framework/react/examples/query-router-search-params
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters,
    },
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-between gap-2 py-4">
        <div className="grid grid-cols-5 gap-2">
          {columns.map(column => {
            const meta = column.meta;
            if (!meta?.filterComponent) return null;
            return meta.filterComponent(table);
          })}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto mt-auto"
            >
              Coloane
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Tbl
          table={table}
          columns={columns}
        />
      </div>
      <div className="flex items-center gap-2 py-4">
        <div>{footer}</div>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={value => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="ml-auto w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map(pageSize => (
              <SelectItem
                key={`table pagination show ${pageSize}`}
                value={pageSize.toString()}
              >
                Arata {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Inapoi
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Inainte
        </Button>
      </div>
    </div>
  );
}

type TblProps<TData, TValue> = Pick<Props<TData, TValue>, "columns"> & {
  table: TanStackTable<TData>;
};

function Tbl<TData, TValue>({ table, columns }: TblProps<TData, TValue>) {
  if (table.getHeaderGroups()[0].headers.length == 0)
    return (
      <Table>
        <TableRow className="border-0">
          <TableHead
            colSpan={columns.length}
            className="text-center"
          >
            Nici o coloana.
          </TableHead>
        </TableRow>
      </Table>
    );

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => {
              return (
                <TableHead
                  key={header.id}
                  style={{
                    width: computeCellSize(header.getSize()),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell
                  key={cell.id}
                  style={{
                    width: computeCellSize(cell.column.getSize()),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center"
            >
              Nici un rezultat.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function computeCellSize(size: number) {
  if (size == Number.MAX_SAFE_INTEGER) return "auto";

  return size;
}
