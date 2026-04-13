<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { PLACEABLE_MACHINES, MACHINE_REGISTRY, type MachineModule } from '@/game/machines'
import { WALL_PRESETS, type WallPreset } from '@/game/walls/presets'
import type { Machine, Stage } from '@/types/stage'
import { STAGES } from '@/game/stages'

const stage1 = STAGES[0]!

const canvasEl = ref<HTMLCanvasElement | null>(null)
const editorStage = reactive<Stage>(JSON.parse(JSON.stringify(stage1)))
const stageName = ref<string>(editorStage.id || 'stage1')
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
  ctx.fillStyle = '#0b1220'
  ctx.fillRect(0, 0, w, h)
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

function onPresetDragStart(ev: DragEvent, preset: WallPreset) {
  ev.dataTransfer?.setData('text/plain', `preset:${preset.id}`)
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
    const presetId = raw.slice('preset:'.length)
    const preset = WALL_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    snapshot()
    const segs = preset.build(snapX, snapY, mkId)
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
  localStorage.setItem(STORAGE, JSON.stringify(editorStage))
}

function load() {
  const raw = localStorage.getItem(STORAGE)
  if (!raw) return
  const parsed = JSON.parse(raw)
  Object.assign(editorStage, parsed)
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

function loadIntoEditor(s: Stage) {
  snapshot()
  const cloned = JSON.parse(JSON.stringify(s)) as Stage
  Object.assign(editorStage, cloned)
  editorStage.machines = cloned.machines
  nextId = Math.max(...editorStage.machines.map((m) => m.id), 0) + 1
  stageName.value = cloned.id || cloned.name || 'stage'
  selectedId.value = null
  openMenuVisible.value = false
}

function openBuiltin(s: Stage) {
  loadIntoEditor(s)
}

function openLocal(key: string) {
  const raw = localStorage.getItem(`bm_stage_${key}`)
  if (!raw) return
  try {
    loadIntoEditor(JSON.parse(raw) as Stage)
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
  editorStage.id = safe
  editorStage.name = safe
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
    } catch (err) {
      saveStatus.value = `fail: ${String(err)}`
    }
  } else {
    localStorage.setItem(`bm_stage_${safe}`, JSON.stringify(editorStage))
    saveStatus.value = `saved ${safe} (local)`
  }
  setTimeout(() => {
    saveStatus.value = ''
  }, 4000)
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
  div.relative.w-full.h-full.flex(style="background:#0b1220")
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
      button.palette-btn.rounded-lg.px-2.py-2.text-white.game-text.text-xs.cursor-grab(
        v-for="preset in WALL_PRESETS"
        :key="preset.id"
        draggable="true"
        :style="{ borderColor: preset.color }"
        @dragstart="onPresetDragStart($event, preset)"
      )
        div.font-black.uppercase {{ preset.label }}
        div.opacity-60 {{ preset.hint.w }}×{{ preset.hint.h }}
      div.mt-4.flex.flex-col.gap-2
        label.text-white.text-xs.game-text.uppercase.opacity-70 Stage Name
        input.px-2.py-1.rounded.bg-slate-800.text-white.border-2.border-slate-600.text-xs(
          v-model="stageName"
          placeholder="stage1"
        )
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
          button.text-left.text-white.game-text.text-xs.px-2.py-1.rounded.bg-slate-700(
            v-for="s in STAGES"
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
        button.bg-yellow-500.text-black.py-2.rounded-lg.game-text.font-black(@click="exportJson") EXPORT
        button.bg-red-600.text-white.py-2.rounded-lg.game-text.font-black(@click="clear") CLEAR
        button.bg-slate-700.text-white.py-2.rounded-lg.game-text.font-black(@click="$router.push('/stage')") ← PLAY

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
      div.absolute.top-2.right-2.text-white.text-xs.game-text.opacity-70.pointer-events-none
        div Drag palette → canvas to place
        div Click to select · Drag to move
        div R / Shift+R to rotate · Del to remove
        div Right-click to delete · Wheel to zoom

      //- Selected-piece toolbar (on-canvas, touch friendly)
      div.absolute.flex.gap-2.items-center.px-3.py-2.rounded-full.bg-black.border-2.border-yellow-300(
        v-if="selectedId !== null"
        class="bottom-4 left-1/2 -translate-x-1/2 z-10"
        @pointerdown.stop
      )
        span.text-yellow-200.game-text.text-xs.font-black.uppercase {{ selectedMachine()?.type }}
        button.rotate-btn(@click="rotateSelected(-ROT_STEP)" title="Rotate -15°") ↺
        button.rotate-btn(@click="rotateSelected(ROT_STEP)" title="Rotate +15°") ↻
        button.rotate-btn(@click="resetRotationSelected()" title="Reset rotation") 0°
        button.rotate-btn.bg-red-600(@click="deleteSelected()" title="Delete") 🗑
</template>

<style scoped lang="sass">
.palette-btn
  background: #1e293b
  border: 2px solid #475569
  text-align: left

  &:hover
    background: #334155

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
</style>
