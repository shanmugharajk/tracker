"use client";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCurrencyParam } from "~/lib/hooks/use-currency-param";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const { currency, setCurrency } = useCurrencyParam();

  return (
    <header className="shrink-0 border-b">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground md:text-xs">
            Welcome
          </span>
          <span className="text-sm font-semibold leading-tight md:text-base">
            {userName}
          </span>
        </div>

        <ToggleGroup type="single" value={currency} onValueChange={setCurrency}>
          <ToggleGroupItem value="cad">$ CAD</ToggleGroupItem>
          <ToggleGroupItem value="inr">₹ INR</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
