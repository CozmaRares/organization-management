import { useMutation as useMutationTanstack } from "@tanstack/react-query";
import { queryClient } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

type Args = {
  url: string;
  onSuccessInvalidateKeys: string[];
};

export default function useDelete({ url, onSuccessInvalidateKeys }: Args) {
  return useMutationTanstack({
    mutationFn: async (id: string) => {
      const res = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });

      console.log(await res.text());

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
