import type { Stage } from '@/types/stage'
import stage1 from './stage1'

// ─── Lazy stage loading ──────────────────────────────────────────────
// stage1 ships inline (static import) — it's always needed on boot for
// the "start from the beginning" flow. Every other stage is lazily
// imported on demand via Vite's dynamic glob. The initial stage-route
// JS bundle no longer includes stages 2-20 machine data.

const lazyLoaders: Record<string, () => Promise<{ default: Stage }>> = import.meta.glob(
  './stage*.ts',
  { eager: false }
) as Record<string, () => Promise<{ default: Stage }>>

/**
 * Stage metadata known synchronously at boot. Kept hand-curated so the
 * stage picker, achievement summaries, and unlock chain can render
 * without forcing the full machine arrays into the initial bundle.
 * Update this list whenever you add or rename a stage.
 */
export interface StageMeta {
  /** Matches `stage.id` from the stage file's default export. */
  id: string
  /** Localized in `stageNames.*`; this is the authoring fallback. */
  name: string
  /** True if the stage contains a `boss` machine. */
  hasBoss: boolean
  /** 1-based slot used for the unlock chain + star aggregations. */
  numericOrder: number
}

export const STAGE_MANIFEST: readonly StageMeta[] = [
  { id: 'stage1', name: 'Entry Grounds', hasBoss: true, numericOrder: 1 },
  { id: 'stage-2', name: 'Twin Generators', hasBoss: true, numericOrder: 2 },
  { id: 'stage-3', name: 'Gravity Maze', hasBoss: true, numericOrder: 3 },
  { id: 'stage-4', name: 'Rail Network', hasBoss: true, numericOrder: 4 },
  { id: 'stage-5', name: 'Conveyor Chaos', hasBoss: true, numericOrder: 5 },
  { id: 'stage-6', name: 'Pinball Chamber', hasBoss: true, numericOrder: 6 },
  { id: 'stage-7', name: 'Glass Palace', hasBoss: true, numericOrder: 7 },
  { id: 'stage-8', name: 'Twisting Halls', hasBoss: true, numericOrder: 8 },
  { id: 'stage-9', name: 'Inward Spiral', hasBoss: true, numericOrder: 9 },
  { id: 'stage-10', name: 'Final Gauntlet', hasBoss: true, numericOrder: 10 },
  { id: 'stage11', name: 'Pneumatic Highway', hasBoss: true, numericOrder: 11 },
  { id: 'stage12', name: 'Rail Express', hasBoss: true, numericOrder: 12 },
  { id: 'stage13', name: 'Gravity Labyrinth', hasBoss: true, numericOrder: 13 },
  { id: 'stage14', name: 'Tube Garden', hasBoss: true, numericOrder: 14 },
  { id: 'stage15', name: 'Plate Maze', hasBoss: true, numericOrder: 15 },
  { id: 'stage16', name: 'Boss Approach', hasBoss: true, numericOrder: 16 },
  { id: 'stage17', name: 'Conveyor Corridor', hasBoss: true, numericOrder: 17 },
  { id: 'stage18', name: 'Booster Gauntlet', hasBoss: true, numericOrder: 18 },
  { id: 'stage19', name: 'Steel Fortress', hasBoss: true, numericOrder: 19 },
  { id: 'stage20', name: 'Chaos Finale', hasBoss: true, numericOrder: 20 }
]

// Cache fully-loaded stages so repeat picks don't trigger another
// dynamic import round-trip.
const loadedCache = new Map<string, Stage>()
loadedCache.set(stage1.id, stage1)

// Tutorial is named `tutorial.ts` (not `stage*.ts`) so the glob misses
// it. Register a manual lazy loader so loadStageById can resolve it.
const tutorialLoader = () => import('./tutorial') as Promise<{ default: Stage }>


// File-name → stage-id lookup, built from the first glob pass so we can
// resolve a stage by id without scanning every chunk. Because dynamic
// imports are keyed by path, we need to map id → loader key.
const loaderByStageId = new Map<string, () => Promise<{ default: Stage }>>()
// Parallel map: stage id → actual file stem (e.g. `stage-3` → `stage3`).
// Lets the editor save back to the exact file a stage was loaded from,
// instead of deriving a filename from the stage id (which silently
// creates a duplicate when id and file stem disagree, like `stage-3`
// living in `stage3.ts`).
const filenameByStageId = new Map<string, string>()
{
  for (const [path, loader] of Object.entries(lazyLoaders)) {
    const m = path.match(/\/(stage-?\d+)\.ts$/)
    if (!m) continue
    const filename = m[1]! // e.g. 'stage3' or 'stage-3'
    const n = filename.replace(/^stage-?/, '')
    const idNoDash = `stage${n}`
    const idDash = `stage-${n}`
    // Exact match (file stem === id) always wins so both `./stage3.ts`
    // and `./stage-3.ts` resolve to themselves. The other variant only
    // registers as a fallback when that id is otherwise unclaimed.
    if (filename === idNoDash) {
      loaderByStageId.set(idNoDash, loader)
      filenameByStageId.set(idNoDash, filename)
      if (!loaderByStageId.has(idDash)) {
        loaderByStageId.set(idDash, loader)
        filenameByStageId.set(idDash, filename)
      }
    } else {
      loaderByStageId.set(idDash, loader)
      filenameByStageId.set(idDash, filename)
      if (!loaderByStageId.has(idNoDash)) {
        loaderByStageId.set(idNoDash, loader)
        filenameByStageId.set(idNoDash, filename)
      }
    }
  }
  loaderByStageId.set('tutorial', tutorialLoader)
  filenameByStageId.set('tutorial', 'tutorial')
  filenameByStageId.set('stage1', 'stage1')
}

/**
 * Returns the file stem (without `.ts`) that a given stage id resolves
 * to on disk. Used by the stage editor so "Save as Stage" overwrites
 * the same file the stage was loaded from, even when the stage's
 * internal id doesn't match its filename.
 */
export function getStageFilename(id: string): string | undefined {
  return filenameByStageId.get(id)
}

/**
 * Async-load a stage by id. Uses the in-memory cache after first load.
 * Throws if the id isn't in the manifest.
 */
export async function loadStageById(id: string): Promise<Stage> {
  const cached = loadedCache.get(id)
  if (cached) return cached
  const loader = loaderByStageId.get(id)
  if (!loader) throw new Error(`Unknown stage id: ${id}`)
  const mod = await loader()
  loadedCache.set(mod.default.id, mod.default)
  return mod.default
}

// ─── Backward-compatibility shim ────────────────────────────────────
// `STAGES` used to be a fully-resolved synchronous array. Several older
// call sites still read it. We expose a Proxy-free replacement: a
// readonly getter that returns whichever stages are currently cached.
// Call `preloadAllStages()` if you need the full list populated (e.g.
// StageEditor listing every stage). Most call sites only want metadata
// and should switch to `STAGE_MANIFEST` — this shim is opt-in.
export function getLoadedStages(): readonly Stage[] {
  return Array.from(loadedCache.values()).sort((a, b) => {
    const na = STAGE_MANIFEST.findIndex((m) => m.id === a.id)
    const nb = STAGE_MANIFEST.findIndex((m) => m.id === b.id)
    return na - nb
  })
}

/**
 * Eagerly fetch every stage (parallel dynamic imports). Only needed by
 * the stage editor, which wants the full list up-front for its picker.
 */
export async function preloadAllStages(): Promise<readonly Stage[]> {
  await Promise.all(
    STAGE_MANIFEST.map((m) => loadStageById(m.id).catch((e) => {
      console.warn('[stages] preload failed for', m.id, e)
      return null
    }))
  )
  return getLoadedStages()
}

// Tutorial metadata — not in STAGE_MANIFEST (excluded from stage picker,
// achievements, and unlock chain) but exposed for the editor.
export const TUTORIAL_META: StageMeta = { id: 'tutorial', name: 'Tutorial', hasBoss: true, numericOrder: 0 }

// Re-export stage1 for code paths that statically import the default
// boot stage.
export { default as stage1 } from './stage1'
