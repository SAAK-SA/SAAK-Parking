// Lightweight Supabase (PostgREST) client using fetch — no dependency required.
// Reads config from Vite env. When the keys are absent the app falls back to the
// local (single-device) store, so everything keeps working out of the box.

const env = import.meta.env as unknown as Record<string, string | undefined>;
const URL = env.VITE_SUPABASE_URL;
const KEY = env.VITE_SUPABASE_ANON_KEY;

export const isCloud = Boolean(URL && KEY);

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: KEY ?? '',
    Authorization: `Bearer ${KEY ?? ''}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** SELECT rows. `query` is a PostgREST query string, e.g. "status=eq.available&order=number". */
export async function sbSelect<T>(table: string, query = ''): Promise<T[]> {
  const res = await fetch(`${URL}/rest/v1/${table}${query ? `?${query}` : ''}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Supabase select ${table}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T[]>;
}

/** INSERT a row and return the created record. */
export async function sbInsert<T>(table: string, row: object): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert ${table}: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as T[];
  return data[0];
}

/** UPDATE rows matching `query` (PostgREST filter). */
export async function sbUpdate(table: string, query: string, patch: object): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Supabase update ${table}: ${res.status} ${await res.text()}`);
}
