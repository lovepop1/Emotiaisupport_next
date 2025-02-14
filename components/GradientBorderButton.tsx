"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GradientBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gradientColor?: string;
  children: React.ReactNode;
}

// Use forwardRef to make it compatible with DropdownMenuTrigger
export const GradientBorderButton = React.forwardRef<HTMLButtonElement, GradientBorderButtonProps>(
  ({ gradientColor = "from-sky-700 via-blue-500 to-emerald-400", children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref} // Forward the ref here
        variant="ghost"
        className={cn(
          "group !relative inline-flex h-10 overflow-hidden rounded-xl p-[1px] ring-offset-black will-change-transform focus:outline-none focus:ring-1 focus:ring-offset-2",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-[-1000%] animate-spin [animation-duration:5s] blur bg-gradient-conic",
            gradientColor
          )}
        />
        <div
          className={cn(
            "inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl px-8 py-1 text-sm font-medium",
            "bg-white", // White background
            "text-neutral-950 dark:text-neutral-300 backdrop-blur-3xl",
            "dark:group-hover:from-neutral-700 dark:group-hover:to-neutral-950 group-hover:from-neutral-50 group-hover:to-white"
          )}
        >
          <span className="transition-transform duration-100 ease-in-out group-hover:scale-105">{children}</span>
        </div>
      </Button>
    );
  }
);

GradientBorderButton.displayName = "GradientBorderButton"; // Required for forwardRef components
