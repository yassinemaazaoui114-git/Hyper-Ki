/* Fighter entity factory + derived stat helpers. */
import {CHARS} from '../data/characters.js';
import {POSES,clonePose} from '../data/poses.js';

export function makeFighter(ci,x,face,isCPU,skin){
  const c=CHARS[ci];
  return {
    char:c,ci,x,y:0,vx:0,vy:0,face,isCPU,scl:c.scale||1,skin:skin||0,
    maxhp:900*c.def,hp:900*c.def,gray:0,ki:2,
    form:0,hyper:false,
    state:'idle',animT:0,atk:null,atkT:0,atkHit:false,chain:null,
    stunT:0,blockstun:0,downT:0,sidestepT:0,invuln:0,flashT:0,
    canPursue:0,smashed:false,rushT:0,transformT:0,
    lastGuardPress:-999,lastHitFrame:-999,
    blastHold:0,beamType:0,
    dashT:0,dashDir:0,tapL:-99,tapR:-99,lastPunch:-99,lastKick:-99,
    frame:0,aiT:0,aiPlan:'approach',aiGuard:0,
    comboHits:0,comboDmg:0,comboLast:-99,comboFade:null,
    vanishW:0,vanishFrom:null,heavyBtn:null,heavyPow:0,
    dizzyMeter:0,dizzyT:0,dizzyImmune:0,dummyCd:-99,
    chargeOsc:null,pose:clonePose(POSES.idle),intent:{},
  };
}

export function atkMult(f){return f.char.pow*f.char.forms[f.form].mult*(f.hyper?1.15:1);}
export function defMult(f){return f.char.def*(1+0.12*f.form);}
export function auraColor(f){return f.hyper?'#ff3b2f':f.char.forms[f.form].aura;}
