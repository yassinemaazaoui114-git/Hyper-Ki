/* Combat resolution: attacks, hits, damage, and the special actions
   (throws, counters, vanish, hyper, transform, projectile launches).
   Everything here mutates fighters/state; nothing here draws or reads keys. */
import {game,other,setAnn,setCallout} from '../core/state.js';
import {clamp,rand,dist} from '../core/math.js';
import {ATK} from '../data/attacks.js';
import {atkMult,defMult,auraColor} from './fighter.js';
import {addGhost,burst,sparks,addPart} from './fx.js';
import {shake} from './camera.js';
import {SFX,stopChargeHum} from '../services/audio.js';

export function startAttack(f,name){
  f.state='attack';f.atk=name;f.atkT=0;f.atkHit=false;f.chain=null;SFX.swing();
}

export function attackStep(f,o){
  const a=ATK[f.atk],it=f.intent;
  // A+S cancel into hyper during startup
  if(it.hyperP&&f.atkT<=4&&f.y<=0){
    f.state='idle';
    if(f.hyper){if(dist(f,o)<520)startRushDash(f,o);}
    else if(f.ki>=3)enterHyper(f);
    return;
  }
  // KI CANCEL: tap guard past startup to cut recovery (0.5 ki, throws excluded)
  if(it.guardP&&f.atkT>a.start&&!a.thr&&f.ki>=0.5){
    f.ki-=0.5;
    addGhost(f,'#bfefff');
    burst(f.x,-(f.y+100*f.scl),'#9fe8ff',8);
    game.dmgTexts.push({x:f.x,y:-(f.y+175*f.scl),txt:'CANCEL',t:20,big:false,chip:true});
    SFX.cancel();
    f.state=f.y>0?'jump':'idle';
    f.vx*=0.5;
    return;
  }
  f.atkT++;
  const t=f.atkT;
  if(t>a.start&&(it.punchP||it.kickP)&&a.next)f.chain=a.next;
  if(t>a.start&&t<=a.start+a.act){
    f.vx=f.face*(a.lunge||4);
    if(!f.atkHit)tryHit(f,o,a);
  }else if(t>a.start+a.act+a.rec){
    if(f.chain&&f.y<=0)startAttack(f,f.chain);
    else f.state=f.y>0?'jump':'idle';
  }
}

export function tryHit(f,o,a){
  const dx=(o.x-f.x)*f.face,dy=o.y-f.y;
  if(dx<-10||dx>a.rng+40)return;
  if(Math.abs(dy)>(a.smash?110:80))return;
  if(o.invuln>0||o.sidestepT>8||o.state==='down')return;
  if(a.thr){
    // throw: unblockable, but can't grab airborne or already-reeling opponents
    if(o.y>40||o.state==='hurt'||o.state==='launched')return;
    f.atkHit=true;
    const wasBlocking=o.state==='block';
    const dmg=a.dmg*atkMult(f)/defMult(o);
    damage(o,dmg,{gray:0.3});
    o.flashT=8;o.ki=Math.max(0,o.ki-0.5);
    o.state='launched';o.smashed=false;
    o.vy=12;o.y=Math.max(o.y,0.01);o.vx=f.face*a.kb;
    f.ki=Math.min(7,f.ki+dmg*0.010);
    SFX.heavy();shake(8);
    setCallout(wasBlocking?'GUARD BREAK!':'THROW!','#ffb14a');
    burst(o.x,-(o.y+100),'#ffd08a',14);
    checkKO(o);
    return;
  }
  f.atkHit=true;
  const cx=f.x+f.face*a.rng*0.7,cy=-(o.y+110*o.scl);
  // dodge-teleport counter: guard pressed just as the hit lands, costs 2 ki
  // (a dizzy fighter cannot counter — that's the whole point of dizzy)
  if(o.ki>=2&&game.frame-o.lastGuardPress<=9&&o.y<=0&&o.state!=='hurt'&&o.state!=='launched'&&o.state!=='dizzy'){
    o.ki-=2;teleportCounter(o,f);return;
  }
  if(o.state==='block'&&o.y<=0){
    if(a.crush){
      // charged heavy smashes straight through guard
      const pow=f.heavyPow||0;
      damage(o,a.dmg*0.25*atkMult(f)/defMult(o),{gray:0.2});
      o.state='hurt';o.stunT=Math.round(34+16*pow);o.vx=f.face*7;o.flashT=8;
      setCallout('GUARD CRUSH!','#ffb14a');
      burst(cx,cy,'#ffd08a',18);SFX.heavy();shake(9);game.flash=Math.max(game.flash,3);
      checkKO(o);
      return;
    }
    damage(o,a.dmg*0.07*atkMult(f)/defMult(o),{gray:0,chip:1});
    o.blockstun=10;o.vx=f.face*4;f.vx=-f.face*2;
    sparks(cx,cy,'#6fc8ff',6,7);SFX.guard();
    return;
  }
  let dmg=a.dmg*atkMult(f)/defMult(o);
  if(a.crush)dmg*=1+0.6*(f.heavyPow||0);
  damage(o,dmg,{gray:0.35});
  o.flashT=6;
  f.ki=Math.min(7,f.ki+dmg*0.010);
  o.ki=Math.min(7,o.ki+dmg*0.014);
  sparks(cx,cy,'#ffe08a',a.heavy?14:8,a.heavy?12:8);
  if(a.launch){
    o.state='launched';o.smashed=false;o.vy=18;o.y=Math.max(o.y,0.01);o.vx=f.face*3;
    f.canPursue=50;SFX.heavy();shake(6);
  }else if(a.smash){
    o.state='launched';o.smashed=true;o.vy=-22;o.vx=f.face*5;SFX.heavy();shake(8);
  }else if(a.van){
    // heavy knockback: sends them flying and opens their vanish window
    o.state='launched';o.smashed=false;
    o.vy=7;o.y=Math.max(o.y,0.01);o.vx=f.face*15;
    o.vanishW=16;o.vanishFrom=f;
    if(!a.vanish)game.vanishChain=0;
    SFX.heavy();shake(8);game.flash=Math.max(game.flash,3);
  }else{
    if(o.y>0){o.state='launched';o.smashed=false;o.vy=Math.max(o.vy,7);o.vx=f.face*a.kb;}
    else{
      o.state='hurt';o.stunT=a.st;o.vx=f.face*a.kb;
      // long combos overwhelm: grounded hit past the stun threshold = DIZZY
      if(o.dizzyMeter>=150&&o.dizzyImmune<=0)enterDizzy(o);
    }
    if(a.heavy){SFX.heavy();shake(7);game.flash=Math.max(game.flash,3);}
    else SFX.hit();
  }
  checkKO(o);
}

export function enterDizzy(f){
  f.state='dizzy';f.dizzyT=120;f.animT=0;
  f.dizzyMeter=0;f.dizzyImmune=600; // can't be re-dizzied for ~10s
  f.vx=0;f.stunT=0;
  setCallout('DIZZY!','#ffd24a');
  SFX.dizzy();
  burst(f.x,-(f.y+170*f.scl),'#ffd24a',12);
}

export function damage(o,dmg,opt){
  const seg=o.maxhp/3;
  const before=Math.ceil(Math.max(0.001,o.hp)/seg);
  o.hp-=dmg;
  if(o.hp<0)o.hp=0;
  const after=Math.ceil(Math.max(0.001,o.hp)/seg);
  if(after<before){o.gray=0;game.flash=Math.max(game.flash,3);}
  else if(opt&&opt.gray)o.gray=Math.min(o.gray+dmg*opt.gray,140);
  o.lastHitFrame=game.frame;
  const chip=!!(opt&&opt.chip);
  // floating damage number
  if(dmg>=1)game.dmgTexts.push({x:o.x+rand(-14,14),y:-(o.y+150*o.scl)-rand(0,12),
    txt:String(Math.round(dmg)),t:0,big:dmg>=60,chip});
  // combo tracking (1v1: the attacker is always the other fighter)
  if(!chip&&game.p1&&game.p2){
    const att=other(o);
    if(o.state==='hurt'||o.state==='launched'||game.frame-att.comboLast<=22)att.comboHits++;
    else{att.comboHits=1;att.comboDmg=0;}
    att.comboDmg+=dmg;att.comboLast=game.frame;
    // stun meter builds from real damage taken (decays when left alone)
    o.dizzyMeter+=dmg;
  }
}

export function checkKO(loser){
  if(loser.hp>0)return false;
  const w=other(loser);
  game.winner=w;game.koMode='ko';game.state='ko';game.koT=0;
  loser.state='launched';loser.smashed=false;
  loser.vy=Math.max(loser.vy,12);loser.y=Math.max(loser.y,0.01);
  loser.vx=(loser.x<w.x?-1:1)*9;
  setAnn('K.O.!',999,'#ff5030');SFX.ko();shake(14);game.flash=8;
  stopChargeHum(game.p1);stopChargeHum(game.p2);
  return true;
}

export function teleportCounter(d,att){
  addGhost(d,auraColor(d));
  d.x=att.x-att.face*75;
  d.x=clamp(d.x,-1080,1080);
  d.face=att.x>=d.x?1:-1;
  d.invuln=12;d.state='idle';
  SFX.tp();
  setCallout('TELEPORT COUNTER!','#9fe8ff');
  burst(d.x,-(d.y+100),'#bfefff',10);
}

export function doVanish(d,att){
  const cost=1+0.5*game.vanishChain;
  d.ki-=cost;game.vanishChain++;
  addGhost(d,'#bfefff');addGhost(d,auraColor(d));
  d.x=clamp(att.x-att.face*72,-1080,1080);
  d.y=0;d.vy=0;d.vx=0;d.smashed=false;d.vanishW=0;
  d.face=att.x>=d.x?1:-1;
  d.invuln=10;
  startAttack(d,'vanish');
  game.vanishFxT=14;
  SFX.tp();SFX.rush();shake(5);
  setCallout(game.vanishChain>1?'VANISH ×'+game.vanishChain+'!':'VANISH!','#9fe8ff');
}

export function doPursuit(f,o){
  addGhost(f,auraColor(f));
  f.canPursue=0;
  f.x=clamp(o.x-f.face*30,-1080,1080);
  f.y=o.y+70;f.vy=0;
  startAttack(f,'smash');
  SFX.tp();
}

export function enterHyper(f){
  f.ki-=1;f.hyper=true;
  SFX.transform();shake(5);
  burst(f.x,-(f.y+90),'#ff5030',22);
  setCallout('HYPER MODE!','#ff5030');
}

export function doTransform(f){
  f.ki-=4;f.form++;
  f.state='transforming';f.transformT=45;f.invuln=45;f.vx=0;
  SFX.transform();shake(9);game.flash=5;
  burst(f.x,-(f.y+90),f.char.forms[f.form].aura,34);
  setCallout(f.char.forms[f.form].n+'!',f.char.forms[f.form].aura);
}

export function startRushDash(f,o){
  f.ki-=1;f.state='rushdash';f.rushT=30;
  f.face=o.x>=f.x?1:-1;
  SFX.rush();
}

export function fireBlast(f){
  if(f.ki<0.25)return;
  f.ki-=0.25;
  game.projs.push({x:f.x+f.face*44,y:f.y+95*f.scl,vx:f.face*15,owner:f,dmg:9,c:auraColor(f)});
  SFX.blast();
}

export function fireBeam(f){
  const spec=f.char.beams[f.beamType];
  const cost=f.beamType?4:3;
  f.ki-=cost;
  game.beams.push({owner:f,x:f.x+f.face*46,h:f.y+95*f.scl,dir:f.face,len:0,
    dmg:(f.beamType?150:110)*atkMult(f),color:spec.c,name:spec.n,state:'fly',t:0});
  setCallout(spec.n+'!',spec.c);
  SFX.beam();shake(4);
}

export function fireSig(f){
  const s=f.char.sig;
  const c=Math.min(1,f.atkT/45);
  f.ki-=1;
  game.projs.push({sig:true,x:f.x+f.face*50,y:f.y+95*f.scl,vx:f.face*s.spd,owner:f,
    dmg:s.dmg*(0.75+0.6*c)*atkMult(f),r:s.r*(1+0.6*c),c:s.c,name:s.n});
  setCallout(s.n+'!',s.c);
  SFX.beam();shake(3);
}
