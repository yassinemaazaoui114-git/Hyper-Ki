# Hyper Ki Legends

A from-scratch browser fighting game inspired by the *feel* of the PS2-era
arena fighters I grew up on — rebuilt with **100% original characters, art,
and code**. No engine, no frameworks, no assets: vanilla JavaScript,
Canvas 2D, and Web Audio synthesis in ~35 small ES modules.

**Free forever. Not affiliated with or endorsed by any anime/game publisher;
all fighters, names, and designs are original.**

## Play

ES modules need a local server:

```bash
python -m http.server 8756
# then open http://localhost:8756
```

No server handy? Double-click **`legacy.html`** — a frozen single-file build
that runs from disk.

## Features

- Arcade vs CPU (3 difficulties) and 2-player shared-keyboard versus
- 4 fighters with transformations, signature waves, twin beams, and ultimates
- Deep combat: chains, launchers, pursuit smashes, throws/guard breaks,
  ki cancels, teleport counters, vanish battles, charged heavies (guard crush)
- Beam clash mash duels, Dragon Rush guessing duels, arrow-duel ultimates
- 4 stages, selectable time limits, combo counter + damage numbers
- Full control rebinding (both players), persistent settings, pause move list

## Controls (defaults)

| | P1 | P2 |
|---|---|---|
| Move / jump / sidestep | Arrows | J L I K |
| Punch / kick | A / S | U / O |
| Blast (hold = beam) | D | P |
| Charge ki | Q | M |
| Guard | W | N |
| Transform / Ultimate | E / R | H / Y |

Full move list: pause any match (Enter/Esc) → **Move List**, or
Settings → Controls to view & rebind everything.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) — layered ES-module design
(core → data → services → world → minigames/ai → flow → render → screens),
data-driven content, and an input-intent boundary shared by humans and the CPU.

## License

MIT — see [LICENSE](LICENSE). Free to use, modify, and share.
