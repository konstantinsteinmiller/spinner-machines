import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage1',
  'name': 'Entry Grounds',
  'width': 2200,
  'height': 1400,
  'spawn': {
    'x': 180,
    'y': 620
  },
  'goal': {
    'x': 2050,
    'y': 540
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1100,
      'y': 20,
      'w': 2200,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1100,
      'y': 1380,
      'w': 2200,
      'h': 40,
      'rot': 0
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 700,
      'w': 40,
      'h': 1400,
      'rot': 0
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 2180,
      'y': 700,
      'w': 40,
      'h': 1400,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 460,
      'y': 480,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 480,
      'y': 760,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 7,
      'type': 'destroyableGlassTube',
      'x': 300,
      'y': 620,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 8,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 620,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 9,
      'type': 'destroyableGlassTube',
      'x': 640,
      'y': 620,
      'w': 60,
      'h': 120,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'centrifugalBooster',
      'x': 780,
      'y': 620,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'overloadedGenerator',
      'x': 900,
      'y': 560,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'overloadedGenerator',
      'x': 900,
      'y': 680,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'wall',
      'x': 1000,
      'y': 620,
      'w': 20,
      'h': 320,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'wall',
      'x': 1040,
      'y': 460,
      'w': 20,
      'h': 440,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'wall',
      'x': 1220,
      'y': 400,
      'w': 20,
      'h': 440,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'gravityWell',
      'x': 1140,
      'y': 500,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'conveyorBelt',
      'x': 1140,
      'y': 260,
      'w': 160,
      'h': 50,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'magneticRail',
      'x': 1500,
      'y': 260,
      'w': 260,
      'h': 50,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'wall',
      'x': 1700,
      'y': 180,
      'w': 1000,
      'h': 20,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'wall',
      'x': 1700,
      'y': 900,
      'w': 1000,
      'h': 20,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'wall',
      'x': 1220,
      'y': 540,
      'w': 20,
      'h': 720,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 420,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'destroyableGlassTube',
      'x': 1600,
      'y': 420,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 24,
      'type': 'destroyableGlassTube',
      'x': 1700,
      'y': 420,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 25,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 700,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 26,
      'type': 'destroyableGlassTube',
      'x': 1700,
      'y': 700,
      'w': 40,
      'h': 120,
      'rot': 0
    },
    {
      'id': 27,
      'type': 'pneumaticLauncher',
      'x': 1640,
      'y': 560,
      'w': 100,
      'h': 80,
      'rot': 6.2831853071795845
    },
    {
      'id': 28,
      'type': 'overloadedGenerator',
      'x': 1380,
      'y': 540,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 29,
      'type': 'wall',
      'x': 2020,
      'y': 200,
      'w': 20,
      'h': 720,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'boss',
      'x': 1820,
      'y': 540,
      'w': 180,
      'h': 180,
      'rot': 0,
      'hp': 60,
      'maxHp': 60,
      'modelId': 'rainbow'
    },
    {
      'id': 31,
      'type': 'goal',
      'x': 2100,
      'y': 260,
      'w': 120,
      'h': 120,
      'rot': 0
    },
    {
      'id': 32,
      'type': 'wall',
      'x': 860,
      'y': 1040,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 34,
      'type': 'wall',
      'x': 360,
      'y': 1100,
      'w': 640,
      'h': 24,
      'rot': 0.7853981633974483,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 35,
      'type': 'wall',
      'x': 2000,
      'y': 1160,
      'w': 320,
      'h': 56,
      'rot': -0.7853981633974483,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 36,
      'type': 'wall',
      'x': 2020,
      'y': 640,
      'w': 260,
      'h': 24,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 37,
      'type': 'wall',
      'x': 1900,
      'y': 760,
      'w': 24,
      'h': 260,
      'rot': 0,
      'meta': {
        'material': 'stone'
      }
    },
    {
      'id': 38,
      'type': 'pressurePlate',
      'x': 1140,
      'y': 1200,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 39,
      'type': 'wall',
      'x': 1440,
      'y': 260,
      'w': 20,
      'h': 160,
      'rot': 0,
      'meta': {
        'material': 'wood',
        'link': 'plate1'
      }
    },
    {
      'id': 40,
      'type': 'destroyableGlassTube',
      'x': 1380,
      'y': 260,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 41,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 260,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 42,
      'type': 'pneumaticLauncher',
      'x': 400,
      'y': 620,
      'w': 90,
      'h': 60,
      'rot': 0
    },
    {
      'id': 43,
      'type': 'destroyableGlassTube',
      'x': 1980,
      'y': 780,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 44,
      'type': 'destroyableGlassTube',
      'x': 2080,
      'y': 780,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 1800,
      'y': 1300,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 46,
      'type': 'destroyableGlassTube',
      'x': 2100,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 47,
      'type': 'overloadedGenerator',
      'x': 1940,
      'y': 100,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 48,
      'type': 'destroyableGlassTube',
      'x': 1300,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 49,
      'type': 'destroyableGlassTube',
      'x': 1580,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 50,
      'type': 'gearSystem',
      'x': 300,
      'y': 20,
      'w': 100,
      'h': 100,
      'rot': -1.5707963267948963,
      'meta': {
        'link': 'gear1'
      }
    },
    {
      'id': 51,
      'type': 'wall',
      'x': 940,
      'y': 120,
      'w': 120,
      'h': 24,
      'rot': 1.308996938995747,
      'meta': {
        'material': 'metal',
        'link': 'gear1'
      }
    }
  ],
  'starThresholds': [
    0,
    500,
    1000
  ],
  'launchPenalty': 50,
  'bossKillBonus': 250,
  'bossModelId': 'rainbow'
}

export default stage
