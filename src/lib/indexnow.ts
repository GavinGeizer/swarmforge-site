export function indexNowKey(value: string | undefined) {
  if (!value) return undefined;
  if (!/^[a-fA-F0-9]{8,128}$/.test(value)) throw new Error("INDEXNOW_KEY must contain 8–128 hexadecimal characters.");
  return value;
}
