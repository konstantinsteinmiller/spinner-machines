import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-3',
  'name': 'Gravity Maze',
  'width': 2400,
  'height': 1600,
  'spawn': {
    'x': 200,
    'y': 800
  },
  'goal': {
    'x': 2280,
    'y': 800
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1200,
      'y': 20,
      'w': 2400,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1200,
      'y': 1580,
      'w': 2400,
      'h': 40,
      'rot': 0
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 800,
      'w': 40,
      'h': 1600,
      'rot': 0
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 2380,
      'y': 800,
      'w': 40,
      'h': 1600,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 600,
      'y': 400,
      'w': 20,
      'h': 600,
      'rot': 0
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 1000,
      'y': 900,
      'w': 20,
      'h': 600,
      'rot': 0
    },
    {
      'id': 7,
      'type': 'wall',
      'x': 1400,
      'y': 400,
      'w': 20,
      'h': 600,
      'rot': 0
    },
    {
      'id': 9,
      'type': 'wall',
      'x': 800,
      'y': 200,
      'w': 420,
      'h': 20,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'wall',
      'x': 1600,
      'y': 200,
      'w': 420,
      'h': 20,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'wall',
      'x': 800,
      'y': 1400,
      'w': 420,
      'h': 20,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'wall',
      'x': 1600,
      'y': 1400,
      'w': 420,
      'h': 20,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'gravityWell',
      'x': 800,
      'y': 500,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'gravityWell',
      'x': 1200,
      'y': 700,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'gravityWell',
      'x': 1600,
      'y': 500,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'gravityWell',
      'x': 800,
      'y': 1100,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'gravityWell',
      'x': 1600,
      'y': 1100,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'destroyableGlassTube',
      'x': 400,
      'y': 300,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'destroyableGlassTube',
      'x': 400,
      'y': 1300,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'destroyableGlassTube',
      'x': 2000,
      'y': 300,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'destroyableGlassTube',
      'x': 2000,
      'y': 1300,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'centrifugalBooster',
      'x': 400,
      'y': 800,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'boss',
      'x': 2080,
      'y': 800,
      'w': 200,
      'h': 200,
      'rot': 0,
      'hp': 80,
      'maxHp': 80,
      'modelId': 'tornado'
    },
    {
      'id': 24,
      'type': 'goal',
      'x': 2280,
      'y': 800,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 25,
      'type': 'wall',
      'x': 1200,
      'y': 90,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 26,
      'type': 'wall',
      'x': 1200,
      'y': 310,
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
      'x': 1090,
      'y': 200,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 28,
      'type': 'wall',
      'x': 1310,
      'y': 200,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 29,
      'type': 'overloadedGenerator',
      'x': 1150,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS3'
      }
    },
    {
      'id': 30,
      'type': 'overloadedGenerator',
      'x': 1250,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS3'
      }
    },
    {
      'id': 31,
      'type': 'destroyableGlassTube',
      'x': 1200,
      'y': 140,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS3'
      }
    },
    {
      'id': 32,
      'type': 'pressurePlate',
      'x': 1200,
      'y': 1400,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS3'
      }
    },
    {
      'id': 33,
      'type': 'gearSystem',
      'x': 800,
      'y': 1580,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'gearS3'
      }
    },
    {
      'id': 34,
      'type': 'wall',
      'x': 800,
      'y': 1300,
      'w': 120,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'gearS3'
      }
    },
    {
      'id': 35,
      'type': 'destroyableGlassTube',
      'x': 660,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 36,
      'type': 'destroyableGlassTube',
      'x': 760,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 37,
      'type': 'destroyableGlassTube',
      'x': 860,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 38,
      'type': 'destroyableGlassTube',
      'x': 960,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 39,
      'type': 'destroyableGlassTube',
      'x': 1460,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'destroyableGlassTube',
      'x': 1560,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 41,
      'type': 'destroyableGlassTube',
      'x': 1660,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 42,
      'type': 'destroyableGlassTube',
      'x': 1760,
      'y': 120,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 43,
      'type': 'destroyableGlassTube',
      'x': 1600,
      'y': 1480,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 44,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 1480,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 48,
      'type': 'wall',
      'x': 1780,
      'y': 820,
      'w': 400,
      'h': 24,
      'rot': 1.5707963267948963,
      'meta': {
        'material': 'metal'
      }
    }
  ],
  'starThresholds': [
    0,
    600,
    1200
  ],
  'launchPenalty': 50,
  'bossKillBonus': 300,
  'bossModelId': 'tornado'
}

export default stage
