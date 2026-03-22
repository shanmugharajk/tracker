import { useRouter, useSearchParams } from "next/navigation";

/**
 * Hook for reading and updating URL search parameters
 */
export function useUrlParam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (paramName: string): string | null => {
    return searchParams.get(paramName);
  };

  const updateParam = (paramName: string, paramValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, paramValue);
    router.push(`?${params.toString()}`);
  };

  return { getParam, updateParam };
}
