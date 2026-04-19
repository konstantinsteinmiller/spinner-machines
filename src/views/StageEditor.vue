<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { PLACEABLE_MACHINES, MACHINE_REGISTRY, type MachineModule } from '@/game/machines'
import { WALL_PRESETS, WALL_MATERIALS, type WallPreset, type WallMaterial } from '@/game/walls/presets'
import type { Machine, Stage } from '@/types/stage'
import { STAGE_MANIFEST, TUTORIAL_META, loadStageById, getStageFilename, stage1 as builtinStage1 } from '@/game/stages'
import { SPINNER_MODEL_IDS, modelImgPath, type SpinnerModelId } from '@/use/useModels'
import { useRouter } from 'vue-router'
import { isEditorMode } from '@/use/useAppMode'
import {
  savePantryStage,
  loadPantryStage,
  exportAllPantryStages,
  isPantryConfigured
} from '@/use/usePantryStages'

const stage1 = builtinStage1

const canvasEl = ref<HTMLCanvasElement | null>(null)
const editorStage = reactive<Stage>(JSON.parse(JSON.stringify(stage1)))
const stageName = ref<string>(editorStage.id || 'stage1')
const stageLabel = ref<string>(editorStage.name || 'Stage 1')
// File stem (without `.ts`) the current editorStage was loaded from.
// Tracks the actual filename — used by saveAsStage to decide whether
// we're overwriting the loaded file or saving as a new one, so a stage
// like `stage-3` (id) loaded from `stage3.ts` (file) writes back to
// `stage3.ts` instead of silently creating `stage-3.ts`.
const loadedStageName = ref<string>('stage1')
const saveStatus = ref<string>('')
const selectedType = ref<MachineModule | null>(null)
const draggedId = ref<number | null>(null)
const selectedId = ref<number | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const cam = ref({ x: 0, y: 0, zoom: 0.55 })
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0, cx: 0, cy: 0 })

const ROT_STEP = Math.PI / 12 // 15° per tap

// ─── Undo history ──────────────────────────────────────────────────────
// Cap the stack so large sessions don't grow unbounded.
const HISTORY_MAX = 50
const history = ref<string[]>([])
const canUndo = () => history.value.length > 0

function snapshot() {
  history.value.push(JSON.stringify(editorStage))
  if (history.value.length > HISTORY_MAX) history.value.shift()
}

function undo() {
  const prev = history.value.pop()
  if (!prev) return
  const parsed = JSON.parse(prev) as Stage
  Object.assign(editorStage, parsed)
  editorStage.machines = parsed.machines
  selectedId.value = null
  draggedId.value = null
}

const selectedMachine = () =>
  editorStage.machines.find((mm) => mm.id === selectedId.value) ?? null

function rotateSelected(delta: number) {
  const m = selectedMachine()
  if (!m) return
  snapshot()
  m.rot = (m.rot + delta) % (Math.PI * 2)
}

function resetRotationSelected() {
  const m = selectedMachine()
  if (!m) return
  snapshot()
  m.rot = 0
}

// ─── Pressure-plate linking ───────────────────────────────────────────
// When the user clicks "Link next click" on a selected pressure plate we
// enter linking mode: the next canvas click on another machine stamps
// that machine's `meta.link` with the plate's link key.
const linkingPlateId = ref<number | null>(null)

function plateLink(m: Machine | null): string {
  return (m?.meta?.link as string | undefined) ?? ''
}

function linkedTargets(plate: Machine): Machine[] {
  const link = plateLink(plate)
  if (!link) return []
  return editorStage.machines.filter(
    (mm) => mm.id !== plate.id && mm.type !== 'pressurePlate' && mm.meta?.link === link
  )
}

function setPlateLinkKey(raw: string) {
  const plate = selectedMachine()
  if (!plate || plate.type !== 'pressurePlate') return
  const prev = plateLink(plate)
  const next = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'plate1'
  snapshot()
  plate.meta = { ...(plate.meta ?? {}), link: next }
  // Rename any existing targets so the rewire sticks.
  if (prev && prev !== next) {
    for (const mm of editorStage.machines) {
      if (mm.meta?.link === prev) {
        mm.meta = { ...mm.meta, link: next }
      }
    }
  }
}

function startLinkingFromSelectedPlate() {
  const plate = selectedMachine()
  if (!plate || plate.type !== 'pressurePlate') return
  // Make sure the plate has a link key before we start linking.
  if (!plateLink(plate)) {
    setPlateLinkKey('plate1')
  }
  linkingPlateId.value = plate.id
}

// ─── Gear-system linking ──────────────────────────────────────────────
// Works identically to pressure-plate linking but for gear systems.
const linkingGearId = ref<number | null>(null)

function gearLink(m: Machine | null): string {
  return (m?.meta?.link as string | undefined) ?? ''
}

function gearLinkedTargets(gear: Machine): Machine[] {
  const link = gearLink(gear)
  if (!link) return []
  return editorStage.machines.filter(
    (mm) => mm.id !== gear.id && mm.type !== 'gearSystem' && mm.meta?.link === link
  )
}

function setGearLinkKey(raw: string) {
  const gear = selectedMachine()
  if (!gear || gear.type !== 'gearSystem') return
  const prev = gearLink(gear)
  const next = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'gear1'
  snapshot()
  gear.meta = { ...(gear.meta ?? {}), link: next }
  if (prev && prev !== next) {
    for (const mm of editorStage.machines) {
      if (mm.meta?.link === prev) {
        mm.meta = { ...mm.meta, link: next }
      }
    }
  }
}

function startLinkingFromSelectedGear() {
  const gear = selectedMachine()
  if (!gear || gear.type !== 'gearSystem') return
  if (!gearLink(gear)) {
    setGearLinkKey('gear1')
  }
  linkingGearId.value = gear.id
}

function unlinkTarget(target: Machine) {
  snapshot()
  if (!target.meta) return
  const { link, ...rest } = target.meta
  void link
  target.meta = Object.keys(rest).length ? rest : undefined
}

function cycleBossModel(delta: number) {
  const m = selectedMachine()
  if (!m || m.type !== 'boss') return
  const current = (m.modelId as SpinnerModelId) || 'rainbow'
  const idx = SPINNER_MODEL_IDS.indexOf(current)
  const next = SPINNER_MODEL_IDS[
  ((idx < 0 ? 0 : idx) + delta + SPINNER_MODEL_IDS.length) % SPINNER_MODEL_IDS.length
    ]!
  snapshot()
  m.modelId = next
}

function deleteSelected() {
  if (selectedId.value === null) return
  snapshot()
  editorStage.machines = editorStage.machines.filter((m) => m.id !== selectedId.value)
  selectedId.value = null
}

let nextId = Math.max(...editorStage.machines.map((m) => m.id), 0) + 1

// ─── Rendering ─────────────────────────────────────────────────────────
function resizeCanvas() {
  const c = canvasEl.value
  if (!c) return
  const dpr = window.devicePixelRatio || 1
  const rect = c.getBoundingClientRect()
  c.width = Math.floor(rect.width * dpr)
  c.height = Math.floor(rect.height * dpr)
}

function render(now: number) {
  const c = canvasEl.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  ctx.save()
  ctx.scale(dpr, dpr)
  const w = c.clientWidth
  const h = c.clientHeight
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.translate(-cam.value.x * cam.value.zoom, -cam.value.y * cam.value.zoom)
  ctx.scale(cam.value.zoom, cam.value.zoom)

  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 4
  ctx.strokeRect(0, 0, editorStage.width, editorStage.height)
  ctx.strokeStyle = 'rgba(148,163,184,0.12)'
  ctx.lineWidth = 1
  for (let x = 0; x < editorStage.width; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, editorStage.height)
    ctx.stroke()
  }
  for (let y = 0; y < editorStage.height; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(editorStage.width, y)
    ctx.stroke()
  }

  for (const m of editorStage.machines) {
    if (m.destroyed) continue
    const mod = MACHINE_REGISTRY[m.type]
    if (mod) mod.render(ctx, m, now)
  }

  // Selection outline + rotation indicator
  const sel = editorStage.machines.find((mm) => mm.id === selectedId.value)
  if (sel) {
    ctx.save()
    ctx.translate(sel.x, sel.y)
    ctx.rotate(sel.rot)
    ctx.strokeStyle = '#fde047'
    ctx.lineWidth = 4
    ctx.setLineDash([10, 6])
    const pad = 6
    ctx.strokeRect(-sel.w / 2 - pad, -sel.h / 2 - pad, sel.w + pad * 2, sel.h + pad * 2)
    ctx.setLineDash([])
    // Front-facing tick so the rotation direction is obvious.
    ctx.strokeStyle = '#fde047'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(sel.w / 2 + 24, 0)
    ctx.stroke()
    ctx.fillStyle = '#fde047'
    ctx.beginPath()
    ctx.arc(sel.w / 2 + 24, 0, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  // Spawn marker
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  ctx.arc(editorStage.spawn.x, editorStage.spawn.y, 14, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
  ctx.restore()
}

let raf: number | null = null

function frame(ts: number) {
  render(ts)
  raf = requestAnimationFrame(frame)
}

// ─── Coord helpers ─────────────────────────────────────────────────────
function screenToWorld(sx: number, sy: number) {
  const c = canvasEl.value!
  const rect = c.getBoundingClientRect()
  return {
    x: cam.value.x + (sx - rect.left) / cam.value.zoom,
    y: cam.value.y + (sy - rect.top) / cam.value.zoom
  }
}

function hitMachine(wx: number, wy: number): Machine | null {
  for (let i = editorStage.machines.length - 1; i >= 0; i--) {
    const m = editorStage.machines[i]!
    if (m.destroyed) continue
    const c = Math.cos(-m.rot)
    const s = Math.sin(-m.rot)
    const lx = (wx - m.x) * c - (wy - m.y) * s
    const ly = (wx - m.x) * s + (wy - m.y) * c
    if (Math.abs(lx) <= m.w / 2 && Math.abs(ly) <= m.h / 2) return m
  }
  return null
}

// ─── Palette drag&drop ─────────────────────────────────────────────────
function onPaletteDragStart(ev: DragEvent, mod: MachineModule) {
  ev.dataTransfer?.setData('text/plain', `machine:${mod.type}`)
  selectedType.value = mod
}

function onPresetDragStart(ev: DragEvent, preset: WallPreset, material: WallMaterial = 'wood') {
  ev.stopPropagation()
  ev.dataTransfer?.setData('text/plain', `preset:${preset.id}:${material}`)
}

function onCanvasDragOver(ev: DragEvent) {
  ev.preventDefault()
}

function onCanvasDrop(ev: DragEvent) {
  ev.preventDefault()
  const raw = ev.dataTransfer?.getData('text/plain') ?? ''
  if (!raw) return
  const wp = screenToWorld(ev.clientX, ev.clientY)
  const snapX = Math.round(wp.x / 20) * 20
  const snapY = Math.round(wp.y / 20) * 20
  const mkId = () => nextId++

  if (raw.startsWith('preset:')) {
    const rest = raw.slice('preset:'.length)
    const [presetId, matRaw] = rest.split(':')
    const material = (matRaw === 'stone' || matRaw === 'metal' ? matRaw : 'wood') as WallMaterial
    const preset = WALL_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    snapshot()
    const segs = preset.build(snapX, snapY, mkId, material)
    editorStage.machines.push(...segs)
    return
  }

  const type = (raw.startsWith('machine:') ? raw.slice('machine:'.length) : raw) as any
  const mod = MACHINE_REGISTRY[type]
  if (!mod) return
  snapshot()
  const m: Machine = {
    id: mkId(),
    type,
    x: snapX,
    y: snapY,
    w: mod.defaultSize.w,
    h: mod.defaultSize.h,
    rot: 0
  }
  if (type === 'boss') {
    m.hp = 60
    m.maxHp = 60
    m.modelId = 'rainbow'
  }
  editorStage.machines.push(m)
}

// ─── Canvas pointer: move / rotate / delete / pan ──────────────────────
function onPointerDown(e: PointerEvent) {
  const c = canvasEl.value!
  c.setPointerCapture(e.pointerId)
  const wp = screenToWorld(e.clientX, e.clientY)
  const hit = hitMachine(wp.x, wp.y)
  if (e.button === 2 && hit) {
    snapshot()
    editorStage.machines = editorStage.machines.filter((m) => m.id !== hit.id)
    if (selectedId.value === hit.id) selectedId.value = null
    return
  }
  if (hit) {
    // Pressure-plate linking mode: next click on a non-plate machine
    // stamps that machine's meta.link with the plate's link key.
    if (linkingPlateId.value !== null && hit.type !== 'pressurePlate') {
      const plate = editorStage.machines.find((mm) => mm.id === linkingPlateId.value)
      if (plate) {
        snapshot()
        const link = plateLink(plate) || 'plate1'
        hit.meta = { ...(hit.meta ?? {}), link }
      }
      linkingPlateId.value = null
      selectedId.value = plate?.id ?? hit.id
      return
    }
    // Gear-system linking mode: same pattern as plate linking.
    if (linkingGearId.value !== null && hit.type !== 'gearSystem') {
      const gear = editorStage.machines.find((mm) => mm.id === linkingGearId.value)
      if (gear) {
        snapshot()
        const link = gearLink(gear) || 'gear1'
        hit.meta = { ...(hit.meta ?? {}), link }
      }
      linkingGearId.value = null
      selectedId.value = gear?.id ?? hit.id
      return
    }
    // Alt+click duplicates: clone the hit machine with a fresh id and
    // grab the clone so the user can drag it into place.
    if (e.altKey) {
      snapshot()
      const clone: Machine = JSON.parse(JSON.stringify(hit))
      clone.id = nextId++
      clone.x += 20
      clone.y += 20
      editorStage.machines.push(clone)
      selectedId.value = clone.id
      draggedId.value = clone.id
      dragOffset.value = { x: wp.x - clone.x, y: wp.y - clone.y }
      return
    }
    selectedId.value = hit.id
    // Shift rotates instead of drags — handy for mouse-only workflows.
    if (e.shiftKey) {
      snapshot()
      hit.rot += ROT_STEP
      return
    }
    snapshot()
    draggedId.value = hit.id
    dragOffset.value = { x: wp.x - hit.x, y: wp.y - hit.y }
  } else {
    selectedId.value = null
    isPanning.value = true
    panStart.value = { x: e.clientX, y: e.clientY, cx: cam.value.x, cy: cam.value.y }
  }
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
    undo()
    e.preventDefault()
    return
  }
  if (selectedId.value === null) return
  const m = selectedMachine()
  if (!m) return
  if (e.key === 'r' || e.key === 'R') {
    rotateSelected(e.shiftKey ? -ROT_STEP : ROT_STEP)
    e.preventDefault()
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteSelected()
    e.preventDefault()
  } else if (e.key === 'Escape') {
    linkingPlateId.value = null
    linkingGearId.value = null
    selectedId.value = null
  }
}

function onPointerMove(e: PointerEvent) {
  if (draggedId.value !== null) {
    const wp = screenToWorld(e.clientX, e.clientY)
    const m = editorStage.machines.find((mm) => mm.id === draggedId.value)
    if (m) {
      m.x = Math.round((wp.x - dragOffset.value.x) / 20) * 20
      m.y = Math.round((wp.y - dragOffset.value.y) / 20) * 20
    }
  } else if (isPanning.value) {
    cam.value.x = panStart.value.cx - (e.clientX - panStart.value.x) / cam.value.zoom
    cam.value.y = panStart.value.cy - (e.clientY - panStart.value.y) / cam.value.zoom
  }
}

function onPointerUp() {
  draggedId.value = null
  isPanning.value = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.1 : 0.9
  const before = screenToWorld(e.clientX, e.clientY)
  cam.value.zoom = Math.max(0.25, Math.min(2, cam.value.zoom * factor))
  const after = screenToWorld(e.clientX, e.clientY)
  cam.value.x += before.x - after.x
  cam.value.y += before.y - after.y
}

// ─── Save / Load ───────────────────────────────────────────────────────
const STORAGE = 'bm_editor_stage'

function save() {
  const id = stageName.value.trim()
  const label = stageLabel.value.trim()
  if (id) editorStage.id = id
  if (label) editorStage.name = label
  localStorage.setItem(STORAGE, JSON.stringify(editorStage))
  saveStatus.value = `saved ${editorStage.name || editorStage.id || ''}`.trim()
  setTimeout(() => {
    saveStatus.value = ''
  }, 2000)
}

function load() {
  const raw = localStorage.getItem(STORAGE)
  if (!raw) return
  const parsed = JSON.parse(raw)
  Object.assign(editorStage, parsed)
  if (editorStage.id) stageName.value = editorStage.id
  if (editorStage.name) stageLabel.value = editorStage.name
}

function exportJson() {
  const json = JSON.stringify(editorStage, null, 2)
  navigator.clipboard?.writeText(json)
  alert('Stage JSON copied to clipboard')
}

function clear() {
  snapshot()
  editorStage.machines = []
}

const openMenuVisible = ref(false)
const localStageKeys = ref<string[]>([])

function refreshLocalStageKeys() {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith('bm_stage_')) keys.push(k.slice('bm_stage_'.length))
  }
  localStageKeys.value = keys.sort()
}

function toggleOpenMenu() {
  if (!openMenuVisible.value) refreshLocalStageKeys()
  openMenuVisible.value = !openMenuVisible.value
}

function loadIntoEditor(s: Stage, filename?: string) {
  snapshot()
  const cloned = JSON.parse(JSON.stringify(s)) as Stage
  Object.assign(editorStage, cloned)
  editorStage.machines = cloned.machines
  nextId = Math.max(...editorStage.machines.map((m) => m.id), 0) + 1
  // Prefer the real on-disk file stem over the stage's internal id so
  // the filename input reflects what "Save as Stage" will overwrite.
  const nameForInput = filename ?? cloned.id ?? 'stage'
  stageName.value = nameForInput
  loadedStageName.value = nameForInput
  stageLabel.value = cloned.name || cloned.id || 'Stage'
  selectedId.value = null
  openMenuVisible.value = false
}

async function openBuiltin(s: { id: string }) {
  const full = await loadStageById(s.id)
  loadIntoEditor(full, getStageFilename(s.id))
}

function openLocal(key: string) {
  const raw = localStorage.getItem(`bm_stage_${key}`)
  if (!raw) return
  try {
    loadIntoEditor(JSON.parse(raw) as Stage, key)
  } catch {
    saveStatus.value = `failed to parse ${key}`
  }
}

function importFromClipboard() {
  navigator.clipboard?.readText().then((text) => {
    try {
      loadIntoEditor(JSON.parse(text) as Stage)
      saveStatus.value = 'imported from clipboard'
      setTimeout(() => {
        saveStatus.value = ''
      }, 3000)
    } catch {
      saveStatus.value = 'clipboard not valid JSON'
      setTimeout(() => {
        saveStatus.value = ''
      }, 3000)
    }
  })
}

async function saveAsStage() {
  const safe = stageName.value.replace(/[^a-zA-Z0-9_-]/g, '')
  if (!safe) {
    saveStatus.value = 'bad name'
    return
  }
  // Overwriting the same file we loaded from: preserve the stage's
  // internal id (e.g. keep `stage-3` intact even though the file stem
  // is `stage3`, so the manifest and campaign still find it). Only
  // rewrite the id when the user saves to a new filename.
  const isOverwrite = safe === loadedStageName.value
  if (!isOverwrite) {
    editorStage.id = safe
  }
  editorStage.name = stageLabel.value.trim() || editorStage.id || safe

  // Editor mode — remote Pantry storage (no local filesystem access).
  if (isEditorMode) {
    saveStatus.value = 'saving to pantry…'
    const ok = await savePantryStage(JSON.parse(JSON.stringify(editorStage)) as Stage)
    saveStatus.value = ok ? `pantry: saved ${safe}` : 'pantry: failed'
    if (ok) loadedStageName.value = safe
    setTimeout(() => {
      saveStatus.value = ''
    }, 4000)
    return
  }

  if (import.meta.env.DEV) {
    try {
      const res = await fetch('/__save-stage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: safe, stage: editorStage })
      })
      if (!res.ok) throw new Error(await res.text())
      const j = await res.json()
      saveStatus.value = `wrote ${j.path}`
      loadedStageName.value = safe
    } catch (err) {
      saveStatus.value = `fail: ${String(err)}`
    }
  } else {
    localStorage.setItem(`bm_stage_${safe}`, JSON.stringify(editorStage))
    saveStatus.value = `saved ${safe} (local)`
    loadedStageName.value = safe
  }
  setTimeout(() => {
    saveStatus.value = ''
  }, 4000)
}

// ── Editor-mode / cross-mode helpers ────────────────────────────────

const router = useRouter()

function playCurrentStage() {
  // Persist whatever is in the editor right now so StageView can pick
  // it up on mount and load it instead of stage1.
  localStorage.setItem(STORAGE, JSON.stringify(editorStage))
  router.push({ path: '/stage', query: { from: 'editor' } })
}

async function fetchAllPantryJson() {
  if (!isPantryConfigured) {
    saveStatus.value = 'pantry: VITE_PANTRY_ID missing'
    setTimeout(() => {
      saveStatus.value = ''
    }, 4000)
    return
  }
  saveStatus.value = 'pantry: fetching…'
  try {
    const { stages, json } = await exportAllPantryStages()
    try {
      await navigator.clipboard?.writeText(json)
    } catch { /* ignore */
    }
    saveStatus.value = `pantry: ${stages.length} stages copied to clipboard`
  } catch (err) {
    saveStatus.value = `pantry fetch fail: ${String(err)}`
  }
  setTimeout(() => {
    saveStatus.value = ''
  }, 5000)
}

/**
 * Accept a big `{ stages: Stage[] }` JSON blob (the shape produced by
 * `fetchAllPantryJson`) and write every stage to the local store. In DEV
 * this writes each stage through the on-disk `/__save-stage` endpoint,
 * so the regular editor build can import what the editor-mode build
 * produced via Pantry.
 */
async function parseStagesJsonFromClipboard() {
  saveStatus.value = 'parsing clipboard…'
  try {
    const text = await navigator.clipboard.readText()
    const parsed = JSON.parse(text)
    const stages = Array.isArray(parsed?.stages)
      ? (parsed.stages as Stage[])
      : Array.isArray(parsed)
        ? (parsed as Stage[])
        : null
    if (!stages) throw new Error('no stages[] found')
    let ok = 0
    let fail = 0
    for (const s of stages) {
      if (!s || typeof s.id !== 'string') {
        fail++
        continue
      }
      const safe = s.id.replace(/[^a-zA-Z0-9_-]/g, '')
      if (import.meta.env.DEV) {
        const res = await fetch('/__save-stage', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ name: safe, stage: s })
        })
        if (res.ok) {
          ok++
        } else {
          fail++
        }
      } else {
        localStorage.setItem(`bm_stage_${safe}`, JSON.stringify(s))
        ok++
      }
    }
    saveStatus.value = `parsed: ${ok} saved, ${fail} failed`
  } catch (err) {
    saveStatus.value = `parse fail: ${String(err)}`
  }
  setTimeout(() => {
    saveStatus.value = ''
  }, 5000)
}

onMounted(() => {
  resizeCanvas()
  raf = requestAnimationFrame(frame)
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  if (raf !== null) cancelAnimationFrame(raf)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template lang="pug">
  div.relative.w-full.h-full.flex.editor-bg
    //- Palette
    div.flex.flex-col.gap-2.p-3.overflow-y-auto(
      class="w-40 sm:w-52 bg-slate-900 border-r-2 border-slate-700 z-10"
    )
      div.text-white.font-black.game-text.uppercase.text-sm.mb-2 Machines
      button.palette-btn.rounded-lg.px-2.py-2.text-white.game-text.text-xs.cursor-grab(
        v-for="mod in PLACEABLE_MACHINES"
        :key="mod.type"
        draggable="true"
        :style="{ borderColor: mod.color }"
        @dragstart="onPaletteDragStart($event, mod)"
      )
        div.font-black.uppercase {{ mod.label }}
        div.opacity-60 {{ mod.defaultSize.w }}×{{ mod.defaultSize.h }}

      div.text-white.font-black.game-text.uppercase.text-sm.mt-3.mb-1 Wall Pieces
      div.text-white.game-text.opacity-60(class="text-[10px] mb-1")
        | Drag the outer box for wood · drag a colored chip for stone / metal
      div.palette-btn.rounded-lg.px-2.py-2.text-white.game-text.text-xs.cursor-grab.relative(
        v-for="preset in WALL_PRESETS"
        :key="preset.id"
        draggable="true"
        :style="{ borderColor: preset.color }"
        @dragstart="onPresetDragStart($event, preset, 'wood')"
      )
        div.font-black.uppercase {{ preset.label }}
        div.opacity-60 {{ preset.hint.w }}×{{ preset.hint.h }}
        div.flex.gap-1.mt-1
          div.material-chip(
            v-for="mat in WALL_MATERIALS"
            :key="mat.id"
            draggable="true"
            :title="mat.label + ' ' + preset.label"
            :style="{ background: mat.color }"
            @dragstart="onPresetDragStart($event, preset, mat.id)"
          )
      div.mt-4.flex.flex-col.gap-2
        label.text-white.text-xs.game-text.uppercase.opacity-70 Filename / ID
        input.px-2.py-1.rounded.bg-slate-800.text-white.border-2.border-slate-600.text-xs(
          v-model="stageName"
          placeholder="stage1"
        )
        label.text-white.text-xs.game-text.uppercase.opacity-70.mt-1 Display Label
        input.px-2.py-1.rounded.bg-slate-800.text-white.border-2.border-yellow-500.text-xs(
          v-model="stageLabel"
          placeholder="The Forge"
        )
        div.text-white.game-text.opacity-50(class="text-[10px] -mt-1")
          | Shown by the StageBadge in-game.
        button.bg-fuchsia-600.text-white.py-2.rounded-lg.game-text.font-black(@click="saveAsStage") SAVE AS STAGE
        div.text-xs.game-text.text-yellow-300(v-if="saveStatus") {{ saveStatus }}
        button.bg-indigo-600.text-white.py-2.rounded-lg.game-text.font-black(
          @click="undo"
          :disabled="!canUndo()"
          :class="{ 'opacity-40 cursor-not-allowed': !canUndo() }"
        ) ↶ UNDO
        button.bg-orange-500.text-white.py-2.rounded-lg.game-text.font-black(@click="toggleOpenMenu") 📂 OPEN
        div.bg-slate-800.border-2.border-orange-400.rounded-lg.p-2.flex.flex-col.gap-1.max-h-64.overflow-y-auto(
          v-if="openMenuVisible"
        )
          div.text-orange-300.game-text.text-xs.uppercase.font-black Built-in
          button.text-left.text-cyan-200.game-text.text-xs.px-2.py-1.rounded.bg-slate-700(
            @click="openBuiltin(TUTORIAL_META)"
          ) tutorial · Tutorial
          button.text-left.text-white.game-text.text-xs.px-2.py-1.rounded.bg-slate-700(
            v-for="s in STAGE_MANIFEST"
            :key="s.id"
            @click="openBuiltin(s)"
          ) {{ s.id }} · {{ s.name }}
          div.text-orange-300.game-text.text-xs.uppercase.font-black.mt-2(v-if="localStageKeys.length") Local
          button.text-left.text-white.game-text.text-xs.px-2.py-1.rounded.bg-slate-700(
            v-for="k in localStageKeys"
            :key="k"
            @click="openLocal(k)"
          ) {{ k }}
          button.text-left.text-yellow-200.game-text.text-xs.px-2.py-1.rounded.bg-slate-700.mt-2(
            @click="importFromClipboard"
          ) 📋 Import JSON from clipboard
        button.bg-green-600.text-white.py-2.rounded-lg.game-text.font-black(@click="save") SAVE
        button.bg-sky-600.text-white.py-2.rounded-lg.game-text.font-black(@click="load") LOAD
        button.bg-yellow-500.text-white.py-2.rounded-lg.game-text.font-black(@click="exportJson") EXPORT
        button.bg-red-600.text-white.py-2.rounded-lg.game-text.font-black(@click="clear") CLEAR
        button.bg-emerald-500.text-white.py-2.rounded-lg.game-text.font-black(@click="playCurrentStage") ▶ PLAY
        //- Editor-mode only: explicit remote-pantry actions
        template(v-if="isEditorMode")
          button.bg-teal-600.text-white.py-2.rounded-lg.game-text.font-black(@click="fetchAllPantryJson") ⬇ FETCH ALL
        //- Regular editor only: parse a pasted { stages: [...] } blob
        template(v-else)
          button.bg-purple-600.text-white.py-2.rounded-lg.game-text.font-black(@click="parseStagesJsonFromClipboard") 📥 PARSE STAGES JSON

    //- Canvas
    div.relative.flex-1
      canvas.absolute.inset-0.w-full.h-full.touch-none(
        ref="canvasEl"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel.passive.prevent="onWheel"
        @dragover.prevent="onCanvasDragOver"
        @drop="onCanvasDrop"
        @contextmenu.prevent
      )
      div.absolute.top-2.right-2.text-white.text-xs.game-text.opacity-75.pointer-events-none.leading-tight.text-right
        div.text-yellow-300.font-black.uppercase.mb-1 Editor Shortcuts
        div Drag palette → canvas to place
        div Click to select · Drag to move
        div
          span.text-cyan-300 Alt + Click
          |  to duplicate a piece
        div
          span.text-cyan-300 Shift + Click
          |  on a piece to rotate it +15°
        div
          span.text-cyan-300 R
          |  /
          span.text-cyan-300  Shift + R
          |  rotate selected ±15°
        div
          span.text-cyan-300 Del
          |  /
          span.text-cyan-300  Backspace
          |  remove selected
        div
          span.text-cyan-300 Esc
          |  deselect
        div Right-click a piece to delete it
        div Click empty space and drag to pan · Wheel to zoom
        div
          span.text-cyan-300 Ctrl + Z
          |  undo last change
        div When a boss is selected · ◄ ► cycle its model

      //- Selected-piece toolbar (on-canvas, touch friendly)
      div.absolute.flex.gap-2.items-center.px-3.py-2.rounded-full.bg-black.border-2.border-yellow-300(
        v-if="selectedId !== null"
        class="bottom-4 left-1/2 -translate-x-1/2 z-10"
        @pointerdown.stop
      )
        span.text-yellow-200.game-text.text-xs.font-black.uppercase {{ selectedMachine()?.type }}
        //- Boss model switcher — only visible when a boss tile is selected
        template(v-if="selectedMachine()?.type === 'boss'")
          button.rotate-btn(@click="cycleBossModel(-1)" title="Previous boss") ◄
          div.flex.items-center.gap-1.px-2
            img.w-6.h-6.object-contain(
              :src="modelImgPath(selectedMachine()?.modelId || 'rainbow')"
              draggable="false"
            )
            span.text-white.game-text.text-xs.font-black.uppercase {{ selectedMachine()?.modelId || 'rainbow' }}
          button.rotate-btn(@click="cycleBossModel(1)" title="Next boss") ►
        button.rotate-btn(@click="rotateSelected(-ROT_STEP)" title="Rotate -15°") ↺
        button.rotate-btn(@click="rotateSelected(ROT_STEP)" title="Rotate +15°") ↻
        button.rotate-btn(@click="resetRotationSelected()" title="Reset rotation") 0°
        button.rotate-btn.bg-red-600(@click="deleteSelected()" title="Delete") 🗑

      //- Pressure-plate help & linking panel (only visible when a plate
      //- is selected). Placed top-center so it doesn't fight with the
      //- selected-piece toolbar at the bottom.
      div.plate-help(
        v-if="selectedMachine()?.type === 'pressurePlate'"
        @pointerdown.stop
        @wheel.stop
      )
        div.plate-help__title 🔘 Pressure Plate
        div.plate-help__body
          div
            | A pressure plate activates any other piece that shares its
            span.plate-help__key link key
            | .
          div
            | When the spinner rolls over it once, every linked machine
            | is destroyed — perfect for secret walls, primed generators,
            | or timed glass tubes.
          ol.plate-help__steps
            li
              | 1. Type a short
              span.plate-help__key link key
              |  below (or keep the default).
            li
              | 2. Click
              span.plate-help__key Link next click
              |  — the next machine you click on the canvas will join this
              | plate's group.
            li
              | 3. Repeat to link more pieces. Press
              span.plate-help__key Esc
              |  to cancel linking.
        div.plate-help__row
          span.plate-help__label LINK KEY
          input.plate-help__input(
            :value="plateLink(selectedMachine())"
            @input="setPlateLinkKey(($event.target).value)"
            placeholder="plate1"
          )
        div.plate-help__row.plate-help__row--actions
          button.plate-help__btn(
            :class="{ 'plate-help__btn--active': linkingPlateId !== null }"
            @click="startLinkingFromSelectedPlate"
          ) {{ linkingPlateId !== null ? '… click target' : 'Link next click' }}
          button.plate-help__btn.plate-help__btn--cancel(
            v-if="linkingPlateId !== null"
            @click="linkingPlateId = null"
          ) cancel
        div.plate-help__targets(v-if="linkedTargets(selectedMachine()).length > 0")
          div.plate-help__label LINKED TARGETS
          div.plate-help__chiplist
            span.plate-help__chip(
              v-for="t in linkedTargets(selectedMachine())"
              :key="t.id"
            )
              span {{ `${t.type}#${t.id}` }}
              button.plate-help__chip-x(
                @click="unlinkTarget(t)"
                title="Unlink"
              ) ×

      //- Gear-system help & linking panel (only visible when a gear
      //- system is selected).
      div.plate-help(
        v-if="selectedMachine()?.type === 'gearSystem'"
        @pointerdown.stop
        @wheel.stop
        style="border-color: #94a3b8"
      )
        div.plate-help__title(style="color: #94a3b8") ⚙ Gear System
        div.plate-help__body
          div
            | A gear system rotates any linked piece (usually walls) by 30°
            | each time the spinner hits it. It works like a
            span.plate-help__key(style="background: rgba(148,163,184,0.18); color: #94a3b8")  clockwork trigger
            | .
          div
            | The gear system is destroyable (metal HP). Place it on an outer
            | wall with only the big gear poking into the stage.
          ol.plate-help__steps
            li
              | 1. Type a short
              span.plate-help__key(style="background: rgba(148,163,184,0.18); color: #94a3b8")  link key
              |  below (or keep the default).
            li
              | 2. Click
              span.plate-help__key(style="background: rgba(148,163,184,0.18); color: #94a3b8")  Link next click
              |  — the next machine you click will be rotated by the gears.
            li
              | 3. Repeat to link more pieces. Press
              span.plate-help__key(style="background: rgba(148,163,184,0.18); color: #94a3b8")  Esc
              |  to cancel linking.
        div.plate-help__row
          span.plate-help__label LINK KEY
          input.plate-help__input(
            :value="gearLink(selectedMachine())"
            @input="setGearLinkKey(($event.target).value)"
            placeholder="gear1"
          )
        div.plate-help__row.plate-help__row--actions
          button.plate-help__btn(
            :class="{ 'plate-help__btn--active': linkingGearId !== null }"
            @click="startLinkingFromSelectedGear"
          ) {{ linkingGearId !== null ? '… click target' : 'Link next click' }}
          button.plate-help__btn.plate-help__btn--cancel(
            v-if="linkingGearId !== null"
            @click="linkingGearId = null"
          ) cancel
        div.plate-help__targets(v-if="gearLinkedTargets(selectedMachine()).length > 0")
          div.plate-help__label LINKED TARGETS
          div.plate-help__chiplist
            span.plate-help__chip(
              v-for="t in gearLinkedTargets(selectedMachine())"
              :key="t.id"
              style="background: rgba(148,163,184,0.12); border-color: rgba(148,163,184,0.45); color: #cbd5e1"
            )
              span {{ `${t.type}#${t.id}` }}
              button.plate-help__chip-x(
                @click="unlinkTarget(t)"
                title="Unlink"
              ) ×
</template>

<style scoped lang="sass">
.editor-bg
  background: #0b1220 url('/images/bg/spinner-machines-bg-tile_256x256.webp') repeat
  background-size: 128px 128px

.palette-btn
  background: #1e293b
  border: 2px solid #475569
  text-align: left

  &:hover
    background: #334155


.material-chip
  width: 36px
  height: 36px
  margin: 4px
  border-radius: 6px
  border: 2px solid #0f172a
  cursor: grab
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.5)

  &:hover
    transform: scale(1.1)

.rotate-btn
  background: #1e293b
  color: #fff
  border: 2px solid #fde047
  border-radius: 9999px
  padding: 0.25rem 0.6rem
  font-weight: 900
  font-size: 1rem
  min-width: 2.2rem

  &:hover
    background: #334155

// ─── Pressure plate help / linking panel ───────────────────────────
.plate-help
  position: absolute
  top: 2.5rem
  left: 50%
  transform: translateX(-50%)
  z-index: 15
  width: min(26rem, 90%)
  padding: 0.75rem 0.9rem 0.85rem
  background: linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(7,11,25,0.97) 100%)
  border: 2px solid #fbbf24
  border-radius: 0.75rem
  color: #e2e8f0
  font-family: inherit
  box-shadow: 0 8px 20px rgba(0,0,0,0.6), 0 0 0 1px #0f1a30 inset, 0 0 18px rgba(251,191,36,0.3)

  &__title
    color: #fde047
    font-weight: 900
    font-size: 0.85rem
    letter-spacing: 0.05em
    text-transform: uppercase
    margin-bottom: 0.4rem

  &__body
    font-size: 0.7rem
    line-height: 1.35
    display: flex
    flex-direction: column
    gap: 0.2rem

  &__steps
    list-style: none
    padding: 0
    margin: 0.35rem 0 0
    display: flex
    flex-direction: column
    gap: 0.15rem

  &__key
    display: inline-block
    margin: 0 0.2rem
    padding: 0 0.35rem
    border-radius: 0.25rem
    background: rgba(253, 224, 71, 0.18)
    color: #fde047
    font-weight: 900
    font-size: 0.68rem

  &__row
    display: flex
    align-items: center
    gap: 0.45rem
    margin-top: 0.6rem

  &__row--actions
    margin-top: 0.4rem

  &__label
    color: #94a3b8
    font-size: 0.6rem
    font-weight: 900
    letter-spacing: 0.08em
    text-transform: uppercase
    white-space: nowrap

  &__input
    flex: 1
    padding: 0.25rem 0.45rem
    border-radius: 0.35rem
    background: #0f172a
    border: 2px solid #475569
    color: #fff
    font-size: 0.75rem
    font-weight: 800

    &:focus
      outline: none
      border-color: #fde047

  &__btn
    padding: 0.3rem 0.65rem
    border-radius: 0.4rem
    border: 2px solid #0f1a30
    background: linear-gradient(180deg, #22c55e 0%, #065f46 100%)
    color: #fff
    font-weight: 900
    font-size: 0.7rem
    text-transform: uppercase
    cursor: pointer
    box-shadow: 0 2px 0 #052e16

    &:hover
      filter: brightness(1.1)

    &--active
      background: linear-gradient(180deg, #fbbf24 0%, #b45309 100%)
      box-shadow: 0 2px 0 #3b1a00
      animation: plate-blink 1.1s ease-in-out infinite alternate

    &--cancel
      background: linear-gradient(180deg, #64748b 0%, #1e293b 100%)
      box-shadow: 0 2px 0 #0b1220

  &__targets
    margin-top: 0.55rem

  &__chiplist
    display: flex
    flex-wrap: wrap
    gap: 0.3rem
    margin-top: 0.2rem

  &__chip
    display: inline-flex
    align-items: center
    gap: 0.25rem
    padding: 0.15rem 0.45rem
    border-radius: 9999px
    background: rgba(251, 191, 36, 0.12)
    border: 1px solid rgba(251, 191, 36, 0.45)
    font-size: 0.65rem
    font-weight: 800
    color: #fde68a

  &__chip-x
    background: transparent
    border: 0
    color: #fca5a5
    font-weight: 900
    cursor: pointer
    padding: 0
    line-height: 1

    &:hover
      color: #fff

@keyframes plate-blink
  from
    filter: brightness(1)
  to
    filter: brightness(1.25)

</style>
