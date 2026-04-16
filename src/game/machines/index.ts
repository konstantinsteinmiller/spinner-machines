import type { MachineModule } from './base'
import centrifugalBooster from './centrifugalBooster'
import magneticRail from './magneticRail'
import overloadedGenerator from './overloadedGenerator'
import conveyorBelt from './conveyorBelt'
import gravityWell from './gravityWell'
import pneumaticLauncher from './pneumaticLauncher'
import pressurePlate from './pressurePlate'
import gearSystem from './gearSystem'
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
  gearSystem,
  destroyableGlassTube,
  wall,
  boss,
  goal
}

// Note: `wall` is intentionally omitted here — use the WALL_PRESETS
// palette entries instead so every wall placed from the editor carries
// a wood / stone / metal material (and therefore a real art skin).
export const PLACEABLE_MACHINES: MachineModule[] = [
  centrifugalBooster,
  magneticRail,
  pneumaticLauncher,
  overloadedGenerator,
  destroyableGlassTube,
  conveyorBelt,
  gravityWell,
  pressurePlate,
  gearSystem,
  boss,
  goal
]

export type { MachineModule } from './base'
