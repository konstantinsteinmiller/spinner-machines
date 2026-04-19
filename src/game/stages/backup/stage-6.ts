import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage-6',
  'name': 'Pinball Chamber',
  'width': 1600,
  'height': 1600,
  'spawn': {
    'x': 200,
    'y': 800
  },
  'goal': {
    'x': 1400,
    'y': 1380
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 800,
      'y': 20,
      'w': 1600,
      'h': 40,
      'rot': 0
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 800,
      'y': 1580,
      'w': 1600,
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
      'x': 1580,
      'y': 800,
      'w': 40,
      'h': 1600,
      'rot': 0
    },
    {
      'id': 5,
      'type': 'wall',
      'x': 800,
      'y': 300,
      'w': 600,
      'h': 24,
      'rot': 0.7853981633974483
    },
    {
      'id': 6,
      'type': 'wall',
      'x': 800,
      'y': 300,
      'w': 600,
      'h': 24,
      'rot': -0.7853981633974483
    },
    {
      'id': 7,
      'type': 'wall',
      'x': 800,
      'y': 1300,
      'w': 600,
      'h': 24,
      'rot': 0.7853981633974483
    },
    {
      'id': 8,
      'type': 'wall',
      'x': 800,
      'y': 1300,
      'w': 600,
      'h': 24,
      'rot': -0.7853981633974483
    },
    {
      'id': 9,
      'type': 'pneumaticLauncher',
      'x': 120,
      'y': 800,
      'w': 100,
      'h': 80,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'centrifugalBooster',
      'x': 1480,
      'y': 800,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 11,
      'type': 'centrifugalBooster',
      'x': 800,
      'y': 120,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 12,
      'type': 'centrifugalBooster',
      'x': 800,
      'y': 1480,
      'w': 120,
      'h': 100,
      'rot': 0
    },
    {
      'id': 13,
      'type': 'gravityWell',
      'x': 400,
      'y': 400,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 14,
      'type': 'gravityWell',
      'x': 1200,
      'y': 400,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 15,
      'type': 'gravityWell',
      'x': 400,
      'y': 1200,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 16,
      'type': 'gravityWell',
      'x': 1200,
      'y': 1200,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 17,
      'type': 'overloadedGenerator',
      'x': 600,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 18,
      'type': 'overloadedGenerator',
      'x': 1000,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 19,
      'type': 'overloadedGenerator',
      'x': 800,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'overloadedGenerator',
      'x': 800,
      'y': 1000,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'boss',
      'x': 800,
      'y': 800,
      'w': 220,
      'h': 220,
      'rot': 0,
      'hp': 100,
      'maxHp': 100,
      'modelId': 'boulder'
    },
    {
      'id': 22,
      'type': 'wall',
      'x': 1400,
      'y': 1450,
      'w': 200,
      'h': 20,
      'rot': 0
    },
    {
      'id': 23,
      'type': 'goal',
      'x': 1400,
      'y': 1380,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 24,
      'type': 'wall',
      'x': 1300,
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
      'x': 1300,
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
      'x': 1190,
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
      'x': 1410,
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
      'x': 1250,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS6'
      }
    },
    {
      'id': 29,
      'type': 'overloadedGenerator',
      'x': 1350,
      'y': 200,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plateS6'
      }
    },
    {
      'id': 30,
      'type': 'destroyableGlassTube',
      'x': 1300,
      'y': 140,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plateS6'
      }
    },
    {
      'id': 31,
      'type': 'pressurePlate',
      'x': 300,
      'y': 1300,
      'w': 90,
      'h': 70,
      'rot': 0,
      'meta': {
        'link': 'plateS6'
      }
    },
    {
      'id': 32,
      'type': 'destroyableGlassTube',
      'x': 80,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 33,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 100,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 1500,
      'y': 1380,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 35,
      'type': 'destroyableGlassTube',
      'x': 100,
      'y': 1480,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 36,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 1200,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 37,
      'type': 'destroyableGlassTube',
      'x': 800,
      'y': 400,
      'w': 60,
      'h': 100,
      'rot': 0
    },
    {
      'id': 38,
      'type': 'overloadedGenerator',
      'x': 1360,
      'y': 1520,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 39,
      'type': 'overloadedGenerator',
      'x': 1460,
      'y': 1520,
      'w': 80,
      'h': 80,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    650,
    1300
  ],
  'launchPenalty': 55,
  'bossKillBonus': 350,
  'bossModelId': 'boulder'
}

export default stage
