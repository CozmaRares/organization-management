import { z } from "zod";
import { formatDateStore } from "../utils";

const requiredError = "Este obligatoriu"

export const zvarchar = (max = 255) =>
  z
    .string({ required_error: requiredError })
    .min(1, "Câmpul trebuie să aibă cel puțin 1 caracter")
    .max(max, `Câmpul poate avea cel mult ${max} de caractere`);

export const zdate = () =>
  z
    .date({ required_error: requiredError })
    .or(z.string())
    .transform(date => {
      if (typeof date == "string") return date;
      return formatDateStore(date);
    });

export const zint = () =>
  z
    .number({ required_error: requiredError })
    .int("Numărul trebuie să fie întreg")
    .nonnegative("Numărul trebuie să fie non-negativ")
    .or(z.string())
    .transform(num => {
      if (typeof num == "number") return num;
      return Number(num);
    });

export const zfloat = () =>
  z
    .number({ required_error: requiredError })
    .nonnegative("Numărul trebuie să fie non-negativ")
    .or(z.string())
    .transform(num => {
      if (typeof num == "number") return num;
      return Number(num);
    });

export const zenum = (options: readonly [string, ...string[]]) =>
  z.enum(options, { required_error: requiredError });
