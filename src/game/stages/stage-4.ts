import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-4',
  'name': 'Rail Network',
  'width': 2800,
  'height': 1200,
  'spawn': {
    'x': 200,
    'y': 600
  },
  'goal': {
    'x': 2700,
    'y': 600
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1400,
      'y': 20,
      'w': 2800,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1400,
      'y': 1180,
      'w': 2800,
      'h': 40,
      'rot': 0
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 600,
      'w': 40,
      'h': 1200,
      'rot': 0
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 2780,
      'y': 600,
      'w': 40,
      'h': 1200,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 1400,
      'y': 420,
      'w': 2600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 1400,
      'y': 780,
      'w': 2600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 7,
      'type': 'magneticRail',
      'x': 500,
      'y': 220,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 8,
      'type': 'magneticRail',
      'x': 1200,
      'y': 220,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 9,
      'type': 'magneticRail',
      'x': 1900,
      'y': 220,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'magneticRail',
      'x': 500,
      'y': 600,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'magneticRail',
      'x': 1200,
      'y': 600,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'magneticRail',
      'x': 1900,
      'y': 600,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'magneticRail',
      'x': 500,
      'y': 980,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'magneticRail',
      'x': 1200,
      'y': 980,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'magneticRail',
      'x': 1900,
      'y': 980,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'centrifugalBooster',
      'x': 900,
      'y': 220,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'centrifugalBooster',
      'x': 1600,
      'y': 600,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'centrifugalBooster',
      'x': 900,
      'y': 980,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 320,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 320,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 880,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 880,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'wall',
      'x': 2400,
      'y': 300,
      'w': 20,
      'h': 600,
      'rot': 0
    },
    {
      'id': 24,
      'type': 'boss',
      'x': 2550,
      'y': 600,
      'w': 200,
      'h': 200,
      'rot': 0,
      'hp': 75,
      'maxHp': 75,
      'modelId': 'diamond'
    },
    {
      'id': 25,
      'type': 'goal',
      'x': 2700,
      'y': 600,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 26,
      'type': 'destroyableGlassTube',
      'x': 1160,
      'y': 320,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 27,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 220,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 28,
      'type': 'destroyableGlassTube',
      'x': 2260,
      'y': 980,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 29,
      'type': 'destroyableGlassTube',
      'x': 1160,
      'y': 880,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'destroyableGlassTube',
      'x': 2500,
      'y': 120,
      'w': 40,
      'h': 80,
      'rot': 0
    },
    {
      'id': 31,
      'type': 'overloadedGenerator',
      'x': 2660,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 32,
      'type': 'overloadedGenerator',
      'x': 2520,
      'y': 280,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 33,
      'type': 'destroyableGlassTube',
      'x': 2660,
      'y': 280,
      'w': 40,
      'h': 80,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    500,
    1000
  ],
  'launchPenalty': 80,
  'bossKillBonus': 320,
  'bossModelId': 'diamond'
}

export default stage
