type Stat = { base_stat: number; stat: { name: string } };
type TypeEntry = { slot: number; type: { name: string } };
type AbilityEntry = { is_hidden: boolean; ability: { name: string } };

export function renderPokemonSummary(p: any): string {
  if (!p?.name || !p?.stats || !p?.types) return 'No data available.';
  const name = capitalize(p.name.replace(/-/g, ' '));
  const id = p.id;
  const types = (p.types as TypeEntry[]).sort((a,b)=>a.slot-b.slot).map(t => t.type.name).join(' / ');
  const abilities = (p.abilities as AbilityEntry[])
    .map(a => a.ability.name + (a.is_hidden ? ' (hidden)' : ''))
    .join(', ') || '—';
  const stats = Object.fromEntries((p.stats as Stat[]).map(s => [s.stat.name, s.base_stat]));
  return `${name} (#${id})\nType: ${types}\nAbilities: ${abilities}\nBase stats: ` +
         `HP ${stats['hp']}, Atk ${stats['attack']}, Def ${stats['defense']}, ` +
         `SpA ${stats['special-attack']}, SpD ${stats['special-defense']}, Spe ${stats['speed']}`;
}

function capitalize(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
