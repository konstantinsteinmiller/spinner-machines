---
name: pug-tailwind
description: Pug template + Tailwind class gotcha for this Vue project. Any Tailwind utility whose value contains a dot (e.g. `gap-0.5`, `w-1.5`, `p-2.5`, `scale-x-[1.5]`, `opacity-0.5` etc.) CANNOT be written with Pug's dot-class shorthand (`div.flex.gap-0.5`), because Pug parses each dot as a class separator and splits `gap-0.5` into classes `gap-0` and `5`. TRIGGER when writing or editing Vue SFCs that use `<template lang="pug">` and Tailwind, especially when adding classes containing a decimal number or a bracketed value with a dot. Also trigger when investigating Vite/compile errors that point at a `div.something.n-0.5(...)` line or similar Pug syntax.
---

# Pug + Tailwind: dot-in-class-name rule

Pug's shorthand `div.foo.bar` splits on every `.`. Tailwind utilities that
include a literal `.` in their token therefore break when used as shorthand.

## The rule

If a class name contains a `.`, it **must** live in the `class=""` attribute,
never in the dot shorthand.

## Common offenders

- Fractional sizes: `gap-0.5`, `gap-1.5`, `gap-2.5`, `w-0.5`, `w-1.5`, `h-0.5`,
  `h-1.5`, `p-0.5`, `px-1.5`, `py-2.5`, `m-0.5`, `space-x-1.5`, `space-y-0.5`,
  `top-0.5`, `left-1.5`, `inset-0.5`, ...
- Arbitrary values with a decimal: `scale-[1.5]`, `opacity-[0.35]`,
  `w-[1.5rem]`, `h-[2.5rem]`, `translate-x-[0.5px]`, ...
- Anything you add later whose segment matches `/\d+\.\d/`.

## Wrong

```pug
div.flex.items-center.gap-0.5
div.w-1.5.h-1.5
div.p-2.5.rounded-lg
```

Vite/Pug error looks like:

```
  >  25|   div.camera-hint.absolute.z-20.flex.flex-col.items-center.gap-0.5(
----------------------------------------------------------------------^
```

## Right

Move the dotted utility into `class`:

```pug
div.flex.items-center(class="gap-0.5")
div(class="w-1.5 h-1.5")
div.rounded-lg(class="p-2.5")
```

Mix both forms freely — keep plain utilities on the shorthand, push any
`.`-containing utility into `class=""`.

## Checklist before saving a Pug SFC edit

1. Scan every `div.…(...)` shorthand you added for a segment matching
   `\d+\.\d` (e.g. `gap-0.5`, `w-1.5`, `p-2.5`).
2. Scan for bracketed utilities containing `.` (e.g. `scale-[1.2]`,
   `w-[1.5rem]`).
3. Move any offenders into the `class=""` attribute.
4. Responsive variants of the same utility follow the same rule —
   `sm:gap-0.5` etc. are equally broken as shorthand.

If the compile error points at a line like
`div.something.foo-<N>.<M>(...)`, this is almost certainly the cause —
don't waste time on component / Tailwind config / purging theories first.
