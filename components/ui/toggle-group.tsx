"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "~/lib/cn";

const ToggleGroupContext = React.createContext<{
  spacing?: number;
  orientation?: "horizontal" | "vertical";
}>({
  spacing: 0,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  spacing?: number;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-spacing={spacing}
      data-orientation={orientation}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px] gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "relative inline-flex flex-1 items-center justify-center rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all cursor-pointer",
        "text-foreground/60 hover:text-foreground",
        "data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
