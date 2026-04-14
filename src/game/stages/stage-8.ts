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
      'rot': -1.5707963267948966
    },
    {
      'id': 19,
      'type': 'destroyableGlassTube',
      'x': 1100,
      'y': 800,
      'w': 40,
      'h': 160,
      'rot': 1.1102230246251565e-16
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
      'type': 'destroyableGlassTube',
      'x': 2120,
      'y': 140,
      'w': 40,
      'h': 160,
      'rot': 1.1102230246251565e-16
    },
    {
      'id': 25,
      'type': 'destroyableGlassTube',
      'x': 2280,
      'y': 140,
      'w': 40,
      'h': 160,
      'rot': 1.1102230246251565e-16
    }
  ],
  'starThresholds': [
    0,
    600,
    1200
  ],
  'launchPenalty': 85,
  'bossKillBonus': 340,
  'bossModelId': 'sandstorm'
}

export default stage
