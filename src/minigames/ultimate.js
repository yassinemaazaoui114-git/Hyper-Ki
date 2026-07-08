/* Ultimate attack: 3-round arrow duel (options shrink 4→3→2),
   then the cinematic finisher on success; partial ki drain on a block. */
import {game,setCallout} from '../core/state.js';
import {clamp,rand} from '../core/math.js';
import {pressed} from '../input/keyboard.js';
import {atkMult,defMult,auraColor} from '../world/fighter.js';
import {damage,checkKO} from '../world/combat.js';
import {shake} from '../world/camera.js';
import {SFX} from '../services/audio.js';
import {recordUltimate} from '../services/profile.js';

export const ROUND_OPTS=[['left','up','right','down'],['left','up','right'],['left','right']];

export function startUlt(f,o){
  game.state='ult';
  game.ult={att:f,def:o,phase:'round',round:0,t:0,pickA:-1,pickD:-1,failed:false};
  f.state='idle';f.vx=0;o.vx=0;
  SFX.ult();setCallout(f.char.ult+'!',auraColor(f));
}

export function ultPickInput(f,key){
  const u=game.ult;
  if(u[key]>=0)return;
  const opts=ROUND_OPTS[u.round];
  if(f.isCPU){
    if(u.t>=30)u[key]=Math.floor(rand(0,opts.length));
    return;
  }
  const S=f===game.p1?'':'2';
  for(let i=0;i<opts.length;i++){
    if(pressed[opts[i]+S]){u[key]=i;SFX.select();break;}
  }
}

export function stepUlt(){
  const u=game.ult;u.t++;
  if(u.phase==='round'){
    ultPickInput(u.att,'pickA');
    ultPickInput(u.def,'pickD');
    if(u.t>=60){
      const opts=ROUND_OPTS[u.round];
      if(u.pickA<0)u.pickA=Math.floor(rand(0,opts.length));
      if(u.pickD<0)u.pickD=Math.floor(rand(0,opts.length));
      u.phase='reveal';u.t=0;
    }
  }else if(u.phase==='reveal'){
    if(u.t===8){
      if(u.pickA===u.pickD){u.failed=true;SFX.guard();}
      else{SFX.rush();shake(5);}
    }
    if(u.t>=40){
      if(u.failed){
        // defender matched: ultimate cancels, attacker's ki partially drained
        u.att.ki=Math.max(0,u.att.ki-3);
        setCallout('ULTIMATE BLOCKED!','#8fd4ff');
        game.ult=null;game.state='fight';
        return;
      }
      u.round++;
      if(u.round>=3){u.phase='charge';u.t=0;SFX.ult();}
      else{u.phase='round';u.t=0;u.pickA=-1;u.pickD=-1;}
    }
  }else if(u.phase==='charge'){
    shake(3);
    if(u.t>=60){u.phase='fire';u.t=0;SFX.ult();SFX.beam();}
  }else{ // fire
    shake(u.t<40?14:5);
    if(u.t===30){
      const dmg=300*atkMult(u.att)/defMult(u.def);
      damage(u.def,dmg,{gray:0});
      u.def.flashT=12;
      game.flash=9;SFX.ko();
      if(!u.att.isCPU&&game.mode!=='train')recordUltimate();
    }
    if(u.t>=110){
      const u2=game.ult;game.ult=null;
      u2.att.ki=0;u2.att.hyper=false;
      game.state='fight';
      u2.def.state='launched';u2.def.smashed=false;
      u2.def.vy=13;u2.def.y=Math.max(u2.def.y,0.01);
      u2.def.x=clamp(u2.att.x+u2.att.face*300,-1080,1080);
      u2.def.vx=u2.att.face*10;
      game.bigHit=true;
      checkKO(u2.def);
    }
  }
}
