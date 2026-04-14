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
      'type': 'pneumaticLauncher',
      'x': 1480,
      'y': 800,
      'w': 100,
      'h': 80,
      'rot': 3.141592653589793
    },
    {
      'id': 11,
      'type': 'pneumaticLauncher',
      'x': 800,
      'y': 120,
      'w': 100,
      'h': 80,
      'rot': 1.5707963267948966
    },
    {
      'id': 12,
      'type': 'pneumaticLauncher',
      'x': 800,
      'y': 1480,
      'w': 100,
      'h': 80,
      'rot': -1.5707963267948966
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
      'type': 'destroyableGlassTube',
      'x': 920,
      'y': 100,
      'w': 100,
      'h': 40,
      'rot': 0
    },
    {
      'id': 28,
      'type': 'destroyableGlassTube',
      'x': 680,
      'y': 1520,
      'w': 100,
      'h': 40,
      'rot': 0
    },
    {
      'id': 29,
      'type': 'destroyableGlassTube',
      'x': 100,
      'y': 80,
      'w': 100,
      'h': 40,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'destroyableGlassTube',
      'x': 1520,
      'y': 80,
      'w': 100,
      'h': 40,
      'rot': 0
    },
    {
      'id': 31,
      'type': 'overloadedGenerator',
      'x': 1400,
      'y': 1520,
      'w': 80,
      'h': 80,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    550,
    1100
  ],
  'launchPenalty': 90,
  'bossKillBonus': 350,
  'bossModelId': 'boulder'
}

export default stage
