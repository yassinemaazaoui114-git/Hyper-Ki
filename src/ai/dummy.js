/* Training-dummy controller. Produces fighter intents like the CPU/human,
   selected by game.dummyBehavior. Reuses the full AI for the CPU option. */
import {game} from '../core/state.js';
import {dist} from '../core/math.js';
import {aiUpdate} from './cpu.js';

export const DUMMY_BEHAVIORS=['STAND','BLOCK ALL','BLOCK 1ST HIT','COUNTER','CPU FIGHTER'];

export function dummyIntent(f,o){
  const b=game.dummyBehavior;
  if(b===4){aiUpdate(f,o);return;} // full sparring CPU
  const it=f.intent={};
  const d=dist(f,o);
  if(b===1){                       // BLOCK ALL — hold guard forever
    it.guard=true;
  }else if(b===2){                 // BLOCK 1ST HIT — take one, then block
    if(game.frame-f.lastHitFrame<90)it.guard=true;
  }else if(b===3){                 // COUNTER — jab back once recovered & close
    if((f.state==='idle'||f.state==='walk')&&d<150&&game.frame-f.dummyCd>34){
      it.punchP=true;f.dummyCd=game.frame;
    }
  }
  // b===0 STAND — empty intent (idle)
}
