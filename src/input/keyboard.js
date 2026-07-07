/* Raw keyboard layer: held/pressed maps, rebind capture hook.
   Audio unlock is injected (browsers require a user gesture). */
import {KEYMAP} from '../services/bindings.js';
import {game} from '../core/state.js';

export const keys={},pressed={};

let captureKey=null;
let ensureAudio=()=>{};

export function setEnsureAudio(fn){ensureAudio=fn;}

/** Controls screen sets this to grab the next physical key. */
export function setCaptureKey(fn){captureKey=fn;}

export function clearPressed(){for(const k in pressed)pressed[k]=false;}

export function initKeyboard(){
  addEventListener('keydown',e=>{
    ensureAudio();
    if(captureKey){
      e.preventDefault();
      if(e.key!=='Escape'&&e.key!=='Enter')
        captureKey(e.key.length===1?e.key.toLowerCase():e.key);
      captureKey=null;game.rbWait=false;
      return;
    }
    const k=KEYMAP[e.key]||KEYMAP[e.key.toLowerCase()];
    if(!k)return;
    e.preventDefault();
    if(!keys[k])pressed[k]=true;
    keys[k]=true;
  });
  addEventListener('keyup',e=>{
    const k=KEYMAP[e.key]||KEYMAP[e.key.toLowerCase()];
    if(!k)return;
    keys[k]=false;
  });
}
