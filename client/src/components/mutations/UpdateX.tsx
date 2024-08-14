import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DataForm from "../DataForm";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { DefaultValues, FieldValues } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";

type Props<Output, Def extends z.ZodTypeDef, Input extends FieldValues> = {
  triggerText: string;
  title: string;
  desctiption: string;
  columns: ColumnDef<Output>[];
  schema: z.ZodSchema<Output, Def, Input>;
  defaultValues: DefaultValues<Input>;
  apiUpdate: () => UseMutationResult<
    void,
    Error,
    Input & {
      pathParam: string;
    }
  >;
  pathParam: string,
  className: string;
};

export default function Update<
  Output,
  Def extends z.ZodTypeDef,
  Input extends FieldValues,
>({
  triggerText,
  title,
  desctiption,
  apiUpdate,
  pathParam,
  className,
  ...props
}: Props<Output, Def, Input>) {
  const updateMutation = apiUpdate();

  return (
    <Dialog>
      <DialogTrigger className={className}>{triggerText}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desctiption}</DialogDescription>
        </DialogHeader>

        <DataForm
          buttonText="Salvează"
          onSubmit={data => {
            updateMutation.mutate({ ...data, pathParam });
          }}
          {...props}
        />
      </DialogContent>
    </Dialog>
  );
}
