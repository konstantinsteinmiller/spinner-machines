import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-8',
  'name': 'Twisting Halls',
  'width': 2400,
  'height': 1600,
  'spawn': {
    'x': 200,
    'y': 800
  },
  'goal': {
    'x': 2300,
    'y': 1200
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
      'x': 500,
      'y': 500,
      'w': 600,
      'h': 24,
      'rot': 0.5235987755982988
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 500,
      'y': 1100,
      'w': 600,
      'h': 24,
      'rot': -0.5235987755982988
    },
    {
      'id': 7,
      'type': 'wall',
      'x': 1200,
      'y': 500,
      'w': 600,
      'h': 24,
      'rot': -0.5235987755982988
    },
    {
      'id': 8,
      'type': 'wall',
      'x': 1200,
      'y': 1100,
      'w': 600,
      'h': 24,
      'rot': 0.5235987755982988
    },
    {
      'id': 9,
      'type': 'wall',
      'x': 1900,
      'y': 500,
      'w': 600,
      'h': 24,
      'rot': 0.5235987755982988
    },
    {
      'id': 10,
      'type': 'wall',
      'x': 1900,
      'y': 1100,
      'w': 600,
      'h': 24,
      'rot': -0.5235987755982988
    },
    {
      'id': 11,
      'type': 'gravityWell',
      'x': 500,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'gravityWell',
      'x': 1200,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'gravityWell',
      'x': 1900,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'overloadedGenerator',
      'x': 800,
      'y': 300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'overloadedGenerator',
      'x': 800,
      'y': 1300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'overloadedGenerator',
      'x': 1500,
      'y': 300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'overloadedGenerator',
      'x': 1500,
      'y': 1300,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'pneumaticLauncher',
      'x': 300,
      'y': 1400,
      'w': 100,
      'h': 80,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'destroyableGlassTube',
      'x': 1100,
      'y': 800,
      'w': 40,
      'h': 160,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'destroyableGlassTube',
      'x': 1800,
      'y': 800,
      'w': 40,
      'h': 160,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'wall',
      'x': 2180,
      'y': 400,
      'w': 20,
      'h': 800,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'boss',
      'x': 2300,
      'y': 800,
      'w': 180,
      'h': 180,
      'rot': 0,
      'hp': 85,
      'maxHp': 85,
      'modelId': 'sandstorm'
    },
    {
      'id': 23,
      'type': 'goal',
      'x': 2300,
      'y': 1200,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 24,
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
      'id': 25,
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
      'id': 26,
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
      'id': 27,
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
      'id': 28,
      'type': 'overloadedGenerator',
      'x': 1150,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS8'
      }
    },
    {
      'id': 29,
      'type': 'overloadedGenerator',
      'x': 1250,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS8'
      }
    },
    {
      'id': 30,
      'type': 'destroyableGlassTube',
      'x': 1200,
      'y': 140,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS8'
      }
    },
    {
      'id': 31,
      'type': 'pressurePlate',
      'x': 1200,
      'y': 1440,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS8'
      }
    },
    {
      'id': 32,
      'type': 'gearSystem',
      'x': 1900,
      'y': 20,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'gearS8'
      }
    },
    {
      'id': 33,
      'type': 'wall',
      'x': 2000,
      'y': 300,
      'w': 120,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'gearS8'
      }
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 120,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 35,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 220,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 36,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 320,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 37,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 420,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 38,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 520,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 39,
      'type': 'overloadedGenerator',
      'x': 2000,
      'y': 180,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 40,
      'type': 'overloadedGenerator',
      'x': 2080,
      'y': 100,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 41,
      'type': 'overloadedGenerator',
      'x': 800,
      'y': 100,
      'w': 80,
      'h': 80,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    700,
    1400
  ],
  'launchPenalty': 60,
  'bossKillBonus': 340,
  'bossModelId': 'sandstorm'
}

export default stage
