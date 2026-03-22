"use client";

import * as React from "react";
import { cn } from "~/lib/cn";

interface CustomSwitchProps {
  options: [string, string];
  value: 0 | 1;
  onValueChange: (value: 0 | 1) => void;
  className?: string;
}

const CustomSwitch = React.forwardRef<HTMLDivElement, CustomSwitchProps>(
  ({ options, value, onValueChange, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] h-8",
        className,
      )}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onValueChange(index as 0 | 1)}
          className={cn(
            "relative inline-flex flex-1 items-center justify-center rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
            value === index
              ? "bg-background text-foreground shadow-sm"
              : "text-foreground/60 hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  ),
);

CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };
