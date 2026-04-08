export function readFormError(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('form' in error)) {
    return undefined;
  }

  const form = (error as { form?: unknown }).form;

  return typeof form === 'string' ? form : undefined;
}
