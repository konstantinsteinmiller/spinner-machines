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
  { id: 'stage20', name: 'Chaos Finale', hasBoss: true, numericOrder: 20 },
  { id: 'stage21', name: 'Gear Gate', hasBoss: true, numericOrder: 21 },
  { id: 'stage22', name: 'Twin Gearworks', hasBoss: true, numericOrder: 22 },
  { id: 'stage23', name: 'Gear Escalator', hasBoss: true, numericOrder: 23 },
  { id: 'stage24', name: 'Clockwork Maze', hasBoss: true, numericOrder: 24 },
  { id: 'stage25', name: 'Gear Vault', hasBoss: true, numericOrder: 25 },
  { id: 'stage26', name: 'Pinwheel Chamber', hasBoss: true, numericOrder: 26 },
  { id: 'stage27', name: 'Gear Ladder', hasBoss: true, numericOrder: 27 },
  { id: 'stage28', name: 'Mirrored Gears', hasBoss: true, numericOrder: 28 },
  { id: 'stage29', name: 'Spinning Mandala', hasBoss: true, numericOrder: 29 },
  { id: 'stage30', name: 'Grand Clock', hasBoss: true, numericOrder: 30 },
  { id: 'stage31', name: 'Plate Gate', hasBoss: true, numericOrder: 31 },
  { id: 'stage32', name: 'Double Lock', hasBoss: true, numericOrder: 32 },
  { id: 'stage33', name: 'Triple Lock', hasBoss: true, numericOrder: 33 },
  { id: 'stage34', name: 'Plate Hunt', hasBoss: true, numericOrder: 34 },
  { id: 'stage35', name: 'Detonation Chain', hasBoss: true, numericOrder: 35 },
  { id: 'stage36', name: 'Demolition', hasBoss: true, numericOrder: 36 },
  { id: 'stage37', name: 'Bridge of Plates', hasBoss: true, numericOrder: 37 },
  { id: 'stage38', name: 'Scatter Plates', hasBoss: true, numericOrder: 38 },
  { id: 'stage39', name: 'Deep Vault', hasBoss: true, numericOrder: 39 },
  { id: 'stage40', name: 'Master Key', hasBoss: true, numericOrder: 40 },
  { id: 'stage41', name: 'Domino', hasBoss: true, numericOrder: 41 },
  { id: 'stage42', name: 'Chain Reaction', hasBoss: true, numericOrder: 42 },
  { id: 'stage43', name: 'Generator Garden', hasBoss: true, numericOrder: 43 },
  { id: 'stage44', name: 'Explosive Corridor', hasBoss: true, numericOrder: 44 },
  { id: 'stage45', name: 'Demolition Derby', hasBoss: true, numericOrder: 45 },
  { id: 'stage46', name: 'Primed Field', hasBoss: true, numericOrder: 46 },
  { id: 'stage47', name: 'Generator Tower', hasBoss: true, numericOrder: 47 },
  { id: 'stage48', name: 'Fireworks', hasBoss: true, numericOrder: 48 },
  { id: 'stage49', name: 'Minefield', hasBoss: true, numericOrder: 49 },
  { id: 'stage50', name: 'Critical Mass', hasBoss: true, numericOrder: 50 },
  { id: 'stage51', name: 'Shatter Zone', hasBoss: true, numericOrder: 51 },
  { id: 'stage52', name: 'Crystal Cavern', hasBoss: true, numericOrder: 52 },
  { id: 'stage53', name: 'Glass Labyrinth', hasBoss: true, numericOrder: 53 },
  { id: 'stage54', name: 'Mirror Hall', hasBoss: true, numericOrder: 54 },
  { id: 'stage55', name: 'Tube Forest', hasBoss: true, numericOrder: 55 },
  { id: 'stage56', name: 'Glassy Spiral', hasBoss: true, numericOrder: 56 },
  { id: 'stage57', name: 'Shard Scatter', hasBoss: true, numericOrder: 57 },
  { id: 'stage58', name: 'Prism Corridor', hasBoss: true, numericOrder: 58 },
  { id: 'stage59', name: 'Fragile Fortress', hasBoss: true, numericOrder: 59 },
  { id: 'stage60', name: 'Glassmith\'s Arena', hasBoss: true, numericOrder: 60 },
  { id: 'stage61', name: 'Rail Runner', hasBoss: true, numericOrder: 61 },
  { id: 'stage62', name: 'Loop de Loop', hasBoss: true, numericOrder: 62 },
  { id: 'stage63', name: 'Jump Pad', hasBoss: true, numericOrder: 63 },
  { id: 'stage64', name: 'Rail Switch', hasBoss: true, numericOrder: 64 },
  { id: 'stage65', name: 'Launcher Cascade', hasBoss: true, numericOrder: 65 },
  { id: 'stage66', name: 'Rail Network Plus', hasBoss: true, numericOrder: 66 },
  { id: 'stage67', name: 'Bounce House', hasBoss: true, numericOrder: 67 },
  { id: 'stage68', name: 'Double Launch', hasBoss: true, numericOrder: 68 },
  { id: 'stage69', name: 'Rail Boss Approach', hasBoss: true, numericOrder: 69 },
  { id: 'stage70', name: 'Grand Junction', hasBoss: true, numericOrder: 70 },
  { id: 'stage71', name: 'Gravity Trap', hasBoss: true, numericOrder: 71 },
  { id: 'stage72', name: 'Pinball Pro', hasBoss: true, numericOrder: 72 },
  { id: 'stage73', name: 'Multi-Well', hasBoss: true, numericOrder: 73 },
  { id: 'stage74', name: 'Black Hole', hasBoss: true, numericOrder: 74 },
  { id: 'stage75', name: 'Orbit Path', hasBoss: true, numericOrder: 75 },
  { id: 'stage76', name: 'Booster Boss', hasBoss: true, numericOrder: 76 },
  { id: 'stage77', name: 'Spin Cycle', hasBoss: true, numericOrder: 77 },
  { id: 'stage78', name: 'Conveyor Belt Maze', hasBoss: true, numericOrder: 78 },
  { id: 'stage79', name: 'Tumble Dryer', hasBoss: true, numericOrder: 79 },
  { id: 'stage80', name: 'Centrifuge', hasBoss: true, numericOrder: 80 },
  { id: 'stage81', name: 'Combined Lock', hasBoss: true, numericOrder: 81 },
  { id: 'stage82', name: 'Gearworks Inferno', hasBoss: true, numericOrder: 82 },
  { id: 'stage83', name: 'Rail & Ruin', hasBoss: true, numericOrder: 83 },
  { id: 'stage84', name: 'Pressure Cooker', hasBoss: true, numericOrder: 84 },
  { id: 'stage85', name: 'Gear Labyrinth', hasBoss: true, numericOrder: 85 },
  { id: 'stage86', name: 'Cross Fire', hasBoss: true, numericOrder: 86 },
  { id: 'stage87', name: 'Full Toolbox', hasBoss: true, numericOrder: 87 },
  { id: 'stage88', name: 'Chainlock', hasBoss: true, numericOrder: 88 },
  { id: 'stage89', name: 'Factory Floor', hasBoss: true, numericOrder: 89 },
  { id: 'stage90', name: 'Mechanized Colosseum', hasBoss: true, numericOrder: 90 },
  { id: 'stage91', name: 'Phoenix\'s Roost', hasBoss: true, numericOrder: 91 },
  { id: 'stage92', name: 'Demon Forge', hasBoss: true, numericOrder: 92 },
  { id: 'stage93', name: 'Castle Keep', hasBoss: true, numericOrder: 93 },
  { id: 'stage94', name: 'Fire Dance', hasBoss: true, numericOrder: 94 },
  { id: 'stage95', name: 'Wolf Pack', hasBoss: true, numericOrder: 95 },
  { id: 'stage96', name: 'Boss Rush', hasBoss: true, numericOrder: 96 },
  { id: 'stage97', name: 'Ancient Mechanism', hasBoss: true, numericOrder: 97 },
  { id: 'stage98', name: 'Maelstrom', hasBoss: true, numericOrder: 98 },
  { id: 'stage99', name: 'The Grand Forge', hasBoss: true, numericOrder: 99 },
  { id: 'stage100', name: 'Apotheosis', hasBoss: true, numericOrder: 100 }
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
