import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { Fragment, ReactNode } from "react";

type Props = {
  actions: ReactNode[];
};

// eslint-disable-next-line  react-refresh/only-export-components
export const actionButtonClasses = cn(
  buttonVariants({ variant: "ghost" }),
  "w-full justify-start",
);

export default function ActionMenu({ actions }: Props) {
  return (
    <Sheet modal={false}>
      <SheetTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "aspect-square h-fit p-0",
        )}
      >
        <span className="sr-only">Deschide meniul</span>
        <MoreHorizontal className="h-[1em]" />
      </SheetTrigger>
      <SheetContent>
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Închide</span>
        </SheetClose>

        <SheetHeader className="items-center">
          <SheetTitle>Acțiuni</SheetTitle>
          <SheetDescription>Acțiuni adiționale</SheetDescription>
        </SheetHeader>

        <ul className="space-y-2 pt-4">
          {actions.map((action, idx) => (
            <Fragment key={`action-menu-entry-${idx}`}>
              <div className="h-[1px] w-full bg-accent first-of-type:hidden" />
              <li>{action}</li>
            </Fragment>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
