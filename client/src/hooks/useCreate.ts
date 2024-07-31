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
