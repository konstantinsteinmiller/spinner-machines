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
      'x': 980,
      'y': 460,
      'w': 120,
      'h': 100,
      'rot': -3.3306690738754696e-16
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
      'y': 260,
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
      'y': 100,
      'w': 90,
      'h': 90,
      'rot': 0
    },
    {
      'id': 28,
      'type': 'overloadedGenerator',
      'x': 1480,
      'y': 600,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'overloadedGenerator',
      'x': 500,
      'y': 580,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 31,
      'type': 'overloadedGenerator',
      'x': 1900,
      'y': 1720,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 32,
      'type': 'overloadedGenerator',
      'x': 100,
      'y': 880,
      'w': 80,
      'h': 80,
      'rot': 0
    },
    {
      'id': 33,
      'type': 'destroyableGlassTube',
      'x': 80,
      'y': 120,
      'w': 40,
      'h': 140,
      'rot': 0
    },
    {
      'id': 34,
      'type': 'destroyableGlassTube',
      'x': 1920,
      'y': 120,
      'w': 40,
      'h': 140,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    500,
    1000
  ],
  'launchPenalty': 80,
  'bossKillBonus': 320,
  'bossModelId': 'thunderstorm'
}

export default stage
