import { forwardRef, useMemo } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DataFormInput, InputType } from "@/lib/types";
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
import { cn, formatDateDisplay } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props<Output, Def extends z.ZodTypeDef, Input extends FieldValues> = {
  dataFormInputs: Array<
    // @ts-expect-error ts complains for non string keys, but they will always be strings
    DataFormInput<keyof Input>
  >;
  schema: z.ZodSchema<Output, Def, Input>;
  defaultValues?: Partial<DefaultValues<Input>>;
  buttonText: string;
  onSubmit: (data: Input) => void;
};

export default function DataForm<
  Output,
  Def extends z.ZodTypeDef,
  Input extends FieldValues,
>({
  dataFormInputs,
  schema,
  defaultValues,
  buttonText,
  onSubmit,
}: Props<Output, Def, Input>) {
  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<Input>,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 py-2"
      >
        {dataFormInputs.map(
          ({ id, label, inputType, inputWrapperClassName }) => {
            return (
              <FormField
                // @ts-expect-error id will always be a string
                key={`dialog-input-${id}`}
                control={form.control}
                name={id as Path<Input>}
                render={({ field }) => (
                  <FormItem className={inputWrapperClassName}>
                    <FormLabel>{label}</FormLabel>
                    <Inp
                      placeholder={label}
                      inputType={inputType}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          },
        )}
        <Button
          className="col-span-full"
          type="submit"
        >
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}

type InpProps = ControllerRenderProps<FieldValues, Path<FieldValues>> & {
  placeholder: string;
  inputType: InputType;
};

const Inp = forwardRef<HTMLElement, InpProps>(
  ({ inputType, ...props }, ref) => {
    switch (inputType.type) {
      case "input":
        return (
          <FormControl>
            <Input
              // @ts-expect-error overwrite ref warning
              ref={ref}
              {...props}
            />
          </FormControl>
        );
      case "textarea":
        return (
          <FormControl>
            <Textarea
              // @ts-expect-error overwrite ref warning
              ref={ref}
              {...props}
            />
          </FormControl>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !props.value && "text-muted-foreground",
                  )}
                >
                  {props.value ? (
                    formatDateDisplay(props.value)
                  ) : (
                    <span>Alege o dată</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={props.value}
                onSelect={props.onChange}
                disabled={date => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "select": {
        const { onChange, value, ...props2 } = props;
        return (
          <Select
            onValueChange={onChange}
            defaultValue={value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "[&>span]:capitalize",
                  value == undefined && "[&>span]:text-muted-foreground",
                )}
              >
                <SelectValue
                  // @ts-expect-error overwrite ref warning
                  ref={ref}
                  {...props2}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="capitalize">
              {inputType.options.map(option => (
                <SelectItem
                  key={`dialog-data-form-input-select-${option}`}
                  value={option}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      default:
        return null;
    }
  },
);
