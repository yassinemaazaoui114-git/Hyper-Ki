/* Beam simulation: extension, fighter hits, wall impacts,
   and detection of opposing-beam contact (which starts a clash). */
import {game,other} from '../core/state.js';
import {defMult} from './fighter.js';
import {damage,checkKO} from './combat.js';
import {sparks,burst} from './fx.js';
import {shake} from './camera.js';
import {SFX} from '../services/audio.js';
import {startClash} from '../minigames/clash.js';

export function updateBeams(){
  for(let i=game.beams.length-1;i>=0;i--){
    const b=game.beams[i];
    if(b.state==='done'){game.beams.splice(i,1);continue;}
    if(b.state!=='fly')continue;
    b.t++;b.len+=24;
    const tip=b.x+b.dir*b.len;
    // beam vs beam -> clash
    for(const v of game.beams){
      if(v!==b&&v.state==='fly'&&v.owner!==b.owner&&v.dir!==b.dir&&Math.abs(v.h-b.h)<90){
        const vtip=v.x+v.dir*v.len;
        if(b.dir===1?tip>=vtip:tip<=vtip){startClash(b,v);return;}
      }
    }
    // beam vs fighter
    const o=other(b.owner);
    const reach=b.dir===1?tip>=o.x-24:tip<=o.x+24;
    const inFront=b.dir===1?o.x>b.x:o.x<b.x;
    if(reach&&inFront&&o.invuln<=0&&o.sidestepT<=0&&o.state!=='down'&&
       b.h>o.y+15&&b.h<o.y+170*o.scl){
      if(o.state==='block'&&o.y<=0){
        damage(o,b.dmg*0.35/defMult(o),{gray:0,chip:1});
        o.blockstun=18;o.vx=b.dir*12;
        sparks(o.x,-b.h,'#6fc8ff',16,12);SFX.guard();SFX.heavy();
      }else{
        damage(o,b.dmg/defMult(o),{gray:0.2});
        o.state='launched';o.smashed=false;o.vy=11;o.y=Math.max(o.y,0.01);o.vx=b.dir*11;
        o.flashT=8;
        burst(o.x,-b.h,b.color,26);SFX.heavy();
      }
      shake(10);game.flash=Math.max(game.flash,4);
      b.state='done';
      game.bigHit=true;
      checkKO(o);
      continue;
    }
    if(tip>1150||tip<-1150){
      burst(b.dir===1?1150:-1150,-b.h,b.color,16);shake(5);
      b.state='done';
    }
  }
}
