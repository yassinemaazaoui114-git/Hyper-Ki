/* Maps fighter state to a target pose and eases the rig toward it. */
import {POSES,mixInto} from '../data/poses.js';
import {ATK} from '../data/attacks.js';

export function targetPose(f){
  switch(f.state){
    case 'walk':return (Math.floor(f.animT/10)%2)?POSES.walk1:POSES.walk2;
    case 'dash':case 'rushdash':return POSES.dash;
    case 'attack':return POSES[ATK[f.atk].pose];
    case 'hurt':return POSES.hurt;
    case 'block':return POSES.block;
    case 'charge':case 'transforming':return POSES.charge;
    case 'heavyWind':return POSES.heavyWind;
    case 'beamCharge':case 'beamFire':case 'sigCharge':return POSES.beam;
    case 'launched':return POSES.launched;
    case 'down':return POSES.down;
    case 'sidestep':return POSES.sidestep;
    case 'victory':return POSES.victory;
    default:return f.y>0?POSES.jump:POSES.idle;
  }
}

export function updatePose(f){mixInto(f.pose,targetPose(f),0.35);}
