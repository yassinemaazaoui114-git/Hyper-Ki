/* Translates raw key state into a per-frame fighter intent.
   The fighter simulation only ever sees intents — the AI produces the
   same shape, which is what makes 1P/2P/CPU interchangeable. */
import {keys,pressed} from './keyboard.js';
import {game} from '../core/state.js';

export function humanIntent(f,S){
  S=S||'';
  const K=n=>!!keys[n+S],P=n=>!!pressed[n+S];
  const it=f.intent={};
  it.left=K('left');it.right=K('right');
  it.up=P('up');it.down=P('down');it.downHeld=K('down');
  it.guard=K('guard');it.guardP=P('guard');
  it.charge=K('charge');it.blast=K('blast');it.blastP=P('blast');
  it.transformP=P('transform');it.ultP=P('ult');
  if(P('punch')&&K('guard')){
    it.throwP=true; // guard held + punch = throw / guard break
  }else{
    if(P('punch'))f.lastPunch=game.frame;
    if(P('kick'))f.lastKick=game.frame;
    if(game.frame-f.lastPunch<=5&&game.frame-f.lastKick<=5){
      it.hyperP=true;f.lastPunch=-99;f.lastKick=-99;
    }else{
      it.punchP=P('punch');it.kickP=P('kick');
    }
  }
  it.punchH=K('punch');it.kickH=K('kick');
  if(P('left')){if(game.frame-f.tapL<14)it.dash=-1;f.tapL=game.frame;}
  if(P('right')){if(game.frame-f.tapR<14)it.dash=1;f.tapR=game.frame;}
}
