# Hyper Ki Legends — Project Foundation

> Stable "who we are" doc. Read at start of every conversation. Updated rarely.

## The one-line pitch
A from-scratch browser fighting game that recreates the *feel* of the PS2-era
Budokai fighters — the childhood game — with 100% original characters and art.

## Why this project exists
Yassine grew up on Budokai 3 and wants to rebuild that feeling with his own
hands: the ki economy, teleport counters, beam clashes, transformations,
Dragon Rush. It is his **first game**. Learning happens by directing features
one at a time and watching them get built and verified.

## Core philosophy (do not violate)
1. **Original IP only.** Mechanics and feel are the homage; characters, names,
   designs, and story are ours (Kairo, Riven, Lord Vesk, Master Iro). Never
   copy Toei/Bandai assets, names, or likenesses. This is non-negotiable —
   it's what lets the game live publicly and stay honest.
2. **Free forever.** No monetization, ever (see Values around money).
3. **The game is always playable.** Every session ends with a working build.
   Big risky changes keep a fallback (e.g., `legacy.html`).
4. **Verify in the browser, not in theory.** Every feature gets driven and
   tested in the running game before it's called done.
5. **One feature at a time.** No half-built systems piling up.

## Lessons from prior art (that shape design)
- **From Budokai 3 itself:** depth comes from universal systems (ki as one
  currency for offense *and* defense), not from character-specific gimmicks.
  Every defensive option must cost something.
- **From this project's own sessions:**
  - Browser games silently run stale code until the tab reloads → the title
    screen carries a version tag (`vN · NAME`) so you can always tell which
    build you're on. Keep bumping it.
  - Turtling must always have an answer (throws, guard crush) or fights stall.
  - A shared-screen guessing minigame needs hidden/locked picks to stay fair.

## Product scope
- **What it IS (V1):** a local browser fighter — arcade vs CPU + 2P shared
  keyboard, 4 fighters, 4 stages, deep combat (combos, cancels, counters,
  vanish battles, throws, charged heavies, signature waves, beams, clashes,
  Dragon Rush, transformations, arrow-duel ultimates), rebindable controls,
  persistent settings.
- **What it is NOT (V1):** online multiplayer, mobile, monetized, a DBZ asset
  ROM/mod, or dependent on any framework.
- **What it becomes (V2+, someday):** training mode, arcade ladder with
  unlockables, more fighters/stages, story-ish mode, gamepad support,
  maybe WebRTC versus. Only if it stays fun to build.

## Key architectural decisions (with reasoning)
Full detail in `ARCHITECTURE.md`. The locked ones:
- **Vanilla JS + Canvas 2D + Web Audio synth, zero dependencies, no build
  step.** Nothing to install or break; the whole game is readable code.
- **Layered ES-module architecture** (core → data → services → world →
  minigames/ai → flow → render → screens). Dependencies point downward only.
- **Data-driven content:** new character/stage/attack = one data entry.
- **Intent boundary:** human input and CPU AI emit the same "intent" shape;
  the simulation never knows who's driving. (This is the future seam for
  replays, training dummies, gamepad, netcode.)
- **All art is procedural** (drawn in code) — no asset pipeline, no asset IP risk.
- **`legacy.html`** is the frozen single-file build: double-clickable, no
  server needed, permanent fallback.
- **`window.HKL`** is the deliberate debug/test/mod hook.

## The people
- **Yassine** — student, solo builder, first game, ~1 hr/week. Directs features.
- **Claude** — pair-builder across sessions via the three-file handoff system.

## Tech stack (locked)
Vanilla JavaScript (ES modules) · Canvas 2D · Web Audio API ·
localStorage · python `http.server` for local serving · git + GitHub
(repo: https://github.com/yassinemaazaoui114-git/Hyper-Ki.git)

## Values around money
Free. No ads, no purchases, no donations. This is a love letter and a
learning project — and because its inspiration is someone else's IP, keeping
it non-commercial is also the ethically and legally safe lane.

## Legal and ethical commitments
- Never ship Toei/Bandai/Shueisha assets, character names, or likenesses.
- Game mechanics are not copyrightable — the systems homage is fair game;
  art, names, music, and story must stay original.
- The README credits the inspiration honestly without claiming affiliation.

## The definition of success
- **1 year from start:** the game *feels* like the childhood memory —
  full combat depth, training mode, an arcade ladder with endings, and at
  least 6 fighters. Friends can play it on Yassine's PC and it holds up.
- **2 years from start:** progression/unlockables and a light story mode;
  the repo is something Yassine proudly shows as "my first game."
- **5 years from start:** no fixed vision — deliberately open. If it's still
  fun to build, it keeps growing; if not, V1 is already the win.

*Last updated: 2026-07-07*
