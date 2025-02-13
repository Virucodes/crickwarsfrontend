import { useFormContext } from "react-hook-form";

export function Form({ children, ...props }) {
  const methods = useFormContext();
  return <form {...props}>{children}</form>;
}

export function FormField({ control, name, render }) {
  return render({
    field: {
      ...control.register(name),
      name,
    },
  });
}

export function FormItem({ children }) {
  return <div className="space-y-2">{children}</div>;
}

export function FormLabel({ children }) {
  return <label className="font-medium">{children}</label>;
}

export function FormControl({ children }) {
  return <div className="border rounded-lg p-2">{children}</div>;
}

export function FormMessage({ children }) {
  return <p className="text-red-500 text-sm">{children}</p>;
}
