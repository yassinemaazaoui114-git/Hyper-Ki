/* Ki blast + signature wave simulation: travel, cancels, collisions. */
import {game,other} from '../core/state.js';
import {rand} from '../core/math.js';
import {defMult} from './fighter.js';
import {damage,checkKO} from './combat.js';
import {sparks,burst,addPart} from './fx.js';
import {shake} from './camera.js';
import {SFX} from '../services/audio.js';

export function updateProjectiles(){
  for(let i=game.projs.length-1;i>=0;i--){
    const p=game.projs[i];
    p.x+=p.vx;
    if(p.sig&&game.frame%2===0)
      addPart(p.x-Math.sign(p.vx)*p.r*1.2,-p.y+rand(-8,8),-Math.sign(p.vx)*rand(1,3),rand(-1,1),rand(8,16),p.c,rand(2,5),0,true);
    let dead=false;
    // projectile vs projectile (signature waves plow through small blasts)
    for(let j=game.projs.length-1;j>i;j--){
      const q=game.projs[j];
      if(q.owner!==p.owner&&Math.abs(q.x-p.x)<(p.r||14)+(q.r||14)&&Math.abs(q.y-p.y)<44){
        sparks((p.x+q.x)/2,-(p.y+q.y)/2,'#fff',8,7);
        if(p.sig&&!q.sig){game.projs.splice(j,1);continue;}
        if(q.sig&&!p.sig){dead=true;break;}
        game.projs.splice(j,1);dead=true;break;
      }
    }
    if(!dead){
      const o=other(p.owner);
      const hitW=p.sig?26+p.r:36;
      if(o.invuln<=0&&o.sidestepT<=6&&o.state!=='down'&&
         Math.abs(p.x-o.x)<hitW&&p.y>o.y+30&&p.y<o.y+165*o.scl){
        if(o.state==='block'&&o.y<=0){
          damage(o,p.sig?p.dmg*0.15/defMult(o):1,{gray:0,chip:1});
          o.vx=Math.sign(p.vx)*(p.sig?8:2);
          if(p.sig)o.blockstun=14;
          sparks(p.x,-p.y,'#6fc8ff',p.sig?12:5,p.sig?10:6);SFX.guard();
        }else{
          damage(o,p.dmg/defMult(o),{gray:p.sig?0.25:0.35});
          o.flashT=p.sig?8:4;o.lastHitFrame=game.frame;
          if(p.sig){
            o.state='hurt';o.stunT=20;o.vx=Math.sign(p.vx)*9;
            shake(6);burst(p.x,-p.y,p.c,18);SFX.heavy();
          }else{
            if(o.state!=='launched'&&o.state!=='attack'){o.state='hurt';o.stunT=9;}
            o.vx=Math.sign(p.vx)*2.5;
            sparks(p.x,-p.y,p.c,8,8);SFX.blastHit();
          }
          checkKO(o);
        }
        dead=true;
      }
    }
    if(dead||p.x<-1160||p.x>1160)game.projs.splice(i,1);
  }
}
