// ─── Top & Bottom Part Identifiers ───────────────────────────────────────────

export const TOP_PART_IDS = {
  STAR: 'star',
  TRIANGLE: 'triangle',
  ROUND: 'round',
  QUADRATIC: 'quadratic',
  CUSHIONED: 'cushioned',
  PIERCER: 'piercer'
} as const

export type TopPartId = (typeof TOP_PART_IDS)[keyof typeof TOP_PART_IDS]

export const BOTTOM_PART_IDS = {
  SPEEDY: 'speedy',
  TANKY: 'tanky',
  BALANCED: 'balanced'
} as const

export type BottomPartId = (typeof BOTTOM_PART_IDS)[keyof typeof BOTTOM_PART_IDS]

// ─── Part Interfaces ─────────────────────────────────────────────────────────

export interface TopPart {
  id: TopPartId
  label: string
  damageMultiplier: number
  defenseMultiplier: number
  healthBonus: number
  shape: 'star' | 'spiky' | 'circle' | 'square' | 'cushion' | 'piercer'
}

export interface BottomPart {
  id: BottomPartId
  label: string
  speedMultiplier: number
  forceDecay: number
  healthBonus: number
  weight: number
}

// ─── Bayblade Composition ────────────────────────────────────────────────────

/**
 * Special boss behaviors. Plain bosses just get the stat bump; abilities
 * opt into mechanics handled in useBaybladeGame:
 *  - 'ghost'    → splits into 2 linked blades on launch; shared damage;
 *                 no friendly fire with its ghost counterpart
 *  - 'split'    → on death, spawns 5 mini blades with temporary invincibility
 *  - 'partners' → every enemy blade in the team shares a group; no FF
 *  - 'healers'  → like 'partners' + heals on contact; 20% oversize only
 */
export type BossAbility = 'ghost' | 'split' | 'partners' | 'healers'

export interface BaybladeConfig {
  topPartId: TopPartId
  bottomPartId: BottomPartId
  topLevel?: number
  bottomLevel?: number
  modelId?: string
  isBoss?: boolean
  bossAbility?: BossAbility
}

export interface BaybladeStats {
  maxHp: number
  totalWeight: number
  damageMultiplier: number
  defenseMultiplier: number
  speedMultiplier: number
  forceDecay: number
  top: TopPart
  bottom: BottomPart
}

// ─── Runtime Bayblade State ──────────────────────────────────────────────────

export interface BaybladeState {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  // Acceleration ramp — blade builds speed over ACCEL_FRAMES after launch
  ax: number
  ay: number
  accelFramesLeft: number
  radius: number
  hp: number
  maxHp: number
  rotation: number
  rotationSpeed: number
  hitFlash: number
  wallBounceCount: number
  lastHitTime: number
  config: BaybladeConfig
  owner: 'player' | 'npc'
  isBoss: boolean
  // ── Boss ability state ────────────────────────────────────────────────
  /** Blades sharing a groupId treat each other as allies (no FF damage). */
  groupId?: number
  /** For healer groups — friendly contact heals instead of nothing. */
  healsAllies?: boolean
  /** Partner/healer allies still physically collide (bounce + separate) but
   *  take no damage from each other. Ghost/split siblings leave this false
   *  so they continue to phase through one another. */
  bouncesAllies?: boolean
  /** Ghost-boss linkage — damage taken is mirrored to these blade ids. */
  linkedIds?: number[]
  /** Ghost-boss parents set this so the first launch triggers the split. */
  ghostPending?: boolean
  /** Split-boss state — this blade will shatter into mini blades on death. */
  splitsOnDeath?: boolean
  /** Set on split children to prevent recursive shattering. */
  isSplitChild?: boolean
  /** Timestamp (performance.now) until which the blade ignores collisions
   *  and renders as blinking — used by split-children while they settle. */
  invulnerableUntil?: number
}

// ─── Meteor Shower Particle ──────────────────────────────────────────────────

export interface MeteorParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
}

// ─── Spritesheet Animation ──────────────────────────────────────────────────

export interface SpritesheetAnimation {
  x: number
  y: number
  frame: number
  timer: number
  frameDuration: number
  totalFrames: number
  frameWidth: number
  frameHeight: number
  scale: number
  vertical: boolean
  image: HTMLImageElement
}

// ─── Game Phase State Machine ────────────────────────────────────────────────

export type GamePhase =
  | 'idle'
  | 'tap_to_start'
  | 'meteor_intro'
  | 'deciding_turn'
  | 'player_turn'
  | 'player_launched'
  | 'npc_turn'
  | 'npc_launched'
  | 'game_over'

export type GameResult = 'win' | 'lose' | null
