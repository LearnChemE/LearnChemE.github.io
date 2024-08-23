export function lerp(start: number, end: number, amount: number): number {
  if (amount < 0 || amount > 1) {
    throw new Error("Amount must be between 0 and 1");
  }
  return start + (end - start) * amount;
}
