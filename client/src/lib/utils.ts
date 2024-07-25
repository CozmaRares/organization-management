import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(date, "dd LLL y", { locale: ro });
}
