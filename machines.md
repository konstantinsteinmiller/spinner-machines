# Spinner Machines — Machine Reference

Every machine placed on a stage is one of the modules in
`src/game/machines/`. This document is the source of truth for what each
one *does* (its runtime behavior) and what it *should look like* in the
target cel-shaded art style (flat fills, bold black outlines, limited
tonal shading, Brawl-Stars / Rayman adjacent).

The shared visual language for the whole set:

- **Outlines**: uniform, bold (~4px equivalent) matte-black contour
  around every silhouette and internal shape break.
- **Shading**: max 2–3 tonal steps per surface — a flat base color,
  one shadow pool, one warm or cool highlight strip. No gradients
  except for localized rim lighting and energy effects.
- **Palette**: saturated, poster-like hues. Metal parts are cool
  greys/blues with a diagonal white gloss streak. Energy is a
  self-colored glow, never mixed.
- **Silhouette**: readable at 64px. Every machine has a distinctive
  profile and one "hero detail" the eye locks onto.

Field reference used below:
`type` (id), `label` (editor name), `defaultSize` (w×h in stage units),
`color` (editor palette accent).

---

## Wall — `wall`

**Function.** Passive static obstacle. The physics loop in
`useStageGame#step` resolves the spinner against every non-destroyed
wall via rotated-AABB bounce, dealing wall damage proportional to the
impact speed (`impact * WALL_DAMAGE_PER_SPEED`). Walls carry `hp` /
`maxHp` derived from their material (`wood`, `stone`, `metal`) via
`wallMaxHp(m)`. **No score is awarded on a hit** — only on destruction
(`max(5, round(maxHp / 2))`). Once `hp <= 0` the wall is marked
`destroyed` and disappears from collision + render.

**Default size.** 120 × 24. **Editor color.** `#52525b`.

**Materials.**

- **Wood** — softest, warm brown, fastest to break.
- **Stone** — grey, moderate HP, visible chipping.
- **Metal** — cool steel, highest HP.

**Cel-shaded look.** A chunky brick / plank / steel slab with a bold
black outer outline and 2–3 internal outline marks describing "panels"
(wood planks, stone seams, metal rivets). Flat base fill + one darker
shadow band along the bottom edge and one warm highlight strip on the
top edge. As HP drops, jagged cel-shaded crack lines (simple zigzag
paths with black outline only) appear on the surface, and a subtle
red tint creeps in from the edges. At low HP small chunks visibly
missing from the corners.

---

## Exit Gate — `goal`

**Function.** The stage's only completion trigger. `goal#tick` checks
every physics step whether the spinner is **inside** the gate
(`dist < w/2 + sp.r`) **and** at rest (`speed < REST_SPEED`, matching
the global `STOP_SPEED`). Only when both conditions hold does it call
`ctx.onGoal()` → `useStageGame#finishStage`, which assigns stars and
pays coins. Brushing the gate while still moving is intentionally a
no-op — the player has to actually park on it.

**Default size.** 120 × 120. **Editor color.** `#22c55e`.

**Cel-shaded look.** A raised circular landing pad — a flat green
disc with a bold black rim, a thinner dashed inner ring, and a small
bullseye dot at the center. A soft pulsing green halo drawn as a
radial gradient behind the outline sells the "stop here" language.
Add two or three angled cel-shaded "runway chevrons" pointing inward
around the rim to reinforce that the spinner should come to rest on
the pad rather than cross it. No heavy textures — pure color blocks +
outlines.

---

## Boss — `boss`

**Function.** The stage antagonist. `boss#tick` pushes the spinner out
of the boss circle on contact, reflecting velocity with an elastic
response. After a per-hit cooldown (`HIT_COOLDOWN = 400ms`) contact
deals damage based on impact speed (`max(1, round(impact * 0.6))`).
**No score is awarded per hit** — when `hp <= 0` the boss is
destroyed and `ctx.onBossDead()` fires, which in turn triggers
`stage.bossKillBonus` in `finishStage`. The rendered `modelId`
(editor-swappable via the toolbar cycler) selects which spinner-model
image is drawn as the boss body, so any skin in `SPINNER_MODEL_IDS`
can be re-used as a boss sprite.

**Default size.** 180 × 180. **Editor color.** `#7c3aed`.

**Cel-shaded look.** A hulking circular creature silhouetted by a
thick black outline, with the chosen `modelId` sprite painted inside
and given an over-saturated rim light in its theme color (a blue
dragon gets a cyan rim, a fire boss an orange rim). A flat red HP bar
floats above the head with a matte-black border and a tiny notch
marker for mid-HP. A slow lazy rotation + subtle breathing scale
already exists in code; the art just needs to read as a single heavy
blob so the cel rim light does the lifting.

---

## Centrifugal Booster — `centrifugalBooster`

**Function.** A one-shot re-direction pad. When the spinner enters its
rotated AABB, `tick` latches `triggered = true`, computes the pad's
facing direction from `m.rot`, and overwrites the spinner's velocity
to `max(currentSpeed * BOOST, MIN_EXIT)` in that direction (BOOST 1.5,
MIN_EXIT 8). The latch clears when the spinner leaves the pad, so it
can fire again on re-entry. **Awards no score** — pure redirection
tool that shouldn't be farmable.

**Default size.** 100 × 60. **Editor color.** `#facc15`.

**Cel-shaded look.** An inset metal plate with a bright yellow
emblem: four spinning blade spokes radiating from a central hub. The
plate is a deep slate-blue with black panel outlines; the spokes are
flat saturated yellow with a black outline, slow-rotating. A bold
direction chevron points from the center toward the exit side,
reinforcing which way the boost throws you. Add a thin warm glow
halo along the exit edge when triggered (animate opacity briefly)
to sell the kick.

---

## Conveyor Belt — `conveyorBelt`

**Function.** Continuous directional push. On every tick while the
spinner overlaps the belt, `tick` either snaps the spinner's velocity
to `MIN_RETURN_SPEED = 3` in the belt direction (if it was nearly
stopped) or additively nudges it by `PUSH = 0.35` along that
direction. Not destructible. Not a score source. Used primarily as a
distraction / redirection path — a way to move a resting spinner off
a dead spot or to twist a launch mid-flight.

**Default size.** 180 × 50. **Editor color.** `#94a3b8`.

**Cel-shaded look.** A flat steel belt body with bold black border
and two black rivet caps at each end. The top surface is tessellated
with repeating black chevrons that scroll along the belt direction —
cel-shaded arrows, not tread texture. A single warm side-light strip
along the top sells the metallic read without gradients. Keep the
render 2D and flat; the scrolling chevrons are the motion cue.

---

## Pneumatic Launcher — `pneumaticLauncher`

**Function.** A hard one-shot kick. When the spinner enters, `tick`
overwrites its velocity to `LAUNCH_SPEED = 22` along `m.rot`. Only
fires once per entry (latched by `triggered`, cleared on exit).
Non-destructible. Awards no score. Contrast with the centrifugal
booster: the pneumatic launcher is an absolute velocity set, not a
multiplier — it's for forcibly redirecting a slow spinner or
canonning one through a tight corridor.

**Default size.** 90 × 60. **Editor color.** `#22c55e`.

**Cel-shaded look.** A short barrel / cannon body with a chunky base
plate. Deep forest-green metal shell with a black outline, an inset
triangle on the firing face showing the muzzle direction, and two
thin black rivet dots on the base. A brief cel-shaded smoke-puff
sprite (three overlapping green-tinted ovals with outlines) can pop
on fire. The whole shape reads like a stubby harpoon gun.

---

## Magnetic Rail — `magneticRail`

**Function.** Locks the spinner onto a straight line and drags it
along. On entry, `tick` sets `sp.railId = m.id`, snaps the spinner
onto the rail's centerline (projecting its local position onto the
rail axis), and sets velocity to `RAIL_SPEED = 16` along `m.rot`.
Exits release the rail. No score. Used for scripted traversal — the
spinner can't steer while on rails, so rails are placed to force
specific trajectories through puzzle rooms.

**Default size.** 240 × 50. **Editor color.** `#60a5fa`.

**Cel-shaded look.** Two parallel cyan-blue rails with bold black
outlines running along the machine's long axis, set into a dark
rectangular bed. Between the rails, small diagonal dash marks scroll
along the travel direction — they're cel-shaded "speed lines", not
pixel texture. The whole bed has a soft electric-blue rim light on
the long edges, painted flat (no gradient), to sell the magnetic
field. Keep it low-detail and unmistakably "train track".

---

## Pressure Plate — `pressurePlate`

**Function.** A trigger switch. First time the spinner touches it,
`triggered` latches and any machine in `ctx.machines` whose
`meta.link` matches this plate's `meta.link` is marked destroyed.
Currently used to open up walled-off pathways (wall + plate share a
`meta.link` string). **Awards no score** — the reward is the new
path the player unlocks, not the plate itself.

**Default size.** 80 × 20. **Editor color.** `#fbbf24`.

**Cel-shaded look.** A flat amber floor panel sitting slightly below
its black-outlined frame. Before trigger: warm orange/yellow plate
with a thick matte-black border and two small inset bolt dots in the
corners. After trigger: the plate visibly sinks (swap to the dark
green "pressed" state already in code) and a single bold black
exclamation arrow flickers once above it. A dashed colored tether
line (matching `meta.link` color) can optionally be drawn from the
plate to its linked wall for visual clarity in the editor.

---

## Gravity Well — `gravityWell`

**Function.** A soft pull zone. Each tick, while the spinner is inside
a `RADIUS = 180` area centered on the machine, `tick` adds a force
toward the center scaled by `STRENGTH * (1 - d / RADIUS)` — i.e., a
linearly-softening gravity. Not destructible, no score. Used to curve
launches around obstacles or to keep a wandering spinner trapped in
a scoring area.

**Default size.** 60 × 60. **Editor color.** `#a855f7`.

**Cel-shaded look.** A violet void core with a bold black outline
around a small central circle, surrounded by concentric pulsing
rings drawn as thin purple strokes (the existing `for (let i = 0; i
< 3; i++)` ring render already nails this — keep it). Add a cel-
style black-outlined "swirl arrow" orbiting the core to show the
pull direction. The outer radial gradient stays, but painted in only
two flat steps (inner purple disk + outer translucent halo) for the
cel look, with a thicker black outline on the core.

---

## Overloaded Generator — `overloadedGenerator`

**Function.** A proximity bomb with chain reactions. On contact,
`tick` bounces the spinner back from the blast center and calls
`explode(m, ctx, SCORE = 100)` which: marks the generator destroyed,
awards 100 points, then iterates every other machine in
`BLAST_RADIUS = 160` — chaining to other overloaded generators
(recursive explode at `CHAIN_SCORE = 50`) and destroying adjacent
walls / glass tubes for an additional 50 each. Because score only
fires on destruction, this machine is the primary set-piece for
chain-point plays.

**Default size.** 80 × 80. **Editor color.** `#f97316`.

**Cel-shaded look.** A boxy industrial generator with a bold black
outline, dark blood-red metal shell, a glowing orange core window in
the center (pulsing opacity), and four black rivet dots on the
corners. Two short black-outlined exhaust pipes on the top. On
trigger: a cel-style "pow" silhouette — a bold outlined irregular
orange polygon with a thin yellow inner flash — scales up for
~200ms then fades. Keep everything hard-edged; no blur.

---

## Destroyable Glass Tube — `destroyableGlassTube`

**Function.** A one-hit breakable barrier. On contact, `tick` marks
it destroyed, calls `ctx.destroyMachine`, awards `SCORE = 40`, and
lightly slows the spinner (`vx *= 0.92`, `vy *= 0.92`) so the crunch
has a little weight. Often used to wall off a scoring room that the
player must pay a tiny velocity tax to enter.

**Default size.** 100 × 40. **Editor color.** `#38bdf8`.

**Cel-shaded look.** A translucent-looking flat cyan tube with a
bold black outer outline, a slightly-thinner inner outline stripe
(for "hollow" glass reading), and three or four thin diagonal
highlight streaks along the top surface drawn in pure white with
thin black outlines. On destruction: burst into five cel-shaded
polygon shards (irregular black-outlined cyan triangles) that fly
outward and fade. No realistic shatter — keep it poster-simple.

---

## (Meta) Machine registry

All machines are registered in `src/game/machines/index.ts` and
exported as `PLACEABLE_MACHINES`, which is what the editor palette
reads. Adding a new machine means:

1. Create `src/game/machines/<type>.ts` exporting a `MachineModule`
   (`type`, `label`, `defaultSize`, `color`, `tick`, `render`).
2. Register it in `src/game/machines/index.ts`.
3. Respect the scoring contract from `rating-system.md`: **only
   destructible machines may award score, and only on destruction.**
   Redirection / activation tools award nothing, otherwise players
   can farm score by bouncing through them.
