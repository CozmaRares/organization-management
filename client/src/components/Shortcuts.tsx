import { cn } from "@/lib/utils";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import ThemeSwitch from "./ThemeSwitch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useStateWithLocalStorage from "@/hooks/useStateWithLocalStorage";
import { PiggyBank } from "lucide-react";

const ShortcutValidator = z.object({
  path: z.string(),
  name: z.string({ required_error: "Numele este obligatoriu." }),
});

type Shortcut = z.infer<typeof ShortcutValidator>;

type Props = {
  className?: string;
};

export default function Shortcuts({ className }: Props) {
  const [shortcuts, setShortcuts] = useStateWithLocalStorage<
    Record<string, string>
  >("shortcuts", {});

  const numShortcuts = Object.entries(shortcuts).length;

  const [selectedShortcuts, setSelectedShortcuts] = useState<
    Record<string, boolean>
  >({});

  const path = useLocation().pathname;
  const { flatRoutes } = useRouter();
  const routes = useMemo(
    () =>
      flatRoutes.map(({ fullPath }) => {
        const path = fullPath as string;

        return path.endsWith("/") && path != "/"
          ? path.substring(0, path.length - 1)
          : path;
      }),
    [],
  );

  const addShortcutForm = useForm<Shortcut>({
    resolver: zodResolver(ShortcutValidator),
    defaultValues: {
      path,
    },
  });

  useEffect(() => {
    addShortcutForm.reset({ path });
  }, [path]);

  const addShortcut = ({ path, name }: Shortcut) => {
    setShortcuts(prev => ({ ...prev, [path]: name }));
  };

  const deleteShortcuts = () => {
    setShortcuts(prev => {
      const selected = new Set(
        Object.entries(selectedShortcuts).map(([path]) => path),
      );

      const newShortcuts = Object.entries(prev).filter(
        ([path]) => !selected.has(path),
      );

      setSelectedShortcuts({});

      return Object.fromEntries(newShortcuts);
    });
  };

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2",
        className,
      )}
    >
      <Link
        to="/"
        className="grid w-fit grid-cols-[auto,minmax(0,1fr)] grid-rows-2 items-center gap-x-2 rounded-md p-1 font-bold"
      >
        <PiggyBank className="row-span-full h-12 w-12 transition-all group-hover:scale-110" />
        <span className="text-lg text-primary">Bill</span>
        <span className="">Ledger</span>
      </Link>
      <ul className="flex items-center gap-2">
        {Object.entries(shortcuts).map(([path, name]) => (
          <li key={path}>
            <Link
              to={`/${path}`}
              className="btn block min-w-[4ch] rounded-full px-2 py-1 text-center"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-row items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              id="change-shortcuts"
              className="btn rounded-lg p-2"
            >
              {numShortcuts == 0 ? "Adaugă scurtături" : "Schimbă scurtăturile"}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schimbă scurtăturile</DialogTitle>
              <DialogDescription className="sr-only">
                Schimbă scurtăturile aici. Salvează când ai terminat.
              </DialogDescription>
            </DialogHeader>
            <Tabs
              defaultValue="modify"
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-accent text-accent-foreground">
                <TabsTrigger value="modify">Modifică</TabsTrigger>
                <TabsTrigger value="delete">Șterge</TabsTrigger>
              </TabsList>
              <TabsContent value="modify">
                <Form {...addShortcutForm}>
                  <form
                    onSubmit={addShortcutForm.handleSubmit(addShortcut)}
                    className="space-y-4"
                    key={`modify-shortcut-${path}`}
                  >
                    <FormField
                      control={addShortcutForm.control}
                      name="path"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pagină</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Alege o pagină" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {routes.map(route => (
                                <SelectItem
                                  key={`add-shortcut-form-${route}`}
                                  value={route}
                                >
                                  {route}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addShortcutForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numele scurtăturii</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Scurtătură..."
                              {...field}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Salvează</Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="delete">
                {numShortcuts > 0 ? (
                  <>
                    <ul className="mb-2 space-y-2">
                      {Object.entries(shortcuts).map(([path, name]) => (
                        <li
                          key={`dialog-${path}`}
                          className={cn(
                            "flex flex-row items-center gap-3 rounded-md p-2",
                            selectedShortcuts[path] && "bg-accent",
                          )}
                        >
                          <Checkbox
                            checked={selectedShortcuts[path]}
                            onCheckedChange={checked =>
                              checked != "indeterminate" &&
                              setSelectedShortcuts(prev => ({
                                ...prev,
                                [path]: checked,
                              }))
                            }
                          />
                          {name}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="destructive"
                      type="submit"
                      className="ml-auto block"
                      onClick={deleteShortcuts}
                      disabled={
                        !Object.entries(selectedShortcuts).some(
                          ([, isSelected]) => isSelected,
                        )
                      }
                    >
                      Șterge
                    </Button>
                  </>
                ) : (
                  <div className="pt-4 text-center">Nici o scurtătură.</div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        <ThemeSwitch />
      </div>
    </div>
  );
}
