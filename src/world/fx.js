/* World-space effect entities: particles, afterimage ghosts,
   floating damage numbers. Spawners + per-frame updates (no drawing). */
import {game} from '../core/state.js';
import {rand,TAU} from '../core/math.js';
import {clonePose} from '../data/poses.js';

export function addPart(x,y,vx,vy,life,c,r,grav,lighter){
  game.parts.push({x,y,vx,vy,life,max:life,c,r,grav:grav||0,lighter:!!lighter});
}

export function sparks(x,y,c,n,spd){
  for(let i=0;i<n;i++){
    const a=rand(0,TAU),s=rand(2,spd||9);
    addPart(x,y,Math.cos(a)*s,Math.sin(a)*s,rand(10,22),c,rand(2,5),0.25,true);
  }
}

export function burst(x,y,c,n){
  for(let i=0;i<n;i++){
    const a=rand(0,TAU),s=rand(3,14);
    addPart(x,y,Math.cos(a)*s,Math.sin(a)*s,rand(15,35),c,rand(3,8),0.1,true);
  }
}

export function dust(x,n){
  for(let i=0;i<n;i++)
    addPart(x+rand(-20,20),0,rand(-3,3),rand(-4,-1),rand(15,30),'#c8b088',rand(3,7),0.15,false);
}

export function updateParticles(){
  for(let i=game.parts.length-1;i>=0;i--){
    const p=game.parts[i];
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.grav;p.life--;
    if(p.life<=0)game.parts.splice(i,1);
  }
}

export function addGhost(f,tint){
  game.ghosts.push({x:f.x,y:f.y,face:f.face,scl:f.scl,form:f.form,char:f.char,
    state:'idle',pose:clonePose(f.pose),t:0,tint,frame:f.frame,flashT:0,sidestepT:0,invuln:0});
}

export function updateGhosts(){
  for(let i=game.ghosts.length-1;i>=0;i--){
    game.ghosts[i].t++;
    if(game.ghosts[i].t>13)game.ghosts.splice(i,1);
  }
}

export function updateDmgTexts(){
  for(let i=game.dmgTexts.length-1;i>=0;i--){
    if(++game.dmgTexts[i].t>50)game.dmgTexts.splice(i,1);
  }
}
