# Hyper Ki Legends — Session Handoff

> Session note. Rewritten at end of every session.

## Last session date
2026-07-07

## What we did this session
- Built the game from zero to v9 across one giant session: core fighter,
  2P versus, stages/time/difficulty settings, control rebinding, pause menu
  with move list, signature ki waves, ultimate arrow-duel rework (R/Y key).
- Completed most of the combat-depth tier: throws/guard breaks, combo counter
  + damage numbers, ki cancels, vanish battles, charged heavies (guard crush).
- Refactored the single HTML file into a 35-module layered ES-module
  architecture (`src/`), wrote `ARCHITECTURE.md`, kept `legacy.html` as the
  frozen double-clickable fallback.
- Verified every mechanic in the running browser after every change
  (zero console errors at each checkpoint).
- Bootstrapped this three-file handoff system; created GitHub repo push.

## Decisions made this session
- **Original IP only** — mechanics homage to the childhood game, but all
  characters/names/art are ours. Locked in project.md (legal + ethical).
- **Free forever, PC/browser only, solo builder.**
- **Vanilla JS, zero dependencies, no build step** — locked.
- **Layered module architecture** with the intent boundary (human/AI/future
  netcode all speak "intents").
- **Version tag on title screen** bumps with every gameplay change
  (currently `v9 · MODULAR ENGINE`).
- Project home: https://github.com/yassinemaazaoui114-git/Hyper-Ki.git

## Files produced this session
- `index.html` (thin module shell) · `legacy.html` (frozen v8 single-file build)
- `src/**` — 35 modules (core/config/data/services/input/world/minigames/ai/flow/render/screens)
- `ARCHITECTURE.md` · `README.md`
- `hyperki_project.md` · `hyperki_roadmap.md` · `handoff.md` (this system)
- `.claude/launch.json` (local server config, port 8756)

## Where we are on the roadmap
**Phases 0 & 2 done. Phase 1 nearly done (deflect + dizzy remain). Phase 3 is next.**

## What to do next
**The single next action:** open a fresh conversation, upload the 3 handoff
files, and say: *"Build Phase 3 Task 1 — training mode entry on the title menu
with an idle dummy and infinite time."*
That's it. One task. One session. Do not think about later phases.

## Open questions (to resolve in future sessions)
- Should projectile deflect land before or after training mode? (Either is fine.)
- Gamepad support priority — it's Phase 6 but would transform 2P; revisit after Phase 4.
- Does the title "Hyper Ki Legends" stay, or rename to match repo ("Hyper-Ki")?
- Optional: GitHub Pages hosting later? (Would contradict "on PC only" — ask Yassine.)

## Notes for future Claude (any conversation reading this)
- **Yassine is a student, solo, ~1 hr/week, and this is his first game.** He
  directs features one at a time; Claude builds AND verifies in the browser.
  Never call something done without driving it in the running game.
- He plays in a preview panel/browser tab that caches the old build — after
  changes, always remind him to **refresh (F5)** and check the **version tag**
  bottom-right of the title screen. Bump the tag every gameplay change.
- **Do not let him (or yourself) skip phases** or start two features at once.
  The game must be playable at the end of every session.
- **Never add DBZ/Toei/Bandai assets, names, or likenesses** — original IP
  only, free forever. This is foundational (see hyperki_project.md).
- Tech is locked: vanilla JS ES modules, Canvas 2D, Web Audio, no frameworks,
  no build step. Serve with `python -m http.server 8756` (`.claude/launch.json`
  exists). `legacy.html` must stay untouched as fallback.
- Testing trick: `window.HKL` exposes game state + key functions; dispatch
  real `KeyboardEvent`s + pump `HKL.step()` (background tabs freeze rAF).
- End every session by updating roadmap statuses + rewriting this handoff.

*Last updated: 2026-07-07*
