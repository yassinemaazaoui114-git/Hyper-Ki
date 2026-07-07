# Hyper Ki Legends — Roadmap

> Living "where we are" doc. Updated after every session.

**Rule:** no phase is skipped. Each phase has a "done-when."
**Working pace assumed:** ~1 hr/week (≈ one Claude session per week; a feature
usually lands within one session, so pace ≈ 1 task/week).
**Status legend:** [ ] not started · [/] in progress · [x] done · [!] blocked · [~] deferred

## 👉 YOU ARE HERE
**Phase 3, Task 1** — Training Mode skeleton
**Next single action:** open a fresh conversation, upload the 3 handoff files,
and say: *"Build Phase 3 Task 1 — training mode entry on the title menu with an
idle dummy and infinite time."*

## Phase 0 — Core game (the childhood feel)
**Goal:** a complete playable Budokai-style fighter with original characters.
**Why it matters:** everything else is decoration on top of this.
**Rough time:** done (built across the first sessions)
### Tasks
- [x] Engine: fixed-timestep loop, camera zoom, procedural cel-shaded fighters
- [x] 4 original fighters (Kairo, Riven, Lord Vesk, Master Iro) with forms/transformations
- [x] Core combat: chains, launcher→pursuit, guard, sidestep, teleport counter
- [x] Ki economy: charge, blasts, 2 beams per character, beam clashes (mash duel)
- [x] Hyper Mode, Dragon Rush (RPS minigame), cinematic ultimates
- [x] HUD (stacked bars, 7-seg ki, gray health), announcer, SFX (Web Audio synth)
- [x] Title / select / VS / victory screens, arcade (vs CPU) flow, difficulty
- [x] 2P local versus (second keyboard layout)
- [x] Match settings: 4 stages, time limits (30/60/99/∞), difficulty
- [x] Game settings: sound/shake/flash toggles (persistent), music removed
- [x] Pause menu: resume / move list / quit
- [x] Control rebinding (per action, per player, swap on conflict, persistent)
- [x] Signature ki waves (toward+blast, chargeable, 1 ki, per-character)
- [x] Ultimate rework: arrow duel 4→3→2, dedicated ult key (R/Y), 5-ki trigger
**Done when:** a friend can sit down and play a full match without help. ✅

## Phase 1 — Combat depth
**Goal:** make the fighting *system* as deep as the inspiration.
**Why it matters:** feel is the whole project (see project.md success).
**Rough time:** mostly done; 2–3 sessions remain
### Tasks
- [x] Throws / guard breaks (guard+punch, unblockable, beats turtling)
- [x] Combo counter + floating damage numbers (chip excluded)
- [x] Ki cancels (guard mid-attack, 0.5 ki, cancel-into-throw works)
- [x] Vanish battles (guard when sent flying, escalating ki cost chains)
- [x] Charged heavy attacks (charge+attack hold, guard crush)
- [ ] Projectile deflect — well-timed attack knocks blasts back
- [ ] Dizzy/stagger state after long combos
- [~] Aerial combos & air dash (deferred — revisit after training mode)
**Done when:** every defensive option has a cost and every offense has an answer.
### Notes
- AI already uses every mechanic (throws vs blockers, cancels on Hard, vanishes).

## Phase 2 — Professional architecture
**Goal:** a codebase that survives years of growth.
**Why it matters:** single-file was hitting its ceiling at ~3k lines.
**Rough time:** done + 2 short follow-ups
### Tasks
- [x] Refactor to layered ES-module architecture (35 modules, src/ tree)
- [x] `legacy.html` frozen fallback (double-clickable, serverless)
- [x] ARCHITECTURE.md (layers, decisions, expansion map, debt list)
- [x] Git repo + push to GitHub (Hyper-Ki)
- [ ] Extract `data/tuning.js` (balance constants out of simulation code)
- [ ] First headless sim test (scripted intents, assert combat outcomes)
**Done when:** repo is public, and a new feature touches ≤3 files on average. ✅ (follow-ups optional)

## Phase 3 — Training mode + presentation polish
**Goal:** the lab where combos are learned + the drama the finishers deserve.
**Why it matters:** first game a new player should see; makes testing every later phase easier.
**Rough time:** 5–7 sessions (~6 weeks at current pace)
### Tasks
- [ ] Training mode entry + idle dummy, infinite time/ki options
- [ ] Dummy behaviors: block all / block after first / counter / CPU level
- [ ] Input display + frame advantage hint (uses the intent system)
- [ ] Unique ultimate cinematic per character (currently all share one beam)
- [ ] Dramatic finish: slow-mo zoom KO when a match ends on ultimate/beam
**Done when:** you can practice any mechanic from the move list against a dummy.

## Phase 4 — Arcade ladder & progression
**Goal:** a reason to keep playing solo.
**Rough time:** 6–8 sessions (~2 months at current pace)
### Tasks
- [ ] Ladder: fight the roster in sequence, difficulty ramp, per-character ending screen
- [ ] Player profile: wins/losses, favorite fighter, totals (localStorage)
- [ ] Unlockables: alt color palettes earned by clearing the ladder
- [ ] Challenge missions (e.g., "win without guarding") with completion tracking
**Done when:** clearing the ladder with one character unlocks something visible.

## Phase 5 — Content expansion
**Goal:** grow the roster/world using the data-driven pipeline.
**Rough time:** 4–6 sessions
### Tasks
- [ ] Fighter 5 — brawler archetype (new hair style, sig, beams, ult)
- [ ] Fighter 6 — small/fast archetype
- [ ] 2 new stage palettes
- [ ] Per-character gimmick pass (e.g., mentor gray-health regen)
**Done when:** 6 fighters, 6 stages, each fighter distinct in one sentence.

## Phase 6 — Big pillars (someday, in order of appeal)
**Goal:** the V2 dreams. Only start after 3–5 are done.
**Rough time:** months each — honest estimate at 1 hr/week
### Tasks
- [ ] Gamepad support (transforms 2P versus)
- [ ] Stage transitions (wall smash into a new arena area)
- [ ] Capsule/skill customization + shop currency
- [ ] Story mode (map, branching encounters, unlock characters)
- [~] Online versus (WebRTC) — hardest thing on this list; decide later

## Timeline summary (rough, honest)
| Phase | Focus | Duration | Cumulative |
|---|---|---|---|
| 0 | Core game | done | — |
| 1 | Combat depth | 2–3 sessions left | ~3 weeks |
| 2 | Architecture | done (+2 optional) | — |
| 3 | Training + polish | ~6 weeks | ~2 months |
| 4 | Ladder & progression | ~2 months | ~4 months |
| 5 | Content expansion | ~6 weeks | ~5.5 months |
| 6 | Big pillars | months each | year+ |

Order note: Phase 1 leftovers (deflect, dizzy) can slot into any week you
feel like a small session; they don't block Phase 3.

## Anti-burnout rules
1. One day off per week, without guilt (at 1 hr/week: skipping a week is fine).
2. Celebrate every phase completion — play a few matches, don't build.
3. Weekly accountability: tell a friend what got added, let them play it.
4. When burnout hits (it will): take a full week off. The handoff files hold everything.
5. If a task feels impossible, break it smaller. If still impossible, ask Claude in a fresh conversation.

*Last updated: 2026-07-07*
