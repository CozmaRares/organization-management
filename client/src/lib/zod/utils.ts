import { z } from "zod";

export const varchar = () =>
  z
    .string({ required_error: `${name} este obligatoriu` })
    .min(1, { message: "Câmpul trebuie să aibă cel puțin 1 caracter" })
    .max(255, { message: "Câmpul poate avea cel mult 255 de caractere" });
