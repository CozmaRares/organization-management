import { useState, createContext, useContext } from "react";

export const FilterContext = createContext<{
  filters: string[] | null;
  setFilters: (filters: string[] | null) => void;
} | null>(null);

type Props = { children: React.ReactNode };

export default function FilterContextProvider({ children }: Props) {
  const [filters, setFilters] = useState<string[] | null>(null);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);

  if (context == null) {
    throw new Error(
      "useFilterContext must be used within an FilterContextProvider",
    );
  }

  return context;
}
