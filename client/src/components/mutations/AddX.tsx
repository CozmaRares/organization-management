import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DataForm from "../DataForm";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DefaultValues, FieldValues } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";

type Props<Output, Def extends z.ZodTypeDef, Input extends FieldValues> = {
  title: string;
  desctiption: string;
  columns: ColumnDef<Output>[];
  schema: z.ZodSchema<Output, Def, Input>;
  defaultValues?: DefaultValues<Input>;
  apiCreate: () => UseMutationResult<void, Error, Input>;
};

export default function AddX<
  Output,
  Def extends z.ZodTypeDef,
  Input extends FieldValues,
>({ title, desctiption, apiCreate, ...props }: Props<Output, Def, Input>) {
  const createMutation = apiCreate();

  return (
    <Dialog>
      <DialogTrigger className="flex h-10 flex-row items-center justify-center gap-1 whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <Plus className="h-4 w-4" />
        {title}
      </DialogTrigger>

      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desctiption}</DialogDescription>
        </DialogHeader>
        <DataForm
          buttonText="Adaugă"
          onSubmit={data => createMutation.mutate(data)}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
}
