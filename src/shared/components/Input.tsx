import { ComponentProps, useId } from "react";
import { ControllerFieldState } from "react-hook-form";
import { twJoin } from "tailwind-merge";

interface InputProps extends Omit<ComponentProps<"input">, "children" | "id"> {
  label: string;
  fieldState: ControllerFieldState;
}

export function Input({ className, label, fieldState, ...props }: InputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="label">
        {label}
      </label>

      <input
        id={id}
        className={twJoin(
          "border-dark-600 bg-dark-700 focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border px-3 py-2 text-neutral-100 shadow-xs focus:ring-1 focus:outline-hidden",
          className,
        )}
        {...props}
      />

      {fieldState.error && (
        <span className="text-sm text-red-400">{fieldState.error.message}</span>
      )}
    </div>
  );
}
