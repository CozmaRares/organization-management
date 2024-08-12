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

export const equalsFilter: FilterFn<unknown> = (row, columnID, filterValue) => {
  console.log({
    value: row.getValue<number>(columnID),
    filterValue,
    result: row.getValue<number>(columnID) === filterValue,
  });

  return row.getValue<number>(columnID) === filterValue;
};
