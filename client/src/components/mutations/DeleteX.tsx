import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UseMutationResult } from "@tanstack/react-query";

type Props = {
  triggerText: string;
  id: string;
  className: string;
  apiDelete: () => UseMutationResult<void, Error, string>;
};

export default function DeleteX({
  triggerText,
  id,
  className,
  apiDelete,
}: Props) {
  const deleteMutation = apiDelete();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>
        {triggerText}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esti absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Această acținue nu poate fi anulată.</p>
            <p>Datele vor fi șterse definitiv de pe server.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(id)}
            variant="destructive"
          >
            Continuă
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
