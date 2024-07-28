import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Error({ title, children }: Props) {
  return (
    <div className="space-y-4 pt-16 text-center">
      <h1 className="text-4xl font-bold text-primary">{title}</h1>
      <p>{children}</p>
    </div>
  );
}
