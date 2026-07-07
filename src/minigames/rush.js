/* Dragon Rush: cinematic 3-round simultaneous-pick chase.
   Attacker continues on a mismatch; the defender escapes on a match. */
import {game,setAnn,setCallout} from '../core/state.js';
import {clamp,rand} from '../core/math.js';
import {pressed} from '../input/keyboard.js';
import {atkMult,defMult} from '../world/fighter.js';
import {damage,checkKO} from '../world/combat.js';
import {addGhost} from '../world/fx.js';
import {shake} from '../world/camera.js';
import {SFX} from '../services/audio.js';

export function beginRush(att,def){
  game.state='rush';
  game.rush={att,def,round:0,phase:'pick',t:0,pa:-1,pd:-1,pickA:-1,pickD:-1,escaped:false};
  att.state='idle';def.state='hurt';def.stunT=0;
  SFX.rush();setAnn('DRAGON RUSH!',45,'#ff5030');
}

export function rushPickInput(f,key){
  const r=game.rush;
  if(r[key]>=0)return;
  if(f.isCPU){
    if(r.t>=30)r[key]=Math.floor(rand(0,3));
    return;
  }
  const S=f===game.p1?'':'2';
  if(pressed['left'+S]){r[key]=0;SFX.select();}
  else if(pressed['up'+S]){r[key]=1;SFX.select();}
  else if(pressed['right'+S]){r[key]=2;SFX.select();}
}

export function stepRush(){
  const r=game.rush;r.t++;
  if(r.phase==='pick'){
    rushPickInput(r.att,'pickA');
    rushPickInput(r.def,'pickD');
    if(r.t>=60){
      if(r.pickA<0)r.pickA=Math.floor(rand(0,3));
      if(r.pickD<0)r.pickD=Math.floor(rand(0,3));
      r.pa=r.pickA;r.pd=r.pickD;
      r.phase='result';r.t=0;
    }
  }else{
    if(r.t===10){
      if(r.pa===r.pd){r.escaped=true;SFX.tp();}
      else{
        SFX.heavy();shake(9);game.flash=3;
        const dmg=(r.round<2?55:120)*atkMult(r.att)/defMult(r.def);
        damage(r.def,dmg,{gray:0.15});
        r.def.flashT=8;
      }
    }
    if(r.t>=45){
      if(r.escaped)endRush(true);
      else{
        r.round++;
        if(r.round>=3||r.def.hp<=0)endRush(false);
        else{r.phase='pick';r.t=0;r.pa=-1;r.pd=-1;r.pickA=-1;r.pickD=-1;r.escaped=false;}
      }
    }
  }
}

export function endRush(escaped){
  const r=game.rush;
  game.rush=null;game.state='fight';
  r.att.y=0;r.att.vy=0;r.att.state='idle';
  if(escaped){
    r.def.x=clamp(r.att.x-r.att.face*380,-1080,1080);
    r.def.y=0;r.def.vy=0;r.def.state='idle';r.def.invuln=24;
    addGhost(r.def,'#bfefff');
    setCallout('ESCAPED!','#9fe8ff');
  }else{
    r.def.x=clamp(r.att.x+r.att.face*180,-1080,1080);
    r.def.y=150;r.def.vy=-18;
    r.def.state='launched';r.def.smashed=true;
    r.def.vx=r.att.face*6;
    shake(10);
  }
  if(r.def.hp<=0)checkKO(r.def);
}
