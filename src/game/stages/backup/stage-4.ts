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
      'x': 1400,
      'y': 360,
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
      'type': 'wall',
      'x': 1400,
      'y': 80,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 27,
      'type': 'wall',
      'x': 1400,
      'y': 300,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 28,
      'type': 'wall',
      'x': 1290,
      'y': 190,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 29,
      'type': 'wall',
      'x': 1510,
      'y': 190,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 30,
      'type': 'overloadedGenerator',
      'x': 1350,
      'y': 190,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS4'
      }
    },
    {
      'id': 31,
      'type': 'overloadedGenerator',
      'x': 1450,
      'y': 190,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS4'
      }
    },
    {
      'id': 32,
      'type': 'destroyableGlassTube',
      'x': 1400,
      'y': 130,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS4'
      }
    },
    {
      'id': 33,
      'type': 'pressurePlate',
      'x': 1360,
      'y': 1100,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS4'
      }
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 1080,
      'y': 1080,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 35,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 1080,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 36,
      'type': 'destroyableGlassTube',
      'x': 2000,
      'y': 1080,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 37,
      'type': 'destroyableGlassTube',
      'x': 480,
      'y': 1080,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 38,
      'type': 'destroyableGlassTube',
      'x': 480,
      'y': 120,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 39,
      'type': 'destroyableGlassTube',
      'x': 1180,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'destroyableGlassTube',
      'x': 1620,
      'y': 120,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 41,
      'type': 'destroyableGlassTube',
      'x': 1400,
      'y': 240,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS4'
      }
    },
    {
      'id': 42,
      'type': 'overloadedGenerator',
      'x': 2480,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 43,
      'type': 'overloadedGenerator',
      'x': 2660,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 44,
      'type': 'overloadedGenerator',
      'x': 2660,
      'y': 260,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 2480,
      'y': 260,
      'w': 80,
      'h': 80,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    600,
    1200
  ],
  'launchPenalty': 50,
  'bossKillBonus': 320,
  'bossModelId': 'diamond'
}

export default stage
