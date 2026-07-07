/* Key binding registry: action definitions, per-player binds,
   the derived key→action map, persistence, and rebinding rules. */
import {SFX} from './audio.js';

export const ACTIONS=[['left','MOVE LEFT'],['right','MOVE RIGHT'],['up','JUMP'],['down','SIDESTEP'],
 ['punch','PUNCH'],['kick','KICK'],['blast','KI BLAST / BEAM'],['charge','CHARGE KI'],
 ['guard','GUARD'],['transform','TRANSFORM'],['ult','ULTIMATE']];

export const DEFAULT_BINDS={
 p1:{left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',
     punch:'a',kick:'s',blast:'d',charge:'q',guard:'w',transform:'e',ult:'r'},
 p2:{left:'j',right:'l',up:'i',down:'k',
     punch:'u',kick:'o',blast:'p',charge:'m',guard:'n',transform:'h',ult:'y'},
};

export let BINDS=JSON.parse(JSON.stringify(DEFAULT_BINDS));
try{
  const b=JSON.parse(localStorage.getItem('hkl_binds')||'null');
  if(b&&b.p1&&b.p2)
    for(const s of ['p1','p2'])
      for(const a in DEFAULT_BINDS[s])
        if(typeof b[s][a]==='string')BINDS[s][a]=b[s][a];
}catch(e){}

export function saveBinds(){
  try{localStorage.setItem('hkl_binds',JSON.stringify(BINDS));}catch(e){}
}

/* Derived lookup: physical key -> action ('' suffix = P1, '2' = P2). */
export let KEYMAP={};
export function rebuildKeymap(){
  KEYMAP={Enter:'start',Escape:'back'};
  for(const a in BINDS.p1)KEYMAP[BINDS.p1[a]]=a;
  for(const a in BINDS.p2)KEYMAP[BINDS.p2[a]]=a+'2';
}
rebuildKeymap();

export function keyLabel(k){
  const M={ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',' ':'SPACE',
    Shift:'SHIFT',Control:'CTRL',Alt:'ALT',Tab:'TAB',Backspace:'BKSP',CapsLock:'CAPS'};
  return M[k]||k.toUpperCase();
}

/** Rebind action; if the key is used elsewhere the two bindings swap
    so no action is ever left unbound. */
export function assignBind(side,act,key){
  for(const s of ['p1','p2'])
    for(const a in BINDS[s])
      if(BINDS[s][a]===key&&!(s===side&&a===act))BINDS[s][a]=BINDS[side][act];
  BINDS[side][act]=key;
  rebuildKeymap();saveBinds();SFX.confirm();
}

export function resetBinds(){
  BINDS=JSON.parse(JSON.stringify(DEFAULT_BINDS));
  rebuildKeymap();saveBinds();SFX.confirm();
}
