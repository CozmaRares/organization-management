import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";

export const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  return itemRank.passed;
};

export const startsWithFilter: FilterFn<unknown> = (
  row,
  columnID,
  filterValue,
) =>
  row.getValue<string>(columnID).toLowerCase().trim().startsWith(filterValue);

export const equalsFilter: FilterFn<unknown> = (row, columnID, filterValue) =>
  row.getValue<number>(columnID) === filterValue;

export const dateRangeFilter: FilterFn<unknown> = (
  row,
  columnID,
  filterValue,
) => {
  const value = new Date(row.getValue<string>(columnID));

  const range = filterValue;

  return range.from && range.to
    ? value >= range.from && value <= range.to
    : true;
};
