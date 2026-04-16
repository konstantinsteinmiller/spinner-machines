import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage12',
  'name': 'Rail Express',
  'width': 3000,
  'height': 1200,
  'spawn': {
    'x': 200,
    'y': 260
  },
  'goal': {
    'x': 2800,
    'y': 940
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1500,
      'y': 20,
      'w': 3000,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1500,
      'y': 1180,
      'w': 3000,
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
      'x': 2980,
      'y': 600,
      'w': 40,
      'h': 1200,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'magneticRail',
      'x': 900,
      'y': 260,
      'w': 1200,
      'h': 50,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'magneticRail',
      'x': 1860,
      'y': 940,
      'w': 1200,
      'h': 50,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 260,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 260,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'destroyableGlassTube',
      'x': 1800,
      'y': 940,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'destroyableGlassTube',
      'x': 2400,
      'y': 940,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'wall',
      'x': 1500,
      'y': 600,
      'w': 2600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'wall',
      'x': 2300,
      'y': 160,
      'w': 20,
      'h': 200,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 41,
      'type': 'wall',
      'x': 2500,
      'y': 160,
      'w': 20,
      'h': 200,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 42,
      'type': 'wall',
      'x': 2400,
      'y': 60,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 43,
      'type': 'wall',
      'x': 2400,
      'y': 260,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 44,
      'type': 'overloadedGenerator',
      'x': 2360,
      'y': 140,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate12'
      }
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 2460,
      'y': 160,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate12'
      }
    },
    {
      'id': 50,
      'type': 'pressurePlate',
      'x': 2600,
      'y': 940,
      'w': 80,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate12'
      }
    },
    {
      'id': 60,
      'type': 'centrifugalBooster',
      'x': 2650,
      'y': 700,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 70,
      'type': 'boss',
      'x': 2600,
      'y': 940,
      'w': 140,
      'h': 140,
      'rot': 0,
      'hp': 50,
      'maxHp': 50,
      'modelId': 'diamond'
    },
    {
      'id': 80,
      'type': 'goal',
      'x': 2800,
      'y': 940,
      'w': 120,
      'h': 120,
      'rot': 0
    },
    {
      'id': 81,
      'type': 'gearSystem',
      'x': 1200,
      'y': 1180,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'gear12'
      }
    },
    {
      'id': 82,
      'type': 'wall',
      'x': 1200,
      'y': 800,
      'w': 120,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'gear12'
      }
    },
    {
      'id': 83,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 500,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 84,
      'type': 'destroyableGlassTube',
      'x': 920,
      'y': 520,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 85,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 520,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 86,
      'type': 'destroyableGlassTube',
      'x': 1400,
      'y': 680,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 87,
      'type': 'destroyableGlassTube',
      'x': 1060,
      'y': 680,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 88,
      'type': 'destroyableGlassTube',
      'x': 700,
      'y': 680,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 89,
      'type': 'overloadedGenerator',
      'x': 2880,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 90,
      'type': 'overloadedGenerator',
      'x': 2420,
      'y': 100,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate12'
      }
    },
    {
      'id': 91,
      'type': 'overloadedGenerator',
      'x': 2400,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate12'
      }
    }
  ],
  'starThresholds': [
    0,
    550,
    1100
  ],
  'launchPenalty': 55,
  'bossKillBonus': 300,
  'bossModelId': 'diamond'
}

export default stage
