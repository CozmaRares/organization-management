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

type Props = {
  title: string;
  footer: ReactNode;
  inputs: Array<{
    id: string;
    label: string;
    inputType: InputType;
    defaultValue?: string;
  }>;
} & ({ description: ReactNode } | { descriptionSR: string });

export default function DialogContentDataForm({
  title,
  footer,
  inputs,
  ...description
}: Props) {
  return (
    <DialogContent className="max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description &&
          ("description" in description ? (
            <DialogDescription>{description.description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">
              {description.descriptionSR}
            </DialogDescription>
          ))}
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 py-2">
        {inputs.map(({ id, label, defaultValue, inputType }) => {
          return (
            <div
              key={`dialog-input-${id}`}
              className="flex flex-col gap-2"
            >
              <Label htmlFor={id}>{label}</Label>
              <Inp
                id={id}
                placeholder={label}
                inputType={inputType}
                defaultValue={defaultValue}
              />
            </div>
          );
        })}
      </div>
      <DialogFooter>{footer}</DialogFooter>
    </DialogContent>
  );
}

type InpProps = {
  id: string;
  placeholder: string;
  inputType: InputType;
  defaultValue?: string;
};

function Inp({ inputType, ...props }: InpProps) {
  if (inputType == "input") return <Input {...props} />;

  if (inputType == "textarea") return <Textarea {...props} />;

  if (inputType == "date") return <Input {...props} />;

  return null;
}
