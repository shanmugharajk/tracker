export type Currency = "cad" | "inr";

const VALID_CURRENCIES: Currency[] = ["cad", "inr"];
const DEFAULT_CURRENCY: Currency = "cad";

export function validateCurrency(value: string | null): Currency {
  if (!value || !VALID_CURRENCIES.includes(value as Currency)) {
    return DEFAULT_CURRENCY;
  }
  return value as Currency;
}
