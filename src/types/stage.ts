// ─── Stage / Machines Types ─────────────────────────────────────────────────

export type Vec = { x: number; y: number }

export type MachineType =
  | 'centrifugalBooster'
  | 'magneticRail'
  | 'overloadedGenerator'
  | 'conveyorBelt'
  | 'gravityWell'
  | 'pneumaticLauncher'
  | 'pressurePlate'
  | 'destroyableGlassTube'
  | 'wall'
  | 'goal'
  | 'spawn'
  | 'boss'

export interface Machine {
  id: number
  type: MachineType
  x: number
  y: number
  w: number
  h: number
  rot: number // radians
  destroyed?: boolean
  triggered?: boolean
  cooldownUntil?: number
  // boss-only
  hp?: number
  maxHp?: number
  modelId?: string
  // generic runtime
  meta?: Record<string, any>
}

export interface Stage {
  id: string
  name: string
  width: number
  height: number
  spawn: Vec
  goal: Vec
  machines: Machine[]
  // Score thresholds for stars. 1★ is just completing.
  starThresholds: [number, number, number]
  launchPenalty: number
  bossKillBonus: number
  bossModelId?: string
}

export interface Spinner {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  rotation: number
  rotationSpeed: number
  frozenUntil: number
  modelId: string
  // Rail lock
  railId?: number | null
  railProgress?: number
}

export type StagePhase =
  | 'loading'
  | 'tap_to_start'
  | 'countdown'
  | 'aiming'
  | 'launched'
  | 'boss_dead'
  | 'complete'
