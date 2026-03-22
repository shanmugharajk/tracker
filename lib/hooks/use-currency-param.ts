import { type Currency, validateCurrency } from "~/lib/currency";

import { useUrlParam } from "./use-search-params";

/**
 * Hook for managing the currency URL parameter
 */
export function useCurrencyParam() {
  const { getParam, updateParam } = useUrlParam();

  const currency = validateCurrency(getParam("currency"));

  const setCurrency = (value: Currency) => {
    updateParam("currency", value);
  };

  return { currency, setCurrency };
}
