import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { forwardRef, ReactNode } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { InputType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  Path,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";

type Props<Output, Def extends z.ZodTypeDef, Input extends FieldValues> = {
  title: string;
  inputs: Array<{
    id: string;
    label: string;
    inputType: InputType;
  }>;
  schema: z.ZodSchema<Output, Def, Input>;
  defaultValues?: DefaultValues<Input>;
  buttonText: string;
  onSubmit: (data: Input) => void;
} & ({ description: ReactNode } | { descriptionSR: string });

export default function DialogContentDataForm<
  Output,
  Def extends z.ZodTypeDef,
  Input extends FieldValues,
>({
  title,
  inputs,
  schema,
  defaultValues,
  buttonText,
  onSubmit,
  ...description
}: Props<Output, Def, Input>) {
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 py-2"
        >
          {inputs.map(({ id, label, inputType }) => {
            return (
              <FormField
                key={`dialog-input-${id}`}
                control={form.control}
                name={id as Path<Input>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Inp
                        placeholder={label}
                        inputType={inputType}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
          <Button className="col-span-full" type="submit">{buttonText}</Button>
        </form>
      </Form>
    </DialogContent>
  );
}

type InpProps = ControllerRenderProps<FieldValues, Path<FieldValues>> & {
  placeholder: string;
  inputType: InputType;
};

const Inp = forwardRef<HTMLElement, InpProps>(
  ({ inputType, ...props }, ref) => {
    if (inputType == "input")
      return (
        <Input
          // @ts-expect-error overwrite ref warning
          ref={ref}
          {...props}
        />
      );

    if (inputType == "textarea")
      return (
        <Textarea
          // @ts-expect-error overwrite ref warning
          ref={ref}
          {...props}
        />
      );

    if (inputType == "date")
      return (
        <Input
          // @ts-expect-error overwrite ref warning
          ref={ref}
          {...props}
        />
      );

    return null;
  },
);
