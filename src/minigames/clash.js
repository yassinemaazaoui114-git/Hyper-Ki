/* Beam clash: the mash tug-of-war when two beams collide. */
import {game,setAnn} from '../core/state.js';
import {clamp,lerp} from '../core/math.js';
import {DIFF} from '../data/modes.js';
import {pressed} from '../input/keyboard.js';
import {atkMult,defMult} from '../world/fighter.js';
import {damage,checkKO} from '../world/combat.js';
import {sparks,burst} from '../world/fx.js';
import {shake} from '../world/camera.js';
import {SFX} from '../services/audio.js';

export function startClash(a,b){
  const p1=game.p1,p2=game.p2;
  // orient so clash.a is always P1's beam
  const pa=a.owner===p1?a:b, pb=pa===a?b:a;
  game.clash={a:pa,b:pb,meter:0.5,t:0};
  pa.state='clash';pb.state='clash';
  p1.state='beamFire';p1.atkT=0;p2.state='beamFire';p2.atkT=0;
  game.state='clash';
  setAnn('BEAM CLASH!',50,'#ffd24a');SFX.announce();SFX.beam();
}

export function stepClash(){
  const p1=game.p1,p2=game.p2;
  const c=game.clash;c.t++;
  if(pressed.punch)c.meter+=0.06;
  if(game.mode==='2p'){if(pressed.punch2)c.meter-=0.06;}
  else c.meter-=DIFF[game.diff].mash;
  c.meter=clamp(c.meter,0,1);
  shake(2);
  const jx=clashJunction();
  if(game.frame%2===0)sparks(jx,-(c.a.h+c.b.h)/2,Math.random()<0.5?c.a.color:c.b.color,3,10);
  if(c.meter>=1||c.meter<=0||c.t>240){
    const p1Wins=c.meter>=0.5;
    const winner=p1Wins?p1:p2,loser=p1Wins?p2:p1;
    damage(loser,150*atkMult(winner)/defMult(loser),{gray:0.1});
    loser.state='launched';loser.smashed=false;
    loser.vy=13;loser.y=Math.max(loser.y,0.01);
    loser.vx=(winner.x<loser.x?1:-1)*12;
    loser.flashT=10;
    burst(loser.x,-(loser.y+100),p1Wins?c.a.color:c.b.color,40);
    SFX.heavy();SFX.ko();shake(14);game.flash=7;
    game.beams.length=0;game.clash=null;
    game.state='fight';
    p1.state='idle';p2.state='idle';
    game.bigHit=true;
    checkKO(loser);
  }
}

export function clashJunction(){
  const p1=game.p1,p2=game.p2;
  const c=game.clash;
  const xL=(p1.x<p2.x?p1:p2).x+70;
  const xR=(p1.x<p2.x?p2:p1).x-70;
  const p1Left=p1.x<p2.x;
  return p1Left?lerp(xL,xR,c.meter):lerp(xR,xL,c.meter);
}
