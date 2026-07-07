/* Skeletal pose keyframes for the procedural fighter rig.
   lean = torso tilt; fa/ba = front/back arm [shoulder, elbow];
   fl/bl = front/back leg [hip, knee]. Angles in radians, forward = +. */
function PS(lean,fs,fe,bs,be,flh,flk,blh,blk){
  return {lean,fa:[fs,fe],ba:[bs,be],fl:[flh,flk],bl:[blh,blk]};
}

export const POSES={
 idle:    PS(0.06, 0.7,-1.9, 1.0,-2.1, 0.25,0.25,-0.20,0.30),
 walk1:   PS(0.08, 0.6,-1.8, 1.1,-2.0, 0.50,0.30,-0.40,0.50),
 walk2:   PS(0.08, 0.9,-2.0, 0.7,-1.9,-0.30,0.50, 0.50,0.20),
 dash:    PS(0.50,-0.6,-0.6,-0.8,-0.4, 0.90,0.80,-0.70,1.00),
 punchA:  PS(0.15, 1.65,-0.1, 0.7,-2.2, 0.40,0.20,-0.30,0.30),
 punchB:  PS(0.18, 0.6,-2.2, 1.7,-0.05,0.45,0.20,-0.35,0.35),
 kick:    PS(-0.15,0.4,-1.5, 1.0,-1.8, 1.50,0.15,-0.30,0.40),
 kickBig: PS(-0.30,0.2,-1.2, 1.2,-1.6, 1.90,0.05,-0.40,0.50),
 launcher:PS(-0.25,2.6,-0.2, 0.4,-1.6, 0.50,0.40,-0.50,0.60),
 smash:   PS(0.35, 2.2,-2.4, 2.0,-2.2, 0.50,0.60,-0.40,0.80),
 grab:    PS(0.28, 1.35,-0.35,1.55,-0.25,0.45,0.30,-0.30,0.40),
 heavyWind:PS(-0.22,2.1,-2.3, 0.9,-1.9, 0.35,0.35,-0.40,0.50),
 hurt:    PS(-0.30,0.9,-2.4, 1.2,-2.5, 0.40,0.40,-0.30,0.50),
 block:   PS(0.10, 1.1,-2.5, 1.3,-2.6, 0.30,0.25,-0.20,0.30),
 charge:  PS(0.02, 0.5,-0.7, 0.9,-0.9, 0.50,0.70,-0.45,0.70),
 beam:    PS(0.12, 1.55,0.0, 1.45,0.1, 0.35,0.25,-0.30,0.35),
 launched:PS(-0.80,2.2,-1.0, 1.8,-1.2, 0.80,0.90, 0.30,1.10),
 down:    PS(0.00, 0.3,-0.3, 0.5,-0.3, 0.20,0.20,-0.20,0.20),
 victory: PS(-0.05,3.0,-0.3, 0.8,-1.8, 0.30,0.20,-0.25,0.30),
 sidestep:PS(0.10, 0.7,-1.9, 1.0,-2.1, 0.30,0.40,-0.25,0.45),
 jump:    PS(0.10, 1.2,-1.8, 1.5,-2.0, 0.90,1.20,-0.50,0.80),
};

export function clonePose(p){
  return {lean:p.lean,fa:[...p.fa],ba:[...p.ba],fl:[...p.fl],bl:[...p.bl]};
}

/** Ease every joint of pose p toward target t by factor k. */
export function mixInto(p,t,k){
  p.lean+=(t.lean-p.lean)*k;
  for(const key of ['fa','ba','fl','bl'])
    for(let i=0;i<2;i++)p[key][i]+=(t[key][i]-p[key][i])*k;
}
