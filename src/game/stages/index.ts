import type { Stage } from '@/types/stage'

// Auto-import every stage file in this directory so the editor's
// "Save As" flow (which writes new / updated `stage*.ts` files via
// the dev-only `/__save-stage` plugin) is reflected without having
// to re-edit this index by hand.
const modules = import.meta.glob<{ default: Stage }>('./stage*.ts', { eager: true })

// Sort by filename with natural ordering so stage2 comes before stage10.
const sortedEntries = Object.entries(modules).sort(([a], [b]) =>
  a.localeCompare(b, undefined, { numeric: true })
)

// Dedupe by stage.id — if two files resolve to the same id, the
// later one (in sort order) wins.
const byId = new Map<string, Stage>()
for (const [, mod] of sortedEntries) {
  const s = mod.default
  if (s && typeof s.id === 'string') byId.set(s.id, s)
}

const numericSuffix = (id: string) => {
  const m = /(\d+)\s*$/.exec(id)
  return m ? parseInt(m[1]!, 10) : Number.MAX_SAFE_INTEGER
}

export const STAGES: Stage[] = Array.from(byId.values()).sort((a, b) => {
  const na = numericSuffix(a.id)
  const nb = numericSuffix(b.id)
  if (na !== nb) return na - nb
  return a.id.localeCompare(b.id)
})
