declare module 'bun:test' {
  type TestBody = () => void | Promise<void>;

  interface Matcher<T = unknown> {
    toBe(expected: T): void;
    toEqual(expected: T): void;
    toStrictEqual(expected: T): void;
    toHaveLength(expected: number): void;
  }

  export const describe: (
    label: string,
    body: TestBody
  ) => void;
  export const test: (label: string, body: TestBody) => void;
  export const expect: <T>(actual: T) => Matcher<T>;
}
