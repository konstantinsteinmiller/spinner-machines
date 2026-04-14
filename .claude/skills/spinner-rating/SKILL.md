---
name: spinner-rating
description: Rules of the Spinner Machines stage rating / exit-gate system. Use whenever a task touches stage completion, stars, coin payout, the `goal` machine, `finishStage`, `launchPenalty`, `starThresholds`, or the player-score HUD. Trigger on keywords like "rating", "stars", "exit gate", "goal", "finish stage", "launches penalty", "star thresholds".
---

# Spinner Machines rating system

The full specification lives at the repo root:
**`rating-system.md`**. Always read it before changing anything in the list of
"files that own this system" below — do not re-derive the rules from memory.

## When this skill applies

Invoke this skill when the user's request involves any of:

- Adding, removing, or modifying stage completion logic.
- Changing how stars are awarded or how many coins a stage pays.
- Editing `goal.ts` / the exit gate behavior (e.g. "must stop inside").
- Editing `useStageGame.ts#finishStage`, `launch`, or the phase machine
  around completion.
- Authoring or validating a new stage JSON (must include a `goal` machine).
- Tuning `starThresholds` / `launchPenalty` / `bossKillBonus`.
- HUD work that shows score, launches, stars, or coin deltas in
  `StageView.vue`.

If the task only *mentions* scoring in passing (e.g. unrelated UI polish on
the reward modal), skim `rating-system.md` but do not rewrite the rules.

## Files that own this system

- `src/use/useStageGame.ts`
- `src/game/machines/goal.ts`
- `src/types/stage.ts`
- `src/game/stages/stage*.ts`
- `src/views/StageView.vue`

## Non-negotiable invariants

1. A stage can only be completed by **stopping inside the exit gate** — never
   by brushing past it. `goal#tick` must check both `inside` and
   `speed < REST_SPEED`.
2. Minimum rating on completion is **1 star**. `starThresholds[0]` is not used
   as a gate.
3. Coin payout is **delta over previous best**, not a flat award per finish.
4. `finishStage` must be idempotent within a run — guard with
   `phase === 'complete'`.
5. Every shipped stage and every editor-saved stage **must** contain at least
   one `goal` machine. A stage with no goal is unfinishable and therefore
   invalid.

## Quick formula cheatsheet

```
final   = max(0, score - launches * stage.launchPenalty)
stars   = 1
        + (final >= stage.starThresholds[1] ? 1 : 0)
        + (final >= stage.starThresholds[2] ? 1 : 0)
coins   = max(0, COINS_FOR_STARS[stars] - COINS_FOR_STARS[prevBest])
COINS_FOR_STARS = [0, 50, 100, 200]
```

## Before finishing a task in this area

- Re-read `rating-system.md` if your change crosses one of the owned files.
- Verify every stage still has a `goal` machine.
- If you touched coin math, confirm `earned` cannot go negative and that
  `bestStars` only moves upward.
