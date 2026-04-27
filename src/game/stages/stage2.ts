import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-2',
  'name': 'Twin Generators',
  'width': 1800,
  'height': 1200,
  'spawn': {
    'x': 180,
    'y': 600
  },
  'goal': {
    'x': 1640,
    'y': 500
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 900,
      'y': 20,
      'w': 1800,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 900,
      'y': 1180,
      'w': 1800,
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
      'x': 1780,
      'y': 600,
      'w': 40,
      'h': 1200,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 350,
      'y': 420,
      'w': 500,
      'h': 20,
      'rot': 0
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 350,
      'y': 780,
      'w': 500,
      'h': 20,
      'rot': 0
    },
    {
      'id': 7,
      'type': 'centrifugalBooster',
      'x': 520,
      'y': 600,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 8,
      'type': 'overloadedGenerator',
      'x': 760,
      'y': 500,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 9,
      'type': 'overloadedGenerator',
      'x': 860,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'overloadedGenerator',
      'x': 760,
      'y': 700,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'overloadedGenerator',
      'x': 660,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'wall',
      'x': 1000,
      'y': 400,
      'w': 300,
      'h': 24,
      'rot': 0.6283185307179586
    },
    {
      'id': 13,
      'type': 'wall',
      'x': 1000,
      'y': 800,
      'w': 300,
      'h': 24,
      'rot': -0.6283185307179586
    },
    {
      'id': 14,
      'type': 'overloadedGenerator',
      'x': 1200,
      'y': 520,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'overloadedGenerator',
      'x': 1300,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'overloadedGenerator',
      'x': 1200,
      'y': 680,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'overloadedGenerator',
      'x': 1100,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'pneumaticLauncher',
      'x': 1000,
      'y': 900,
      'w': 100,
      'h': 80,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'wall',
      'x': 1550,
      'y': 300,
      'w': 20,
      'h': 480,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'boss',
      'x': 1640,
      'y': 300,
      'w': 180,
      'h': 180,
      'rot': 0,
      'hp': 70,
      'maxHp': 70,
      'modelId': 'dark'
    },
    {
      'id': 21,
      'type': 'goal',
      'x': 1640,
      'y': 500,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'wall',
      'x': 900,
      'y': 70,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 23,
      'type': 'wall',
      'x': 900,
      'y': 290,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 24,
      'type': 'wall',
      'x': 790,
      'y': 180,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 25,
      'type': 'wall',
      'x': 1010,
      'y': 180,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 26,
      'type': 'overloadedGenerator',
      'x': 850,
      'y': 180,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 27,
      'type': 'overloadedGenerator',
      'x': 950,
      'y': 180,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 28,
      'type': 'destroyableGlassTube',
      'x': 900,
      'y': 120,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 29,
      'type': 'pressurePlate',
      'x': 900,
      'y': 1000,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 33,
      'type': 'destroyableGlassTube',
      'x': 1220,
      'y': 160,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 1220,
      'y': 80,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 35,
      'type': 'gravityWell',
      'x': 1500,
      'y': 640,
      'w': 60,
      'h': 60,
      'rot': 0
    },
    {
      'id': 36,
      'type': 'magneticRail',
      'x': 1140,
      'y': 300,
      'w': 240,
      'h': 50,
      'rot': 0
    },
    {
      'id': 37,
      'type': 'destroyableGlassTube',
      'x': 1220,
      'y': 240,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 39,
      'type': 'destroyableGlassTube',
      'x': 1300,
      'y': 160,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 40,
      'type': 'destroyableGlassTube',
      'x': 1300,
      'y': 80,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 41,
      'type': 'destroyableGlassTube',
      'x': 1300,
      'y': 240,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 43,
      'type': 'destroyableGlassTube',
      'x': 120,
      'y': 120,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 44,
      'type': 'destroyableGlassTube',
      'x': 120,
      'y': 1080,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 220,
      'y': 1080,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 46,
      'type': 'overloadedGenerator',
      'x': 220,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 47,
      'type': 'destroyableGlassTube',
      'x': 1700,
      'y': 1100,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS2'
      }
    }
  ],
  'starThresholds': [
    0,
    600,
    1200
  ],
  'launchPenalty': 50,
  'bossKillBonus': 280,
  'bossModelId': 'dark'
}

export default stage
