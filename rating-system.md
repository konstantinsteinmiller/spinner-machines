# Spinner Machines — Rating System

Authoritative reference for how a player gets a star rating on a stage.

## Completion trigger — the Exit Gate

A stage is only "complete" when the spinner comes to **rest inside the exit
gate** (`goal` machine).

- The gate is any `Machine` of type `goal` placed on the stage.
- "Inside" = center-distance between spinner and gate < `gate.w / 2 + spinner.r`.
- "At rest" = spinner speed `< REST_SPEED` (0.35), matching the global
  `STOP_SPEED` used by the launch settle logic.
- Both conditions must hold in the same physics tick. `goal.ts#tick` calls
  `ctx.onGoal()`, which runs `finishStage()` once (guarded by
  `phase === 'complete'`).

Just brushing the gate while still moving does **not** complete the stage — the
player must actually park on it. This is what makes the gate a skill check
rather than a one-shot touch trigger.

## Star formula

In `useStageGame.ts#finishStage`:

```
final = max(0, score - launches * stage.launchPenalty)
stars = 1                       // minimum on any completion
if (final >= stage.starThresholds[1]) stars = 2
if (final >= stage.starThresholds[2]) stars = 3
```

- `score` accrues live during play (wall hits, boss kill bonus, machine
  interactions — see `StageCtx.addScore`).
- `launches` is the number of spring-arm launches used; each one subtracts
  `stage.launchPenalty` from the final score.
- `starThresholds[0]` is unused by the formula — reaching the gate at all
  guarantees 1 star. Stages define `[_, twoStar, threeStar]`.

## Coins payout

```
COINS_FOR_STARS = [0, 50, 100, 200]
```

Indexed by star count. On finish, the player is paid the **delta** over their
previous best:

```
earned = max(0, COINS_FOR_STARS[stars] - COINS_FOR_STARS[prevBest])
```

- Replaying a stage only pays when you improve your star rating.
- Best stars are persisted in `localStorage` under key `bm_stage_stars` as
  `{ [stageId]: number }`.
- If `stars > prevBest`, the best is updated and written back.

## HUD feedback

- `StageBadge` shows the current stage name.
- Score badge (top-right) shows live score; launches badge is tiered:
    - ≤ 4 launches → green (efficient)
    - 5–10 → yellow → orange (OK)
    - > 10 → red → darkred (wasteful — will hurt final score via `launchPenalty`)
- `FReward` overlay on finish shows the earned stars and the coin delta (or a
  "beat your best" hint when `earned == 0`).

## Editor contract

- Every stage JSON **must** contain at least one `goal` machine, otherwise the
  player has no way to finish and the stage can't be rated.
- The editor palette exposes `goal` under the label "Exit Gate". Placing one is
  part of a valid stage.
- Default editor stage clones `stage1`, which already ships a goal.

## Files that own this system

- `src/use/useStageGame.ts` — phase machine, score, launches, `finishStage`,
  best-stars persistence, coin payout.
- `src/game/machines/goal.ts` — the exit-gate machine (inside + at-rest check).
- `src/types/stage.ts` — `Stage.starThresholds`, `Stage.launchPenalty`,
  `Stage.bossKillBonus`.
- `src/game/stages/stage*.ts` — per-stage thresholds and layout.
- `src/views/StageView.vue` — HUD wiring, reward overlay, launches tiering.

## Invariants / gotchas

- `onGoal` is idempotent: guarded by `phase === 'complete'`.
- `launchPenalty` applies to the **final** score, not running score — score can
  read higher than the final displayed number.
- Any machine that teleports or fast-forwards the spinner must not cause a
  momentary zero-velocity read while overlapping the gate. If adding such a
  machine, consider skipping the gate check for one tick after the teleport.
