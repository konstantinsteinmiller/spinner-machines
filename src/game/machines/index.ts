import type { MachineModule } from './base'
import centrifugalBooster from './centrifugalBooster'
import magneticRail from './magneticRail'
import overloadedGenerator from './overloadedGenerator'
import conveyorBelt from './conveyorBelt'
import gravityWell from './gravityWell'
import pneumaticLauncher from './pneumaticLauncher'
import pressurePlate from './pressurePlate'
import destroyableGlassTube from './destroyableGlassTube'
import wall from './wall'
import boss from './boss'
import goal from './goal'

export const MACHINE_REGISTRY: Record<string, MachineModule> = {
  centrifugalBooster,
  magneticRail,
  overloadedGenerator,
  conveyorBelt,
  gravityWell,
  pneumaticLauncher,
  pressurePlate,
  destroyableGlassTube,
  wall,
  boss,
  goal
}

export const PLACEABLE_MACHINES: MachineModule[] = [
  centrifugalBooster,
  magneticRail,
  pneumaticLauncher,
  overloadedGenerator,
  destroyableGlassTube,
  conveyorBelt,
  gravityWell,
  pressurePlate,
  wall,
  boss,
  goal
]

export type { MachineModule } from './base'
