import { useMutation as useMutationTanstack } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

type Args = {
  url: string;
  onSuccessInvalidateKeys: string[];
};

// TODO: refactor useUpdate, useCreate and useDelete
// TODO: proper error handling
export default function useUpdate<T>({ url, onSuccessInvalidateKeys }: Args) {
  return useMutationTanstack({
    mutationFn: async ({ pathParam, ...data }: T & { pathParam: string }) => {
      const res = await fetch(`${url}/${pathParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status != 204)
        return toast({
          title: "Eroare de la server",
          description: "Serverul a avut un răspuns neașteptat",
          variant: "destructive",
        });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onSuccessInvalidateKeys }),
  });
}
