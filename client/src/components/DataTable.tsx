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
import { Fragment, useEffect, useRef, useState } from "react";
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
import NumberInput from "./NumberInput";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  footer?: ReactNode;
};

// TODO: serverside pagination and filtering
export default function DataTable<TData, TValue>({
  columns,
  data,
  footer,
}: Props<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: Math.min(10, data.length),
  }));
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },

    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-between py-4">
        <div className="flex-items flew-row flex w-4/5 flex-wrap-reverse [--flex-items:5] [--gap:0.5rem]">
          {columns.map((column, idx) => {
            const meta = column.meta;
            if (!meta?.filterComponent) return null;
            return (
              <Fragment key={`filter-${idx}`}>
                {meta.filterComponent(table)}
              </Fragment>
            );
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
              .filter(
                column =>
                  column.getCanHide() &&
                  column.columnDef.meta?.toggleVisibility === true,
              )
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.meta?.columnName ?? column.id}
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
        <div className="mr-auto">{footer}</div>
        <span className="flex items-center gap-1">
          <div>Pagina</div>
          <NumberInput
            key={`table-pagination-index-${pagination.pageIndex}`}
            initialValue={pagination.pageIndex + 1}
            onChange={value => {
              const page = value - 1;
              if (page >= 0 && page < table.getPageCount()) {
                table.setPageIndex(page);
                return true;
              }
              return false;
            }}
            className="w-16 pr-1"
          />
          din {isNaN(table.getPageCount()) ? 1 : table.getPageCount()}
        </span>
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={value => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50]
              .filter(pageSize => pageSize < data.length)
              .map(pageSize => (
                <SelectItem
                  key={`table pagination show ${pageSize}`}
                  value={pageSize.toString()}
                >
                  Arată {pageSize}
                </SelectItem>
              ))}
            <SelectItem value={data.length.toString()}>Toate</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Înapoi
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Înainte
        </Button>
      </div>
    </div>
  );
}

type TblProps<TData, TValue> = Pick<Props<TData, TValue>, "columns"> & {
  table: TanStackTable<TData>;
};

function Tbl<TData, TValue>({ table, columns }: TblProps<TData, TValue>) {
  const headersRef = useRef<HTMLTableSectionElement>(null);
  const pageIdx = table.getState().pagination.pageIndex;

  useEffect(() => {
    headersRef.current!.scrollIntoView({ behavior: "smooth" });
  }, [pageIdx]);

  if (table.getHeaderGroups()[0].headers.length == 0)
    return (
      <Table>
        <TableRow
          hoverable={false}
          className="border-0"
        >
          <TableHead
            colSpan={columns.length}
            className="text-center"
          >
            Nici o coloană.
          </TableHead>
        </TableRow>
      </Table>
    );

  return (
    <Table>
      <TableHeader
        ref={headersRef}
        className="scroll-m-4"
      >
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow
            key={headerGroup.id}
            hoverable={false}
          >
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
                  className="py-3"
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
