/* Per-frame fighter simulation: physics, timers, and the state machine.
   Consumes the fighter's intent (human or AI) — never reads keys directly. */
import {game} from '../core/state.js';
import {clamp,rand,dist} from '../core/math.js';
import {updatePose} from './animation.js';
import {auraColor} from './fighter.js';
import {addPart,dust,sparks} from './fx.js';
import {shake} from './camera.js';
import {SFX,startChargeHum,stopChargeHum} from '../services/audio.js';
import {startAttack,attackStep,doVanish,doPursuit,enterHyper,doTransform,
        startRushDash,fireBlast,fireBeam,fireSig} from './combat.js';
import {beginRush} from '../minigames/rush.js';
import {startUlt} from '../minigames/ultimate.js';

export function updateFighter(f,o){
  f.frame++;f.animT++;
  const it=f.intent;
  if(f.invuln>0)f.invuln--;
  if(f.flashT>0)f.flashT--;
  if(f.canPursue>0)f.canPursue--;
  if(f.sidestepT>0)f.sidestepT--;
  if(f.vanishW>0)f.vanishW--;
  if(f.blockstun>0)f.blockstun--;
  if(f.dizzyImmune>0)f.dizzyImmune--;
  // stun meter cools off once you're left alone
  if(f.dizzyMeter>0&&game.frame-f.lastHitFrame>40)
    f.dizzyMeter=Math.max(0,f.dizzyMeter-1.2);
  if(f.state!=='charge'&&f.chargeOsc)stopChargeHum(f);

  // physics
  f.x+=f.vx;f.y+=f.vy;
  if(f.y>0)f.vy-=0.85;
  if(f.y<=0&&f.vy<0){
    const impact=-f.vy;
    f.y=0;f.vy=0;
    if(f.state==='launched'){
      if(f.smashed&&impact>13){
        f.vy=10;f.y=0.01;f.smashed=false;SFX.heavy();shake(8);dust(f.x,10);
      }else{
        f.state='down';f.downT=42;dust(f.x,8);
      }
    }else if(f.state==='jump')f.state='idle';
  }
  if(f.y<=0&&f.state!=='dash'&&f.state!=='rushdash')f.vx*=0.78;
  // walls
  if(f.x<-1080){f.x=-1080;if(f.vx<-9){f.vx=6;SFX.heavy();shake(6);sparks(f.x,-(f.y+90),'#fff',8,8);}else f.vx=Math.max(f.vx,0);}
  if(f.x>1080){f.x=1080;if(f.vx>9){f.vx=-6;SFX.heavy();shake(6);sparks(f.x,-(f.y+90),'#fff',8,8);}else f.vx=Math.min(f.vx,0);}
  // facing
  if(f.y<=0&&(f.state==='idle'||f.state==='walk'))f.face=o.x>=f.x?1:-1;

  // gray health regen (within current bar)
  if(f.gray>0&&game.frame-f.lastHitFrame>110&&f.hp>0){
    const seg=f.maxhp/3;
    const ceil=Math.min(f.maxhp,Math.ceil(f.hp/seg)*seg);
    const r=Math.min(0.7,f.gray,ceil-f.hp);
    if(r>0){f.hp+=r;f.gray-=r;}else f.gray=0;
  }
  // ki passive regen toward baseline 2
  if(!f.hyper&&f.state!=='charge'&&f.ki<2)f.ki=Math.min(2,f.ki+0.004);
  // hyper drain
  if(f.hyper){f.ki-=0.012;if(f.ki<=0){f.ki=0;f.hyper=false;}}
  // final form drain
  if(f.form===f.char.forms.length-1&&f.form>0){
    f.ki-=0.006;
    if(f.ki<=0){f.ki=0;f.form--;}
  }
  f.ki=clamp(f.ki,0,7);
  if(it.guardP)f.lastGuardPress=game.frame;

  // ambient aura particles
  if((f.hyper||f.form===f.char.forms.length-1&&f.form>0)&&f.frame%3===0)
    addPart(f.x+rand(-24,24),-(f.y+rand(0,140)),rand(-0.5,0.5),rand(-4,-2),rand(8,18),auraColor(f),rand(2,5),0,true);

  switch(f.state){
    case 'down':
      f.downT--;
      if(f.downT<=0){f.state='idle';f.invuln=25;}
      updatePose(f);return;
    case 'hurt':
      f.stunT--;
      if(f.stunT<=0)f.state='idle';
      updatePose(f);return;
    case 'dizzy':
      f.dizzyT--;
      // mash to shake it off faster
      if(it.punchP||it.kickP||it.guardP||it.blastP||it.up||it.down)f.dizzyT-=6;
      // stars circling the head
      if(f.frame%5===0)
        addPart(f.x+rand(-26,26),-(f.y+182*f.scl)+rand(-8,8),rand(-1,1),rand(-1,0),18,'#ffd24a',rand(2,4),0,true);
      if(f.dizzyT<=0)f.state='idle';
      updatePose(f);return;
    case 'launched':{
      const vc=1+0.5*game.vanishChain;
      if(f.vanishW>0&&it.guardP&&f.ki>=vc&&f.vanishFrom){
        doVanish(f,f.vanishFrom);
      }
      updatePose(f);return;
    }
    case 'sidestep':
      if(f.sidestepT<=0)f.state='idle';
      updatePose(f);return;
    case 'transforming':
      f.transformT--;
      if(f.frame%2===0)addPart(f.x+rand(-30,30),-(f.y+rand(0,160)),0,rand(-6,-3),12,auraColor(f),rand(3,6),0,true);
      if(f.transformT<=0)f.state='idle';
      updatePose(f);return;
    case 'attack':attackStep(f,o);updatePose(f);return;
    case 'beamCharge':{
      f.atkT++;
      if(f.frame%2===0)addPart(f.x+f.face*50+rand(-8,8),-(f.y+95*f.scl)+rand(-8,8),0,0,8,f.char.beams[f.beamType].c,rand(3,7),0,true);
      const cost=f.beamType?4:3;
      if(!it.blast||f.atkT>55){
        if(f.ki>=cost){fireBeam(f);f.state='beamFire';f.atkT=0;}
        else f.state='idle';
      }
      updatePose(f);return;
    }
    case 'beamFire':
      f.atkT++;
      if(f.atkT>45)f.state='idle';
      updatePose(f);return;
    case 'sigCharge':{
      f.atkT++;
      if(f.frame%2===0)addPart(f.x+f.face*46+rand(-6,6),-(f.y+95*f.scl)+rand(-8,8),0,0,8,f.char.sig.c,rand(2,6),0,true);
      if(!it.blast||f.atkT>45){
        if(f.ki>=1)fireSig(f);
        f.state='beamFire';f.atkT=24;
      }
      updatePose(f);return;
    }
    case 'charge':
      if((it.punchP||it.kickP)&&f.y<=0){
        f.heavyBtn=it.punchP?'punch':'kick';
        f.state='heavyWind';f.atkT=0;f.vx=0;
        updatePose(f);return;
      }
      if(it.charge&&f.y<=0){
        f.ki=Math.min(7,f.ki+0.038);
        if(f.chargeOsc)f.chargeOsc.o.frequency.value=55+f.ki*18;
        if(f.frame%2===0)addPart(f.x+rand(-34,34),-(f.y+rand(0,150)),rand(-1,1),rand(-6,-3),rand(8,16),auraColor(f),rand(2,6),0,true);
      }else f.state='idle';
      updatePose(f);return;
    case 'heavyWind':{
      f.atkT++;
      if(f.frame%2===0)addPart(f.x+f.face*rand(20,55),-(f.y+rand(70,140)),-f.face*rand(1,3),rand(-1,1),rand(6,12),auraColor(f),rand(2,5),0,true);
      if(f.atkT===44)f.flashT=4; // full charge flash
      if(it.guardP){f.state='idle';updatePose(f);return;} // abort
      const held=f.heavyBtn==='punch'?it.punchH:it.kickH;
      if(!held||f.atkT>=45){
        f.heavyPow=Math.min(1,f.atkT/45);
        startAttack(f,'heavy');
      }
      updatePose(f);return;
    }
    case 'block':
      if(it.throwP){startAttack(f,'throw');updatePose(f);return;}
      if(!(it.guard&&f.y<=0))f.state='idle';
      updatePose(f);return;
    case 'dash':
      f.dashT--;
      f.vx=f.dashDir*13*f.char.spd;
      if(f.frame%3===0)addGhostFor(f);
      if(it.punchP||it.kickP){startAttack(f,'p3');f.vx*=0.5;}
      else if(f.dashT<=0){f.state='idle';f.vx*=0.4;}
      updatePose(f);return;
    case 'rushdash':{
      f.rushT--;
      f.vx=f.face*24;
      if(f.frame%2===0)addGhostFor(f,'#ff5030');
      const d=dist(f,o);
      if(d<100&&o.sidestepT<=6&&o.invuln<=0&&o.state!=='down'){
        f.vx=0;beginRush(f,o);return;
      }
      if(f.rushT<=0){f.state='idle';f.vx*=0.3;}
      updatePose(f);return;
    }
  }

  // ---- free states: idle / walk / jump
  const airborne=f.y>0;
  if(!airborne){
    if(it.hyperP){
      if(f.hyper){if(dist(f,o)<520)startRushDash(f,o);}
      else if(f.ki>=3)enterHyper(f);
      updatePose(f);return;
    }
    if(it.ultP&&f.hyper&&f.ki>=5){startUlt(f,o);return;}
    if(it.transformP){
      if(f.hyper&&f.ki>=5){startUlt(f,o);return;}
      if(!f.hyper&&f.form<f.char.forms.length-1&&f.ki>=5){doTransform(f);return;}
    }
    if(it.throwP){startAttack(f,'throw');updatePose(f);return;}
    if(it.guard){f.state='block';updatePose(f);return;}
    if(it.charge){f.state='charge';startChargeHum(f);updatePose(f);return;}
    if(it.down){f.state='sidestep';f.sidestepT=26;SFX.swing();updatePose(f);return;}
  }
  if(f.canPursue>0&&it.punchP&&o.state==='launched'){doPursuit(f,o);updatePose(f);return;}
  if(it.punchP||it.kickP){
    const toward=(o.x>=f.x)?it.right:it.left;
    if(airborne)startAttack(f,'air');
    else if(it.kickP&&toward)startAttack(f,'launcher');
    else if(it.punchP)startAttack(f,'p1');
    else startAttack(f,'k1');
    updatePose(f);return;
  }
  // signature wave: toward + blast (hold to charge, costs 1 ki)
  if(it.blastP&&!airborne&&f.ki>=1&&((o.x>=f.x)?it.right:it.left)){
    f.state='sigCharge';f.atkT=0;f.blastHold=0;
    updatePose(f);return;
  }
  // ki blast / beam charge
  if(it.blast){
    f.blastHold++;
    if(f.blastHold===18&&!airborne){
      const type=it.downHeld?1:0;
      const cost=type?4:3;
      if(f.ki>=cost){f.state='beamCharge';f.atkT=0;f.beamType=type;}
    }
  }else{
    if(f.blastHold>0&&f.blastHold<18)fireBlast(f);
    f.blastHold=0;
  }
  if(!airborne&&it.up){f.vy=17;f.y=0.01;f.state='jump';}
  if(!airborne){
    if(it.dash){f.state='dash';f.dashT=16;f.dashDir=it.dash;SFX.swing();}
    else if(it.left||it.right){f.state='walk';f.vx=(it.right?1:-1)*4.4*f.char.spd;}
    else if(f.state==='walk')f.state='idle';
  }
  updatePose(f);
}

/* Local ghost helper (fx.addGhost with an aura default). */
import {addGhost} from './fx.js';
function addGhostFor(f,tint){addGhost(f,tint||auraColor(f));}
