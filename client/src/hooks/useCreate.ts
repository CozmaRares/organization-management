import { useMutation as useMutationTanstack } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

type Args = {
  url: string;
  onSuccessInvalidateKeys: string[];
};

export default function useCreate<T>({ url, onSuccessInvalidateKeys }: Args) {
  return useMutationTanstack({
    mutationFn: async (data: T) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) return;

      const description = await res.text();

      if (res.status >= 500)
        toast({
          title: "Eroare de la server",
          description,
          variant: "destructive",
        });
      else
        toast({
          title: "Eroare",
          description,
          variant: "destructive",
        });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onSuccessInvalidateKeys }),
  });
}