import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

// shadcn/ui's Button, cut down to what the Calendar uses.
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 type-chip whitespace-nowrap transition-colors outline-none",
    "focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-e2e-white-80",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        ghost: "text-e2e-text-soft hover:bg-e2e-white-7 hover:text-e2e-text-bright",
      },
      size: {
        default: "h-9 px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "ghost",
  size = "default",
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
