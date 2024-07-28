import { useQuery as useQueryTanstack } from "@tanstack/react-query";
import { z } from "zod";

type Args<Output, Def extends z.ZodTypeDef, Input> = {
  queryKey: string[];
  url: string;
  validator: z.ZodSchema<Output, Def, Input>;
};

export default function useQuery<Output, Def extends z.ZodTypeDef, Input>({
  queryKey,
  url,
  validator,
}: Args<Output, Def, Input>) {
  const query = useQueryTanstack({
    queryKey,
    queryFn: async () => {
      const response = await fetch(url);
      const jason = await response.json();
      return validator.parse(jason);
    },
  });

  return query;
}
