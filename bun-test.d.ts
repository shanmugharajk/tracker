declare module 'bun:test' {
  type TestBody = () => void | Promise<void>;

  interface Matcher<T> {
    toBe(expected: T): void;
  }

  export const describe: (
    label: string,
    body: TestBody
  ) => void;
  export const test: (label: string, body: TestBody) => void;
  export const expect: <T>(actual: T) => Matcher<T>;
}
