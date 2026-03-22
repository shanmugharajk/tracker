"use client";

import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useCurrencyParam } from "~/lib/hooks/use-currency-param";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const { currency, setCurrency } = useCurrencyParam();

  return (
    <header className="border-b shadow-xs">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-widest text-muted-foreground">
            Welcome
          </span>
          <span className="text-sm font-semibold leading-tight">
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
