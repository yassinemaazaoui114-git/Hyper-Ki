/* Camera: follow/zoom logic, screen shake, and the world transform. */
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {clamp,rand} from '../core/math.js';
import {ctx,W,H} from '../core/canvas.js';

export function shake(n){
  if(!SETTINGS.shake)return;
  game.cam.shake=Math.max(game.cam.shake,n);
}

export function updateCam(){
  const p1=game.p1,p2=game.p2;
  const mx=(p1.x+p2.x)/2;
  const d=Math.abs(p1.x-p2.x);
  const ty=Math.max(p1.y,p2.y);
  const tz=clamp(620/(d+420),0.55,1.0);
  game.cam.z+=(tz-game.cam.z)*0.08;
  game.cam.x+=(clamp(mx,-720,720)-game.cam.x)*0.1;
  game.cam.y+=(ty*0.35-game.cam.y)*0.08;
}

export function worldBegin(){
  const c=game.cam;
  ctx.save();
  const sx=rand(-1,1)*c.shake,sy=rand(-1,1)*c.shake;
  ctx.translate(W/2+sx,H*0.8+sy+c.y*c.z);
  ctx.scale(c.z,c.z);
  ctx.translate(-c.x,0);
}

export function worldEnd(){ctx.restore();}
