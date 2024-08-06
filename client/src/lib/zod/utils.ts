import { z } from "zod";

export const varchar = (max = 255) =>
  z
    .string({ required_error: "Este obligatoriu" })
    .min(1, "Câmpul trebuie să aibă cel puțin 1 caracter")
    .max(max, `Câmpul poate avea cel mult ${max} de caractere`);
