import type { Stage } from '@/types/stage'

// The tutorial stage is deliberately named `tutorial.ts` (not
// `stage*.ts`) so the dynamic glob in `stages/index.ts` leaves it OUT
// of the public STAGES list — it never appears in the Stages modal
// and doesn't count toward battle-pass or achievement rollups. It is
// loaded directly by StageView on first boot only.
const stage: Stage = {
  id: 'tutorial',
  name: 'Tutorial',
  width: 1600,
  height: 900,
  spawn: { x: 160, y: 220 },
  goal: { x: 1460, y: 780 },
  // Completing the tutorial always awards 1 star so the lock chain in
  // the Stages modal doesn't block Stage 1.
  starThresholds: [0, 1, 2],
  launchPenalty: 0,
  bossKillBonus: 100,
  bossModelId: 'rainbow',
  machines: [
    // ── Perimeter walls ──────────────────────────────────────────────
    { id: 1, type: 'wall', x: 800, y: 20, w: 1600, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 800, y: 880, w: 1600, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 450, w: 40, h: 900, rot: 0 },
    { id: 4, type: 'wall', x: 1580, y: 450, w: 40, h: 900, rot: 0 },

    // ── Row 1: straight right from spawn. Tube → booster → well → rail.
    {
      id: 10, type: 'destroyableGlassTube', x: 360, y: 220, w: 60, h: 140, rot: 0,
      meta: { hint: 'Glass tubes shatter on impact — launch right to clear the path.' }
    },
    {
      id: 11, type: 'centrifugalBooster', x: 560, y: 220, w: 120, h: 100, rot: 0,
      meta: { hint: 'Boosters spin you up and fling you further.' }
    },
    {
      id: 12, type: 'gravityWell', x: 780, y: 220, w: 80, h: 80, rot: 0,
      meta: { hint: 'Gravity wells pull you in, then slingshot you out.' }
    },
    {
      id: 13, type: 'magneticRail', x: 1020, y: 220, w: 260, h: 50, rot: 0,
      meta: { hint: 'Magnetic rails catch you and glide you along.' }
    },

    // Launcher on the drop path — fires the spinner RIGHT across the
    // middle row so the spinner clears the wall block and slams into
    // the plate further right.
    {
      id: 14, type: 'pneumaticLauncher', x: 600, y: 500, w: 80, h: 60, rot: 0,
      meta: { hint: 'Pneumatic launchers fire the moment you touch them.' }
    },

    // ── Row 2: pressure plate now at the launcher's trajectory end. ──
    {
      id: 16, type: 'pressurePlate', x: 1300, y: 500, w: 80, h: 60, rot: 0,
      meta: {
        link: 'plate1',
        hint: 'Pressure plates detonate every linked machine at once.'
      }
    },

    // ── Generators trapped behind walls on the left — unreachable
    // without the plate. Hitting the plate cascades them and damages
    // the boss next door. ───────────────────────────────────────────
    {
      id: 17, type: 'overloadedGenerator', x: 700, y: 560, w: 80, h: 80, rot: 0,
      meta: {
        link: 'plate1',
        hint: 'Overloaded generators explode when triggered — chain reactions hurt bosses.'
      }
    },
    {
      id: 18, type: 'overloadedGenerator', x: 820, y: 560, w: 80, h: 80, rot: 0,
      meta: { link: 'plate1' }
    },
    // Cage walls around the generator pair
    { id: 19, type: 'wall', x: 640, y: 560, w: 20, h: 140, rot: 0 },
    { id: 20, type: 'wall', x: 880, y: 560, w: 20, h: 140, rot: 0 },
    { id: 21, type: 'wall', x: 760, y: 500, w: 260, h: 20, rot: 0 },
    { id: 22, type: 'wall', x: 760, y: 640, w: 260, h: 20, rot: 0 },

    // ── Boss at 1/5 normal hp — the cascade takes it most of the way.
    {
      id: 30, type: 'boss', x: 1000, y: 720, w: 160, h: 160, rot: 0,
      hp: 12, maxHp: 12, modelId: 'rainbow',
      meta: { hint: 'Bosses drop huge bonus score — finish them off.' }
    },

    // ── Conveyor belt directly in front of the goal, funnel walls on
    // the other three sides so the spinner cannot be dropped straight
    // onto the exit gate. ────────────────────────────────────────────
    {
      id: 40, type: 'conveyorBelt', x: 1260, y: 780, w: 220, h: 60, rot: 0,
      meta: { hint: 'Conveyor belts carry you toward the exit — ride the belt in.' }
    },
    // Hood wall above the conveyor so the spinner can't fall onto the
    // goal from above.
    { id: 41, type: 'wall', x: 1260, y: 730, w: 220, h: 20, rot: 0 },

    // Exit gate. Left side is open (receives the conveyor), other
    // three sides get blocked by the perimeter or the hood.
    {
      id: 42, type: 'goal', x: 1460, y: 780, w: 120, h: 120, rot: 0,
      meta: { hint: 'Reach the exit gate to clear the stage!' }
    },
    // Roof above the goal
    { id: 43, type: 'wall', x: 1460, y: 710, w: 140, h: 20, rot: 0 },

    // Small decorative wall section with a hint so players learn the
    // concept explicitly.
    {
      id: 50, type: 'wall', x: 900, y: 380, w: 20, h: 120, rot: 0,
      meta: { hint: 'Walls block paths — plan your angles.' }
    }
  ]
}

export default stage
