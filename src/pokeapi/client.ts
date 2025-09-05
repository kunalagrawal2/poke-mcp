import { getCache, upsertCache } from '../cache/sqliteCache.js';

const BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonSimple(nameOrId: string) {
  const key = `pokemon/${nameOrId.toLowerCase()}`;
  const cached = getCache(key);
  if (cached) return JSON.parse(cached.json);

  const res = await fetch(`${BASE}/pokemon/${encodeURIComponent(nameOrId.toLowerCase())}`);
  if (!res.ok) throw new Error(`PokeAPI error ${res.status} for ${nameOrId}`);
  const json = await res.json();

  upsertCache({ key, json: JSON.stringify(json), fetched_at: Date.now() });
  return json;
}
