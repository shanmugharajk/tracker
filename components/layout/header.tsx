"use client";

import { useState } from "react";

import { CustomSwitch } from "~/components/ui/custom-switch";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const [currency, setCurrency] = useState<0 | 1>(0);

  return (
    <header className="border-b shadow-xs">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Welcome
          </span>
          <span className="text-2xl font-bold leading-tight">{userName}</span>
        </div>

        <CustomSwitch
          options={["$ CAD", "₹ INR"]}
          value={currency}
          onValueChange={setCurrency}
        />
      </div>
    </header>
  );
}
