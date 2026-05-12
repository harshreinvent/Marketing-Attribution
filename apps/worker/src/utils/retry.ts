export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  backoffMs = 1000
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, backoffMs * 2 ** i));
    }
  }
  throw lastError;
}
