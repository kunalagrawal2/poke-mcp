import { z } from "zod";
import { fetchPokemonSimple } from '../pokeapi/client.js';
import { renderPokemonSummary } from '../render/nl.js';

export const pokemonInfoCached = {
  name: 'pokemon_info_cached',
  description: 'Get Pokémon info by name or ID using a local SQLite cache. No fallbacks.',
  inputSchema: {
    name: z.string().describe('e.g., "charizard" or "6"'),
    includeRaw: z.boolean().optional().default(false)
  },
  handler: async (args: any) => {
    const name = String(args.name || '').trim();
    if (!name) return { error: 'name is required' };
    const p = await fetchPokemonSimple(name);     // throws on network failure or 404
    const text = renderPokemonSummary(p);
    return args.includeRaw ? { text, raw: p } : { text };
  }
};
