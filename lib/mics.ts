export function sleep(ms = 3000) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, ms)
  );
}
