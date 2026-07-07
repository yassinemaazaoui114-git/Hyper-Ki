# HYPER KI LEGENDS — Architecture

Modular ES-module build. Entry: `index.html` → `src/main.js`.
The previous single-file build is preserved unmodified as `legacy.html`.

**Run it:** ES modules require a server (`python -m http.server 8756`, then
`http://localhost:8756`). Double-clicking `index.html` will not work;
double-click `legacy.html` if you need a serverless fallback.

## The layer model

Dependencies point strictly downward. A module may only import from its own
layer or layers below it — this is what prevents circular imports and keeps
every system independently replaceable.

```
screens/   ← per-state draw composition (title, arena, cinematics…)
render/    ← reusable drawing primitives (fighter rig, stage, fx, HUD, text)
flow/      ← state routing: dispatcher, match lifecycle, menu logic
ai/        ← CPU controller (emits the same intents as human input)
minigames/ ← beam clash, dragon rush, ultimate duel
world/     ← the simulation: fighters, combat, projectiles, beams, camera, fx
input/     ← keyboard capture + intent building
services/  ← audio synth, settings persistence, key bindings
data/      ← pure content: characters, stages, attacks, poses, difficulty
config/    ← version tag
core/      ← canvas, loop, math, the game-state context
```

## Why this architecture

Considered alternatives:

- **Full ECS (entity-component-system):** the right call for hundreds of
  heterogeneous entities. This game has exactly two rich entities (fighters)
  plus simple pools (projectiles/particles). ECS would add indirection with
  no payoff; a typed-object + systems approach reads better at this scale
  and can be migrated later if entity variety explodes.
- **Class-heavy OOP (Fighter/Screen/Scene class hierarchies):** invites
  inheritance trees and god-objects. Instead: plain data objects + pure-ish
  system functions (composition over inheritance), which keeps every
  behavior greppable and testable.
- **Framework/engine adoption (Phaser, Pixi):** would rewrite rendering and
  violate "visually identical"; also adds a build step and dependency risk.
  The custom canvas renderer is small and fully owned.

Chosen: **layered systems + data-driven content + a single injected state
context**. It matches the game's actual shape (one simulation, many screens,
lots of content), makes content growth trivial (new character/stage = one
data entry), and leaves clean seams for the roadmap features.

## Key design decisions

- **One state context (`core/state.js`)** instead of scattered globals.
  Every system imports `{game}` explicitly — visible dependencies, no
  hidden window state. Replay, save games, and rollback netcode all become
  "serialize this one object".
- **Intents as the input boundary.** Humans (`input/intents.js`) and the CPU
  (`ai/cpu.js`) both produce the same intent shape; the simulation cannot
  tell who is driving. This is the seam for netcode, replays, training-mode
  dummies, and new AI behaviors.
- **Data-driven content.** Characters, stages, attacks, poses, and
  difficulty are declarative tables. Mod support = loading extra entries.
- **Audio policy injection.** `services/audio.js` never reads settings;
  `settings.js` pushes the policy in. No service-to-service cycles.
- **`window.HKL` debug hook** (in `main.js`): a curated, documented surface
  for tooling/tests/mods — deliberate, unlike accidental globals.

## Module responsibilities

| Module | Responsibility |
|---|---|
| `core/canvas.js` | canvas element, 2D context, letterbox scaling |
| `core/loop.js` | fixed-timestep loop (60 Hz sim, rAF render) |
| `core/math.js` | clamp/lerp/rand/shade/dist — pure helpers |
| `core/state.js` | the `game` context + announcer/callout/other helpers |
| `data/*` | characters, stages(+rocks), attack frame-data, poses, difficulty/times |
| `services/audio.js` | AudioContext lifecycle, synth (`tone`/`noiseHit`), SFX bank, charge hum |
| `services/settings.js` | SETTINGS load/save, sound policy application |
| `services/bindings.js` | actions, default/current binds, keymap, rebind+swap, persistence |
| `input/keyboard.js` | key listeners, held/pressed maps, rebind capture, audio unlock |
| `input/intents.js` | keys → fighter intent (incl. throw/hyper/dash derivation) |
| `world/fighter.js` | fighter factory, stat multipliers, aura color |
| `world/fighterUpdate.js` | physics, timers, and the full fighter state machine |
| `world/combat.js` | attack stepping, hit resolution, damage/KO, throws, counters, vanish, hyper, transform, projectile launches |
| `world/projectiles.js` | blast/signature travel + collision |
| `world/beams.js` | beam extension, hits, clash detection |
| `world/fx.js` | particle/ghost/damage-text pools (spawn + update) |
| `world/camera.js` | follow/zoom, shake, world transform |
| `world/animation.js` | state → pose mapping + easing |
| `minigames/clash.js` | beam-clash tug-of-war |
| `minigames/rush.js` | dragon rush RPS chase |
| `minigames/ultimate.js` | ultimate arrow duel + finisher |
| `ai/cpu.js` | plan-based CPU intents, difficulty scaling |
| `flow/match.js` | match setup, fight step, pause menu, KO/victory |
| `flow/screens.js` | menu step logic (title/select/msettings/settings/controls) |
| `flow/dispatcher.js` | the only state→step/draw switchboard |
| `render/*` | text, fighter rig, stage, fx, HUD drawing primitives |
| `screens/*` | per-state screen composition (title, select, arena, cinematics…) |
| `main.js` | composition root: wiring + debug hook |

## Future expansion — where things go

- **New character/stage:** one entry in `data/characters.js` / `data/stages.js`.
- **Training mode:** new flow module + a scripted intent provider (dummy
  behaviors are just another intent source).
- **Story/survival/arcade ladder:** new `flow/` modules + screens; `startMatch`
  already takes all parameters from `game`.
- **Save/unlockables:** new `services/progress.js` beside settings/bindings.
- **Replays:** record per-frame intents + initial state; replay = feeding
  recorded intents instead of `humanIntent`.
- **Online play:** the intent boundary is the netcode seam (send intents,
  not state).
- **Gamepad/touch:** new `input/` providers writing the same intent shape.
- **Localization:** extract UI strings to `data/strings.js`; screens already
  centralize display text.
- **Mod support:** allow `data/` tables to be extended from user JSON;
  `window.HKL` is the runtime hook.

## Known technical debt

- `game` is a broad context object (menus + match + fx pools in one place).
  Fine at this size; when it grows, split into `session` (menus/settings)
  vs `match` (per-fight, resettable) sub-objects.
- Screen-step logic reads `pressed` directly; a menu-navigation helper
  (up/down/confirm abstraction) would deduplicate the five menu steppers.
- Magic tuning numbers (physics constants, ranges) live inline in
  `fighterUpdate/combat`; extracting a `data/tuning.js` would help balancing.
- No automated tests; the intent/simulation split makes headless sim tests
  feasible (run `step()` with scripted intents, assert state).
- `stepControls` mixes UI stepping with rebind orchestration; acceptable,
  but a dedicated rebind controller would be cleaner.

## Recommended next architectural steps

1. `data/tuning.js` — centralize balance constants.
2. Headless sim tests (node + scripted intents) for combat regressions.
3. Split `game` into session/match sub-contexts before adding story mode.
4. String table for localization before UI text multiplies.
5. Input-provider interface (keyboard/gamepad/replay/net) formalized when
   the second provider lands.
