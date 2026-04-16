import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage13',
  'name': 'Gravity Labyrinth',
  'width': 2400,
  'height': 1600,
  'spawn': {
    'x': 200,
    'y': 200
  },
  'goal': {
    'x': 2200,
    'y': 1400
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
      'id': 10,
      'type': 'gravityWell',
      'x': 600,
      'y': 400,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'gravityWell',
      'x': 1000,
      'y': 650,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'gravityWell',
      'x': 1400,
      'y': 900,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'gravityWell',
      'x': 1800,
      'y': 1150,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'gravityWell',
      'x': 2000,
      'y': 1400,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'wall',
      'x': 400,
      'y': 700,
      'w': 40,
      'h': 400,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 21,
      'type': 'wall',
      'x': 800,
      'y': 1000,
      'w': 40,
      'h': 400,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 22,
      'type': 'wall',
      'x': 1200,
      'y': 300,
      'w': 40,
      'h': 300,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 23,
      'type': 'wall',
      'x': 1600,
      'y': 500,
      'w': 40,
      'h': 400,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 30,
      'type': 'destroyableGlassTube',
      'x': 600,
      'y': 540,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 31,
      'type': 'destroyableGlassTube',
      'x': 1000,
      'y': 800,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 32,
      'type': 'destroyableGlassTube',
      'x': 1400,
      'y': 1040,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 33,
      'type': 'destroyableGlassTube',
      'x': 1800,
      'y': 1290,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'wall',
      'x': 2100,
      'y': 160,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 41,
      'type': 'wall',
      'x': 2300,
      'y': 160,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 42,
      'type': 'wall',
      'x': 2200,
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
      'x': 2200,
      'y': 280,
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
      'x': 2160,
      'y': 170,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate13'
      }
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 2260,
      'y': 170,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate13'
      }
    },
    {
      'id': 50,
      'type': 'pressurePlate',
      'x': 1100,
      'y': 550,
      'w': 80,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate13'
      }
    },
    {
      'id': 60,
      'type': 'boss',
      'x': 2000,
      'y': 1400,
      'w': 140,
      'h': 140,
      'rot': 0,
      'hp': 50,
      'maxHp': 50,
      'modelId': 'sandstorm'
    },
    {
      'id': 70,
      'type': 'goal',
      'x': 2200,
      'y': 1400,
      'w': 120,
      'h': 120,
      'rot': 0
    },
    {
      'id': 71,
      'type': 'destroyableGlassTube',
      'x': 1200,
      'y': 520,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 72,
      'type': 'destroyableGlassTube',
      'x': 1600,
      'y': 220,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 73,
      'type': 'destroyableGlassTube',
      'x': 1200,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 74,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 1260,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 75,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 1440,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 76,
      'type': 'destroyableGlassTube',
      'x': 400,
      'y': 980,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 77,
      'type': 'destroyableGlassTube',
      'x': 400,
      'y': 1180,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 78,
      'type': 'destroyableGlassTube',
      'x': 400,
      'y': 1360,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 79,
      'type': 'destroyableGlassTube',
      'x': 1600,
      'y': 780,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 80,
      'type': 'destroyableGlassTube',
      'x': 1600,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    550,
    1100
  ],
  'launchPenalty': 55,
  'bossKillBonus': 320,
  'bossModelId': 'sandstorm'
}

export default stage
