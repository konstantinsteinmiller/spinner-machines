import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'stage19',
  'name': 'Steel Fortress',
  'width': 2600,
  'height': 1600,
  'spawn': {
    'x': 200,
    'y': 200
  },
  'goal': {
    'x': 2400,
    'y': 1400
  },
  'machines': [
    {
      'id': 1,
      'type': 'wall',
      'x': 1300,
      'y': 20,
      'w': 2600,
      'h': 40,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 2,
      'type': 'wall',
      'x': 1300,
      'y': 1580,
      'w': 2600,
      'h': 40,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 800,
      'w': 40,
      'h': 1600,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 2580,
      'y': 800,
      'w': 40,
      'h': 1600,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 10,
      'type': 'wall',
      'x': 800,
      'y': 600,
      'w': 20,
      'h': 700,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate19a'
      }
    },
    {
      'id': 11,
      'type': 'wall',
      'x': 1800,
      'y': 600,
      'w': 20,
      'h': 700,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'plate19b'
      }
    },
    {
      'id': 20,
      'type': 'overloadedGenerator',
      'x': 700,
      'y': 400,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate19a'
      }
    },
    {
      'id': 21,
      'type': 'overloadedGenerator',
      'x': 700,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate19a'
      }
    },
    {
      'id': 22,
      'type': 'destroyableGlassTube',
      'x': 700,
      'y': 600,
      'w': 60,
      'h': 120,
      'rot': 0,
      'meta': {
        'link': 'plate19a'
      }
    },
    {
      'id': 30,
      'type': 'overloadedGenerator',
      'x': 1900,
      'y': 400,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate19b'
      }
    },
    {
      'id': 31,
      'type': 'overloadedGenerator',
      'x': 1900,
      'y': 800,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate19b'
      }
    },
    {
      'id': 32,
      'type': 'destroyableGlassTube',
      'x': 1900,
      'y': 600,
      'w': 60,
      'h': 120,
      'rot': 0,
      'meta': {
        'link': 'plate19b'
      }
    },
    {
      'id': 40,
      'type': 'pressurePlate',
      'x': 500,
      'y': 1400,
      'w': 80,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate19a'
      }
    },
    {
      'id': 41,
      'type': 'pressurePlate',
      'x': 1400,
      'y': 1400,
      'w': 80,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate19b'
      }
    },
    {
      'id': 50,
      'type': 'pneumaticLauncher',
      'x': 300,
      'y': 300,
      'w': 90,
      'h': 60,
      'rot': 0
    },
    {
      'id': 60,
      'type': 'boss',
      'x': 2200,
      'y': 1400,
      'w': 140,
      'h': 140,
      'rot': 0,
      'hp': 50,
      'maxHp': 50,
      'modelId': 'diamond'
    },
    {
      'id': 70,
      'type': 'goal',
      'x': 2400,
      'y': 1400,
      'w': 120,
      'h': 120,
      'rot': 0
    },
    {
      'id': 71,
      'type': 'gearSystem',
      'x': 2580,
      'y': 800,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'gear19'
      }
    },
    {
      'id': 72,
      'type': 'wall',
      'x': 2100,
      'y': 1000,
      'w': 20,
      'h': 200,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'gear19'
      }
    },
    {
      'id': 73,
      'type': 'overloadedGenerator',
      'x': 1160,
      'y': 660,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 78,
      'type': 'wall',
      'x': 1240,
      'y': 432,
      'w': 320,
      'h': 24,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 79,
      'type': 'wall',
      'x': 1240,
      'y': 728,
      'w': 320,
      'h': 24,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 80,
      'type': 'wall',
      'x': 1092,
      'y': 580,
      'w': 24,
      'h': 320,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 81,
      'type': 'wall',
      'x': 1388,
      'y': 580,
      'w': 24,
      'h': 320,
      'rot': 0,
      'meta': {
        'material': 'metal'
      }
    },
    {
      'id': 82,
      'type': 'overloadedGenerator',
      'x': 1300,
      'y': 660,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 83,
      'type': 'overloadedGenerator',
      'x': 1160,
      'y': 520,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 84,
      'type': 'overloadedGenerator',
      'x': 1300,
      'y': 520,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 85,
      'type': 'pressurePlate',
      'x': 2500,
      'y': 1500,
      'w': 60,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    }
  ],
  'starThresholds': [
    0,
    700,
    1400
  ],
  'launchPenalty': 60,
  'bossKillBonus': 360,
  'bossModelId': 'diamond'
}

export default stage
