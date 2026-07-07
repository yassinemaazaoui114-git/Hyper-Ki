/* Composition root: wires canvas, input, audio policy, and the loop.
   Also exposes a curated debug/mod hook on window.HKL. */
import {initCanvas} from './core/canvas.js';
import {startLoop} from './core/loop.js';
import {game} from './core/state.js';
import {initKeyboard,setEnsureAudio,keys,pressed} from './input/keyboard.js';
import {initAudio} from './services/audio.js';
import {SETTINGS,applySound} from './services/settings.js';
import {BINDS,KEYMAP,ACTIONS,assignBind,resetBinds,keyLabel} from './services/bindings.js';
import {step,render} from './flow/dispatcher.js';
import {startMatch} from './flow/match.js';
import {CHARS} from './data/characters.js';
import {STAGES} from './data/stages.js';
import {ATK} from './data/attacks.js';
import {DIFF,TIMES} from './data/modes.js';
import {makeFighter} from './world/fighter.js';
import {startAttack,fireBeam,fireSig,enterHyper,doTransform} from './world/combat.js';
import {startUlt,ROUND_OPTS} from './minigames/ultimate.js';
import {beginRush} from './minigames/rush.js';
import {moveRows} from './screens/moveList.js';

initCanvas();
setEnsureAudio(()=>{initAudio();applySound();});
initKeyboard();
applySound();
startLoop(step,render);

/* Debug & mod hook: a deliberate, documented surface for tooling,
   testing, and future mod support — not accidental global leakage. */
window.HKL={
  game,step,render,startMatch,
  keys,pressed,
  SETTINGS,ACTIONS,assignBind,resetBinds,keyLabel,
  get BINDS(){return BINDS;},
  get KEYMAP(){return KEYMAP;},
  CHARS,STAGES,ATK,DIFF,TIMES,ROUND_OPTS,
  makeFighter,startAttack,fireBeam,fireSig,enterHyper,doTransform,startUlt,beginRush,
  moveRows,
};
