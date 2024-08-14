import { z } from "zod";
import { formatDateStore } from "../utils";

const requiredError = "Este obligatoriu";

export const varchar = (max = 255) =>
  z
    .string({ required_error: requiredError })
    .min(1, "Câmpul trebuie să aibă cel puțin 1 caracter")
    .max(max, `Câmpul poate avea cel mult ${max} de caractere`);

export const date = {
  api: () =>
    z
      .string({ required_error: requiredError })
      .transform(str => new Date(str))
      .refine(date => !isNaN(date.getTime()), "Data primită nu este validă"),
  user: () =>
    z
      .date({ required_error: requiredError })
      .transform(date => formatDateStore(date)),
};

export const float = () =>
  z.coerce
    .number({
      required_error: requiredError,
      invalid_type_error: "Numărul primit nu este valid",
    })
    .nonnegative("Numărul trebuie să fie non-negativ");

export const int = () => float().int("Numărul trebuie să fie întreg");

export const _enum = <T extends readonly [string, ...string[]]>(options: T) =>
  z.enum(options, { required_error: requiredError });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Schemas<
  APISchema extends z.ZodSchema<any, any, any>,
  UserSchema extends z.ZodSchema<any, any, any>,
> = {
  schemas: {
    api: APISchema;
    user: UserSchema;
  };
  defaultValues?: Partial<z.input<UserSchema>>;
};
