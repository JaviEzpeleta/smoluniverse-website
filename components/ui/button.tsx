import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:opacity-50 active:scale-[99%] active:translate-y-0.5 leading-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary border-primary border text-yellow-950 shadow hover:bg-primary/85 rounded-full font-extrabold tracking-tight",
        destructive: "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90",
        outline:
          "border border-primary bg-black rounded-full shadow-sm hover:bg-primary/20 text-primary",
        outlineGray:
          "border border-zinc-300 bg-black rounded-full shadow-sm hover:bg-zinc-300/20 text-zinc-300",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
        ghost:
          "hover:bg-primary/20 rounded-full !px-1 !pr-2 transition-all duration-200",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-9 px-4 py-2 pb-1 text-lg",
        sm: "h-8 px-3 text-xs pt-0.5",
        lg: "h-11 px-8 text-2xl pt-1",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
