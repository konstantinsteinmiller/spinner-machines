import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-5',
  'name': 'Conveyor Chaos',
  'width': 2000,
  'height': 1800,
  'spawn': {
    'x': 200,
    'y': 1650
  },
  'goal': {
    'x': 1000,
    'y': 80
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1000,
      'y': 20,
      'w': 2000,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1000,
      'y': 1780,
      'w': 2000,
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
      'x': 1980,
      'y': 900,
      'w': 40,
      'h': 1800,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 300,
      'y': 1500,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 1700,
      'y': 1500,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 7,
      'type': 'conveyorBelt',
      'x': 500,
      'y': 1470,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 8,
      'type': 'conveyorBelt',
      'x': 1500,
      'y': 1470,
      'w': 400,
      'h': 50,
      'rot': 3.141592653589793
    },
    {
      'id': 9,
      'type': 'wall',
      'x': 900,
      'y': 1150,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'wall',
      'x': 1100,
      'y': 1150,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'conveyorBelt',
      'x': 700,
      'y': 1120,
      'w': 400,
      'h': 50,
      'rot': 3.141592653589793
    },
    {
      'id': 12,
      'type': 'conveyorBelt',
      'x': 1300,
      'y': 1120,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'wall',
      'x': 300,
      'y': 800,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'wall',
      'x': 1700,
      'y': 800,
      'w': 600,
      'h': 20,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'conveyorBelt',
      'x': 500,
      'y': 770,
      'w': 400,
      'h': 50,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'conveyorBelt',
      'x': 1500,
      'y': 770,
      'w': 400,
      'h': 50,
      'rot': 3.141592653589793
    },
    {
      'id': 17,
      'type': 'centrifugalBooster',
      'x': 960,
      'y': 400,
      'w': 120,
      'h': 100,
      'rot': -1.5707963267948966
    },
    {
      'id': 18,
      'type': 'destroyableGlassTube',
      'x': 900,
      'y': 1300,
      'w': 40,
      'h': 140,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'destroyableGlassTube',
      'x': 1100,
      'y': 1300,
      'w': 40,
      'h': 140,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'destroyableGlassTube',
      'x': 900,
      'y': 950,
      'w': 40,
      'h': 140,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'destroyableGlassTube',
      'x': 1100,
      'y': 950,
      'w': 40,
      'h': 140,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'overloadedGenerator',
      'x': 600,
      'y': 300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'overloadedGenerator',
      'x': 1400,
      'y': 300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 24,
      'type': 'wall',
      'x': 700,
      'y': 200,
      'w': 20,
      'h': 200,
      'rot': 0
    },
    {
      'id': 25,
      'type': 'wall',
      'x': 1300,
      'y': 200,
      'w': 20,
      'h': 200,
      'rot': 0
    },
    {
      'id': 26,
      'type': 'boss',
      'x': 1000,
      'y': 200,
      'w': 200,
      'h': 200,
      'rot': 0,
      'hp': 75,
      'maxHp': 75,
      'modelId': 'thunderstorm'
    },
    {
      'id': 27,
      'type': 'goal',
      'x': 1000,
      'y': 80,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 28,
      'type': 'wall',
      'x': 1750,
      'y': 1100,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 29,
      'type': 'wall',
      'x': 1750,
      'y': 1320,
      'w': 220,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 30,
      'type': 'wall',
      'x': 1640,
      'y': 1210,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 31,
      'type': 'wall',
      'x': 1860,
      'y': 1210,
      'w': 20,
      'h': 220,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 32,
      'type': 'overloadedGenerator',
      'x': 1700,
      'y': 1210,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS5'
      }
    },
    {
      'id': 33,
      'type': 'overloadedGenerator',
      'x': 1800,
      'y': 1210,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS5'
      }
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 1750,
      'y': 1150,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS5'
      }
    },
    {
      'id': 35,
      'type': 'pressurePlate',
      'x': 600,
      'y': 900,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS5'
      }
    },
    {
      'id': 36,
      'type': 'gearSystem',
      'x': 1980,
      'y': 1200,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'gearS5'
      }
    },
    {
      'id': 37,
      'type': 'wall',
      'x': 1700,
      'y': 1150,
      'w': 140,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'stone',
        'link': 'gearS5'
      }
    },
    {
      'id': 39,
      'type': 'overloadedGenerator',
      'x': 120,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'overloadedGenerator',
      'x': 220,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 41,
      'type': 'overloadedGenerator',
      'x': 1880,
      'y': 120,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 42,
      'type': 'overloadedGenerator',
      'x': 1780,
      'y': 220,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 43,
      'type': 'destroyableGlassTube',
      'x': 100,
      'y': 1140,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 44,
      'type': 'destroyableGlassTube',
      'x': 1920,
      'y': 1140,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 45,
      'type': 'destroyableGlassTube',
      'x': 1920,
      'y': 1260,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 46,
      'type': 'destroyableGlassTube',
      'x': 1880,
      'y': 1660,
      'w': 60,
      'h': 100,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    600,
    1200
  ],
  'launchPenalty': 55,
  'bossKillBonus': 320,
  'bossModelId': 'thunderstorm'
}

export default stage
