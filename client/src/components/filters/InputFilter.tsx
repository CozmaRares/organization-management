import { Input } from "../ui/input";

type Props = {
  value: string | number;
  placeholder: string;
  onChange: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
  className?: string;
};

export default function InputFilter({
  placeholder,
  value,
  onChange,
  className,
}: Props) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
