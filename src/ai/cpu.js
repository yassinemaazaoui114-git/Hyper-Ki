/* CPU opponent: plan-based controller that emits fighter intents.
   Produces the same intent shape as human input, so the simulation
   never knows (or cares) who is driving a fighter. */
import {game} from '../core/state.js';
import {rand,dist} from '../core/math.js';
import {DIFF} from '../data/modes.js';
import {ATK} from '../data/attacks.js';

export function aiUpdate(f,o){
  const D=DIFF[game.diff];
  const it=f.intent={};
  const d=dist(f,o);
  // reactions to attacks
  if(o.state==='attack'&&d<150&&Math.random()<D.react*0.4){
    if(f.ki>=2&&Math.random()<D.tp){it.guardP=true;it.guard=true;}
    else if(Math.random()<D.block)f.aiGuard=18;
  }
  if(f.aiGuard>0){f.aiGuard--;it.guard=true;}
  // react to incoming beams: sidestep or counter-beam
  for(const b of game.beams){
    if(b.owner!==f&&b.state==='fly'&&Math.random()<D.react*0.12){
      if(f.ki>=3&&d>420&&Math.random()<0.5){f.aiPlan='beam';f.aiT=40;}
      else it.down=true;
    }
  }
  if(f.canPursue>0&&o.state==='launched')it.punchP=true;
  // vanish out of heavy knockback
  if(f.vanishW>0&&f.ki>=1+0.5*game.vanishChain&&Math.random()<[0.04,0.09,0.16][game.diff])it.guardP=true;
  // mash out of dizzy
  if(f.state==='dizzy'&&Math.random()<[0.10,0.22,0.38][game.diff])it.punchP=true;
  // opponent is dizzy: free punish — wind up a guard-crushing heavy
  if(o.state==='dizzy'&&f.state!=='attack'&&f.state!=='heavyWind'){
    f.aiPlan=d<260?'heavy':'approach';f.aiT=30;
  }
  f.aiT--;
  if(f.aiT<=0){
    f.aiT=20+rand(0,25);
    const r=Math.random();
    if(f.ki<2.5&&d>420&&r<0.55)f.aiPlan='charge';
    else if(!f.hyper&&f.ki>=5.5&&f.form<f.char.forms.length-1&&r<0.3)f.aiPlan='transform';
    else if(f.hyper&&f.ki>=5.2&&r<0.6)f.aiPlan='ult';
    else if(f.hyper&&d<440&&r<0.6)f.aiPlan='rush';
    else if(!f.hyper&&f.ki>=5&&r<0.12*D.aggro)f.aiPlan='hyper';
    else if(d<240&&o.state==='block'&&r<0.35)f.aiPlan='heavy';
    else if(d<220&&r<0.08*D.aggro)f.aiPlan='heavy';
    else if(f.ki>=1.5&&d>340&&r<0.32)f.aiPlan='sig';
    else if(f.ki>=3.2&&d>460&&r<0.3)f.aiPlan='beam';
    else if(d>500&&r<0.5)f.aiPlan='blast';
    else if(d>150)f.aiPlan='approach';
    else f.aiPlan=r<D.aggro?'attack':'retreat';
  }
  const dir=o.x>=f.x?1:-1;
  switch(f.aiPlan){
    case 'charge':
      if(d<280)f.aiPlan='attack';
      else it.charge=true;
      break;
    case 'blast':
      if(game.frame%16<3)it.blast=true;
      break;
    case 'beam':
      if(f.state==='beamCharge'&&f.atkT>24)it.blast=false;
      else it.blast=true;
      if(f.ki<3)f.aiPlan='approach';
      break;
    case 'heavy':{
      if(d>320){f.aiPlan='approach';break;}
      if(f.state==='attack'){f.aiPlan='approach';break;}
      if(f.state==='heavyWind'){it.punchH=f.atkT<22;break;} // wind ~1/3s then release
      if(f.state==='charge'){it.charge=true;it.punchP=true;it.punchH=true;break;}
      if(d>150){const dr=o.x>=f.x?1:-1;if(dr===1)it.right=true;else it.left=true;break;}
      it.charge=true;
      break;}
    case 'sig':{
      if(f.state==='beamFire'){f.aiPlan='approach';break;}
      if(f.state==='sigCharge'){it.blast=f.atkT<30;break;}
      if(f.ki<1){f.aiPlan='approach';break;}
      const dir2=o.x>=f.x?1:-1;
      if(dir2===1)it.right=true;else it.left=true;
      it.blastP=true;it.blast=true;
      break;}
    case 'transform':it.transformP=true;f.aiPlan='approach';break;
    case 'hyper':it.hyperP=true;f.aiPlan='approach';break;
    case 'ult':it.transformP=true;break;
    case 'rush':
      if(d>420){if(dir===1)it.right=true;else it.left=true;}
      else it.hyperP=true;
      break;
    case 'retreat':
      if(dir===1)it.left=true;else it.right=true;
      break;
    case 'approach':
      if(dir===1)it.right=true;else it.left=true;
      if(d>460&&f.state!=='dash'&&Math.random()<0.05)it.dash=dir;
      if(d<160)f.aiPlan='attack';
      break;
    case 'attack':
      if(d>130){if(dir===1)it.right=true;else it.left=true;}
      else if(f.state!=='attack'&&game.frame%9===0){
        const r2=Math.random();
        if(o.state==='block'&&o.y<=0&&r2<0.5)it.throwP=true; // crack the turtle
        else if(r2<0.18){it.kickP=true;if(dir===1)it.right=true;else it.left=true;} // launcher
        else if(r2<0.65)it.punchP=true;
        else it.kickP=true;
      }else if(f.state==='attack'&&game.frame%7===0){
        if(f.ki>=1.5&&f.atkT>ATK[f.atk].start+3&&Math.random()<[0.06,0.14,0.25][game.diff])it.guardP=true; // ki cancel
        else if(Math.random()<0.7)it.punchP=true;
      }
      break;
  }
}
