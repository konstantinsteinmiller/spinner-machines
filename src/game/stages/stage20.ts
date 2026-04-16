import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage20',
  'name': 'Chaos Finale',
  'width': 3200,
  'height': 1800,
  'spawn': {
    'x': 220,
    'y': 900
  },
  'goal': {
    'x': 3000,
    'y': 900
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1600,
      'y': 20,
      'w': 3200,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1600,
      'y': 1780,
      'w': 3200,
      'h': 40,
      'rot': 0
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 900,
      'w': 40,
      'h': 1800,
      'rot': 0
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 3180,
      'y': 900,
      'w': 40,
      'h': 1800,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 700,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 900,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'destroyableGlassTube',
      'x': 500,
      'y': 1100,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'centrifugalBooster',
      'x': 700,
      'y': 900,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'gravityWell',
      'x': 1000,
      'y': 600,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'magneticRail',
      'x': 1500,
      'y': 600,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'gravityWell',
      'x': 1000,
      'y': 1200,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'magneticRail',
      'x': 1500,
      'y': 1200,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'conveyorBelt',
      'x': 2000,
      'y': 900,
      'w': 400,
      'h': 60,
      'rot': 0
    },
    {
      'id': 31,
      'type': 'pneumaticLauncher',
      'x': 1850,
      'y': 700,
      'w': 90,
      'h': 60,
      'rot': 0
    },
    {
      'id': 32,
      'type': 'pneumaticLauncher',
      'x': 1850,
      'y': 1100,
      'w': 90,
      'h': 60,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'wall',
      'x': 2600,
      'y': 200,
      'w': 20,
      'h': 280,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate20'
      }
    },
    {
      'id': 41,
      'type': 'wall',
      'x': 2820,
      'y': 200,
      'w': 20,
      'h': 280,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate20'
      }
    },
    {
      'id': 42,
      'type': 'wall',
      'x': 2710,
      'y': 80,
      'w': 240,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate20'
      }
    },
    {
      'id': 43,
      'type': 'wall',
      'x': 2710,
      'y': 340,
      'w': 240,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 44,
      'type': 'overloadedGenerator',
      'x': 2660,
      'y': 160,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 45,
      'type': 'overloadedGenerator',
      'x': 2760,
      'y': 160,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 46,
      'type': 'overloadedGenerator',
      'x': 2660,
      'y': 280,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 47,
      'type': 'overloadedGenerator',
      'x': 2760,
      'y': 280,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 48,
      'type': 'destroyableGlassTube',
      'x': 2710,
      'y': 220,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 49,
      'type': 'wall',
      'x': 2900,
      'y': 900,
      'w': 20,
      'h': 400,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate20'
      }
    },
    {
      'id': 50,
      'type': 'pressurePlate',
      'x': 2400,
      'y': 1500,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plate20'
      }
    },
    {
      'id': 60,
      'type': 'boss',
      'x': 2700,
      'y': 900,
      'w': 200,
      'h': 200,
      'rot': 0,
      'hp': 60,
      'maxHp': 60,
      'modelId': 'thunderstorm'
    },
    {
      'id': 70,
      'type': 'goal',
      'x': 3000,
      'y': 900,
      'w': 120,
      'h': 120,
      'rot': 0
    },
    {
      'id': 71,
      'type': 'gravityWell',
      'x': 2020,
      'y': 300,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 72,
      'type': 'gravityWell',
      'x': 2120,
      'y': 1620,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 73,
      'type': 'gravityWell',
      'x': 2720,
      'y': 620,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 74,
      'type': 'gravityWell',
      'x': 2720,
      'y': 1200,
      'w': 100,
      'h': 100,
      'rot': 0
    },
    {
      'id': 76,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 720,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 77,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 1080,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 78,
      'type': 'destroyableGlassTube',
      'x': 180,
      'y': 140,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 79,
      'type': 'destroyableGlassTube',
      'x': 180,
      'y': 1660,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 80,
      'type': 'destroyableGlassTube',
      'x': 3020,
      'y': 160,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 81,
      'type': 'destroyableGlassTube',
      'x': 3040,
      'y': 1640,
      'w': 60,
      'h': 140,
      'rot': 0
    },
    {
      'id': 82,
      'type': 'wall',
      'x': 460,
      'y': 1440,
      'w': 360,
      'h': 24,
      'rot': 0.7853981633974483,
      'meta': {
        'material': 'stone',
        'link': 'plate20'
      }
    },
    {
      'id': 83,
      'type': 'wall',
      'x': 460,
      'y': 300,
      'w': 360,
      'h': 24,
      'rot': 2.356194490192345,
      'meta': {
        'material': 'stone',
        'link': 'plate20'
      }
    }
  ],
  'starThresholds': [
    0,
    800,
    1600
  ],
  'launchPenalty': 65,
  'bossKillBonus': 500,
  'bossModelId': 'thunderstorm'
}

export default stage
