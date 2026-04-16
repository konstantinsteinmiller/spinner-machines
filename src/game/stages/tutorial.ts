import type { Stage } from '@/types/stage'

const stage: Stage = {
  'id': 'tutorial',
  'name': 'Tutorial',
  'width': 1600,
  'height': 900,
  'spawn': {
    'x': 160,
    'y': 220
  },
  'goal': {
    'x': 1460,
    'y': 780
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
      'y': 880,
      'w': 1600,
      'h': 40,
      'rot': 0
    },
    {
      'id': 3,
      'type': 'wall',
      'x': 20,
      'y': 450,
      'w': 40,
      'h': 900,
      'rot': 0
    },
    {
      'id': 4,
      'type': 'wall',
      'x': 1580,
      'y': 450,
      'w': 40,
      'h': 900,
      'rot': 0
    },
    {
      'id': 10,
      'type': 'destroyableGlassTube',
      'x': 360,
      'y': 220,
      'w': 60,
      'h': 140,
      'rot': 0,
      'meta': {
        'hint': 'Glass tubes shatter on impact — launch right to clear the path.'
      }
    },
    {
      'id': 11,
      'type': 'centrifugalBooster',
      'x': 560,
      'y': 220,
      'w': 120,
      'h': 100,
      'rot': 0,
      'meta': {
        'hint': 'Boosters spin you up and fling you further.'
      }
    },
    {
      'id': 12,
      'type': 'gravityWell',
      'x': 1280,
      'y': 220,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'hint': 'Gravity wells pull you in, then slingshot you out.'
      }
    },
    {
      'id': 13,
      'type': 'magneticRail',
      'x': 820,
      'y': 220,
      'w': 260,
      'h': 50,
      'rot': 0,
      'meta': {
        'hint': 'Magnetic rails catch you and glide you along.'
      }
    },
    {
      'id': 16,
      'type': 'pressurePlate',
      'x': 1300,
      'y': 500,
      'w': 80,
      'h': 60,
      'rot': 0,
      'meta': {
        'link': 'plate1',
        'hint': 'Pressure plates detonate every linked machine at once.'
      }
    },
    {
      'id': 17,
      'type': 'overloadedGenerator',
      'x': 700,
      'y': 560,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1',
        'hint': 'Overloaded generators explode when triggered — chain reactions hurt bosses.'
      }
    },
    {
      'id': 18,
      'type': 'overloadedGenerator',
      'x': 820,
      'y': 560,
      'w': 80,
      'h': 80,
      'rot': 0,
      'meta': {
        'link': 'plate1'
      }
    },
    {
      'id': 19,
      'type': 'wall',
      'x': 640,
      'y': 560,
      'w': 20,
      'h': 140,
      'rot': 0
    },
    {
      'id': 20,
      'type': 'wall',
      'x': 880,
      'y': 560,
      'w': 20,
      'h': 140,
      'rot': 0
    },
    {
      'id': 21,
      'type': 'wall',
      'x': 760,
      'y': 500,
      'w': 260,
      'h': 20,
      'rot': 0
    },
    {
      'id': 22,
      'type': 'wall',
      'x': 760,
      'y': 640,
      'w': 260,
      'h': 20,
      'rot': 0
    },
    {
      'id': 30,
      'type': 'boss',
      'x': 1000,
      'y': 720,
      'w': 160,
      'h': 160,
      'rot': 0,
      'hp': 12,
      'maxHp': 12,
      'modelId': 'rainbow',
      'meta': {
        'hint': 'Bosses drop huge bonus score — finish them off.'
      }
    },
    {
      'id': 40,
      'type': 'conveyorBelt',
      'x': 1260,
      'y': 780,
      'w': 220,
      'h': 60,
      'rot': 0,
      'meta': {
        'hint': 'Conveyor belts carry you toward the exit — ride the belt in.'
      }
    },
    {
      'id': 41,
      'type': 'wall',
      'x': 780,
      'y': 340,
      'w': 220,
      'h': 20,
      'rot': 0
    },
    {
      'id': 42,
      'type': 'goal',
      'x': 1460,
      'y': 780,
      'w': 120,
      'h': 120,
      'rot': 0,
      'meta': {
        'hint': 'Reach the exit gate to clear the stage!'
      }
    },
    {
      'id': 50,
      'type': 'wall',
      'x': 900,
      'y': 400,
      'w': 20,
      'h': 120,
      'rot': 0,
      'meta': {
        'hint': 'Walls block paths — plan your angles.'
      }
    },
    {
      'id': 60,
      'type': 'gearSystem',
      'x': 1580,
      'y': 220,
      'w': 100,
      'h': 100,
      'rot': 0,
      'meta': {
        'link': 'tutgear1',
        'hint': 'Gear systems rotate linked walls — the rail launches you right into this one!'
      }
    },
    {
      'id': 61,
      'type': 'wall',
      'x': 1460,
      'y': 710,
      'w': 140,
      'h': 20,
      'rot': 0,
      'meta': {
        'material': 'metal',
        'link': 'tutgear1'
      }
    },
    {
      'id': 62,
      'type': 'pneumaticLauncher',
      'x': 840,
      'y': 740,
      'w': 90,
      'h': 60,
      'rot': 0
    }
  ],
  'starThresholds': [
    0,
    1,
    2
  ],
  'launchPenalty': 0,
  'bossKillBonus': 100,
  'bossModelId': 'rainbow'
}

export default stage
