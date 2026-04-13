import type { MachineModule } from './base'
import { drawRotRect } from './base'

// Walls are resolved by the physics loop in useStageGame (AABB bounce).
// This module exists so the editor can place them and the renderer can draw.
const mod: MachineModule = {
  type: 'wall',
  label: 'Wall',
  defaultSize: { w: 120, h: 24 },
  color: '#52525b',
  tick: () => {
  },
  render: (ctx, m) => drawRotRect(ctx, m, '#27272a', '#52525b')
}
export default mod
