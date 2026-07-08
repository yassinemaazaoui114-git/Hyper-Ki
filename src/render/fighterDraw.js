/* Procedural fighter rig renderer: cel-shaded limbs, head/hair styles,
   auras, and the fakeFighter helper for menu/cinematic poses. */
import {ctx} from '../core/canvas.js';
import {TAU,shade} from '../core/math.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
import {POSES,clonePose} from '../data/poses.js';
import {auraColor} from '../world/fighter.js';

let TINT=null;

function strokePath(pts,w,col){
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
  ctx.strokeStyle='#141418';ctx.lineWidth=w+6;ctx.stroke();
  ctx.strokeStyle=TINT||col;ctx.lineWidth=w;ctx.stroke();
}

function circleO(x,y,r,col){
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);
  ctx.fillStyle=TINT||col;ctx.fill();
  ctx.lineWidth=3;ctx.strokeStyle='#141418';ctx.stroke();
}

function limb(x,y,a1,a2,l1,l2,w,col){
  const ex=x+Math.sin(a1)*l1,ey=y+Math.cos(a1)*l1;
  const a=a1+a2;
  const hx=ex+Math.sin(a)*l2,hy=ey+Math.cos(a)*l2;
  strokePath([[x,y],[ex,ey],[hx,hy]],w,col);
  return [hx,hy];
}

export function drawHead(c,hairC){
  circleO(0,0,15,c.skin);
  ctx.fillStyle=TINT||hairC;
  ctx.strokeStyle='#141418';ctx.lineWidth=3;
  if(c.hair===0){ // spiky up
    ctx.beginPath();
    ctx.moveTo(-15,-1);
    ctx.lineTo(-19,-19);ctx.lineTo(-9,-9);
    ctx.lineTo(-8,-27);ctx.lineTo(-1,-11);
    ctx.lineTo(4,-29);ctx.lineTo(8,-10);
    ctx.lineTo(16,-19);ctx.lineTo(14,-3);
    ctx.closePath();ctx.fill();ctx.stroke();
  }else if(c.hair===1){ // long spikes swept back
    ctx.beginPath();
    ctx.moveTo(13,-8);
    ctx.lineTo(2,-20);ctx.lineTo(-6,-14);
    ctx.lineTo(-14,-22);ctx.lineTo(-16,-8);
    ctx.lineTo(-30,-4);ctx.lineTo(-22,6);
    ctx.lineTo(-34,14);ctx.lineTo(-18,14);
    ctx.lineTo(-14,6);
    ctx.closePath();ctx.fill();ctx.stroke();
  }else if(c.hair===2){ // tall regal crest
    ctx.beginPath();
    ctx.moveTo(-13,-7);
    ctx.quadraticCurveTo(-10,-30,0,-34);
    ctx.quadraticCurveTo(10,-30,13,-7);
    ctx.closePath();ctx.fill();ctx.stroke();
  }else{ // bald mentor: beard + brows
    ctx.beginPath();
    ctx.moveTo(-8,10);
    ctx.quadraticCurveTo(0,30,10,10);
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(2,-8);ctx.lineTo(13,-10);ctx.stroke();
  }
  // face (facing +x)
  ctx.fillStyle='#141418';
  ctx.fillRect(6,-5,4,4);
  ctx.beginPath();ctx.moveTo(4,-8);ctx.lineTo(12,-9);
  ctx.strokeStyle='#141418';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(8,7);ctx.lineTo(12,7);ctx.stroke();
}

export function drawFighterView(v){
  const c=v.char,form=c.forms[v.form];
  const p=v.pose;
  TINT=v.tint||((v.flashT>0&&v.flashT%2===0)?'#ffffff':null);
  ctx.save();
  if(v.alpha!==undefined)ctx.globalAlpha=v.alpha;
  if(v.sidestepT>0){ctx.globalAlpha=0.5;}
  else if(v.invuln>0&&v.state!=='transforming'&&Math.floor(v.frame/3)%2===0)ctx.globalAlpha=0.6;
  ctx.translate(v.x,-v.y);
  ctx.scale(v.face*v.scl,v.scl);
  if(v.state==='down'){ctx.translate(-14,-8);ctx.rotate(Math.PI/2-0.22);}
  // alternate unlockable palette (outfit + hair recolor; skin tone unchanged)
  const alt=(v.skin===1&&c.alt)?c.alt:null;
  const topC=alt?alt.top:c.top;
  const pantsC=alt?alt.pants:c.pants;
  const beltC=alt?alt.belt:c.belt;
  const capeC=(alt&&alt.cape)?alt.cape:c.cape;
  const hairBase=(alt&&alt.hairC)?alt.hairC:c.hairC;
  const hairC=form.hairC||hairBase;
  const hipY=-74;
  const nx=Math.sin(p.lean)*54,ny=hipY-Math.cos(p.lean)*54;
  const shX=nx*0.92,shY=ny+10;
  // cape (villain)
  if(c.cape){
    const wv=Math.sin((v.frame||0)*0.1)*8;
    ctx.beginPath();
    ctx.moveTo(shX-6,shY-6);
    ctx.quadraticCurveTo(-46,hipY-20,-52+wv,hipY+44);
    ctx.quadraticCurveTo(-28,hipY+38,-14,hipY+8);
    ctx.closePath();
    ctx.fillStyle=TINT||capeC;ctx.fill();
    ctx.lineWidth=3;ctx.strokeStyle='#141418';ctx.stroke();
  }
  // back arm + back leg (darker)
  let e=limb(shX,shY,p.ba[0],p.ba[1],26,24,12,shade(topC,-32));
  circleO(e[0],e[1],7,shade(c.skin,-28));
  e=limb(0,hipY,p.bl[0],p.bl[1],35,34,14,shade(pantsC,-32));
  circleO(e[0],e[1],8,'#26262e');
  // torso + belt
  strokePath([[0,hipY],[nx,ny]],32,topC);
  ctx.fillStyle=TINT||beltC;
  ctx.fillRect(-15,hipY-7,30,12);
  ctx.lineWidth=3;ctx.strokeStyle='#141418';
  ctx.strokeRect(-15,hipY-7,30,12);
  // head
  ctx.save();
  ctx.translate(nx+Math.sin(p.lean)*10,ny-16);
  drawHead(c,hairC);
  ctx.restore();
  // front leg + front arm
  e=limb(0,hipY,p.fl[0],p.fl[1],35,34,14,pantsC);
  circleO(e[0],e[1],8,'#33333d');
  e=limb(shX,shY,p.fa[0],p.fa[1],26,24,12,topC);
  circleO(e[0],e[1],7,c.skin);
  ctx.restore();
  TINT=null;
}

export function drawAuraShape(x,baseY,wd,ht,color,t,alpha){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.globalCompositeOperation='lighter';
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(x-wd,baseY);
  for(let i=0;i<=10;i++){
    const u=i/10;
    const fx=x-wd+2*wd*u;
    const flick=Math.sin(t*0.35+i*2.7)*0.5+0.5;
    const fy=baseY-Math.sin(u*Math.PI)*(ht*(0.7+0.3*flick))-(i%2?26*flick:0);
    ctx.lineTo(fx,fy);
  }
  ctx.closePath();ctx.fill();
  ctx.restore();
}

export function drawAura(f){
  let col=null;
  const form=f.char.forms[f.form];
  if(f.hyper)col='#ff3b2f';
  else if(f.state==='charge'||f.state==='beamCharge'||f.state==='sigCharge'||f.state==='heavyWind'||f.state==='transforming')col=form.aura;
  else if(f.form===f.char.forms.length-1&&f.form>0)col=form.aura;
  if(!col)return;
  drawAuraShape(f.x,-f.y+4,58*f.scl,195*f.scl,col,f.frame,0.3);
  drawAuraShape(f.x,-f.y+4,42*f.scl,155*f.scl,col,f.frame+40,0.45);
}

/** Static posed fighter for menus and cinematics. */
export function fakeFighter(ci,form,poseName,face,skin){
  return {char:CHARS[ci],form:Math.min(form,CHARS[ci].forms.length-1),skin:skin||0,
    pose:clonePose(POSES[poseName]),face,x:0,y:0,scl:1,state:'idle',
    frame:game.frame,flashT:0,sidestepT:0,invuln:0};
}
