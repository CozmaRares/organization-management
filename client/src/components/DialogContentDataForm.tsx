import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { InputType } from "@/lib/types";

export type DialogContentDataFormProps = {
  title: string;
  description?: ReactNode;
  footer: ReactNode;
  inputs: Array<{
    id: string;
    label: string;
    inputType: InputType
    defaultValue?: string;
  }>;
};

export default function DialogContentDataForm({
  title,
  description,
  footer,
  inputs,
}: DialogContentDataFormProps) {
  return (
    <DialogContent className="max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-2">
        {inputs.map(({ id, label, inputType, defaultValue }) => {
          const Inp = inputType == "input" ? Input : Textarea;
          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor={id}>{label}</Label>
              <Inp
                id={id}
                defaultValue={defaultValue}
                placeholder={label}
              />
            </div>
          );
        })}
      </div>
      <DialogFooter>{footer}</DialogFooter>
    </DialogContent>
  );
}
