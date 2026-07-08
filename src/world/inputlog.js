/* Training input recorder: builds a short history of P1's inputs
   (direction + newly-pressed buttons) for the on-screen input display. */
import {game} from '../core/state.js';
import {keys,pressed} from '../input/keyboard.js';

function dirCode(){
  const h=keys.right?1:keys.left?-1:0;
  const v=keys.up?-1:keys.down?1:0;
  return h+','+v;
}

export function recordInput(){
  const dc=dirCode();
  const btns=[];
  if(pressed.punch)btns.push('P');
  if(pressed.kick)btns.push('K');
  if(pressed.blast)btns.push('B');
  if(pressed.guard)btns.push('G');
  if(pressed.charge)btns.push('C');
  if(pressed.transform)btns.push('T');
  if(pressed.ult)btns.push('U');
  const log=game.inputLog;
  for(const e of log)e.t++;
  const last=log[0];
  if(btns.length>0)log.unshift({dc,btns,t:0});
  else if(!last||last.dc!==dc)log.unshift({dc,btns:[],t:0});
  while(log.length>10)log.pop();
  while(log.length>1&&log[log.length-1].t>240)log.pop();
}
