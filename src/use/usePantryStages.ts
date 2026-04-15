/**
 * Pantry-backed stage storage for editor mode.
 *
 * Pantry (https://getpantry.cloud/) stores arbitrary JSON in "baskets"
 * under a single "pantry id". One basket == one stage. The pantry id is
 * supplied via `VITE_PANTRY_ID` at build time; it's effectively a write
 * password, so only the editor-mode deployment ships it.
 *
 * API summary (v1):
 *   - GET  /apiv1/pantry/:id                  → pantry info, includes
 *                                                `baskets: [{ name, ttl }]`
 *   - POST /apiv1/pantry/:id/basket/:name     → create basket
 *   - PUT  /apiv1/pantry/:id/basket/:name     → replace basket contents
 *   - GET  /apiv1/pantry/:id/basket/:name     → read basket contents
 *   - DELETE /apiv1/pantry/:id/basket/:name   → delete basket
 *
 * All endpoints use plain JSON; no auth header beyond the pantry id in
 * the URL path. We use `fetch` directly — no extra SDK needed.
 */

import type { Stage } from '@/types/stage'

const BASE = 'https://getpantry.cloud/apiv1/pantry'
const PANTRY_ID = import.meta.env.VITE_PANTRY_ID as string | undefined

const BASKET_PREFIX = 'stage-'
const basketNameFor = (stageId: string) => BASKET_PREFIX + stageId

export interface PantryListed {
  name: string
  ttl?: number
}

function assertConfigured(): string {
  if (!PANTRY_ID) {
    throw new Error('[pantry] VITE_PANTRY_ID is not set — editor-mode cannot reach Pantry.')
  }
  return PANTRY_ID
}

async function listBaskets(): Promise<PantryListed[]> {
  const id = assertConfigured()
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error(`[pantry] list failed: ${res.status}`)
  const j = await res.json()
  return Array.isArray(j?.baskets) ? (j.baskets as PantryListed[]) : []
}

async function readBasket(name: string): Promise<Stage | null> {
  const id = assertConfigured()
  const res = await fetch(`${BASE}/${id}/basket/${encodeURIComponent(name)}`)
  if (!res.ok) return null
  return (await res.json()) as Stage
}

async function writeBasket(name: string, stage: Stage): Promise<boolean> {
  const id = assertConfigured()
  // POST creates on first save, PUT replaces thereafter. Pantry's POST
  // also accepts subsequent updates, so POST is sufficient for both.
  const res = await fetch(`${BASE}/${id}/basket/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stage)
  })
  return res.ok
}

export async function savePantryStage(stage: Stage): Promise<boolean> {
  if (!stage.id) return false
  return writeBasket(basketNameFor(stage.id), stage)
}

export async function loadPantryStage(stageId: string): Promise<Stage | null> {
  return readBasket(basketNameFor(stageId))
}

/** Fetch every stage basket and return them bundled into one JSON blob. */
export async function exportAllPantryStages(): Promise<{ stages: Stage[]; json: string }> {
  const baskets = await listBaskets()
  const stageBaskets = baskets.filter((b) => b.name.startsWith(BASKET_PREFIX))
  const stages: Stage[] = []
  for (const b of stageBaskets) {
    const s = await readBasket(b.name)
    if (s) stages.push(s)
  }
  // Stable ordering: by numeric suffix when possible, then alpha.
  stages.sort((a, b) => {
    const na = parseInt(a.id.match(/(\d+)/)?.[1] ?? '0', 10)
    const nb = parseInt(b.id.match(/(\d+)/)?.[1] ?? '0', 10)
    if (na !== nb) return na - nb
    return a.id.localeCompare(b.id)
  })
  return { stages, json: JSON.stringify({ stages }, null, 2) }
}

export const isPantryConfigured = Boolean(PANTRY_ID)
