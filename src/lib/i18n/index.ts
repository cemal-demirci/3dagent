import { tr } from "./tr";

type TrDict = typeof tr;
type TrKey = keyof TrDict;

export function t(key: TrKey): string {
  return tr[key] ?? key;
}

export function tReplace(key: TrKey, vars: Record<string, string | number>): string {
  let result: string = tr[key] ?? String(key);
  for (const [k, v] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return result;
}
