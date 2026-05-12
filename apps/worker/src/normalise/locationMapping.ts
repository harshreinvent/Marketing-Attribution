// [FIX 7] DB-backed, per-client — NOT a pure function — belongs here, not in @repo/utils
export function mapLocationUsingClientRules(
  utm: string,
  rules: { rule_key: string; rule_value: string }[]
): string | null {
  const rule = rules.find((r) => r.rule_key.toLowerCase() === utm.toLowerCase());
  return rule?.rule_value ?? null;
}
