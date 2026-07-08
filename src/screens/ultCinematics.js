/* Per-character ultimate finisher cinematics (the 'fire' phase).
   Each fighter gets a distinct, identity-matched visual. All procedural. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU,lerp} from '../core/math.js';
import {drawFighterView,fakeFighter} from '../render/fighterDraw.js';

/* Distinct signature color per character (indexed by ci). */
const ULTCOL=['#5ac8ff','#b47dff','#ff5ad0','#6affc0'];

function poseAt(x,y,scale,ci,form,pose,face,flashT){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  drawFighterView({...fakeFighter(ci,form,pose,face),flashT:flashT||0});
  ctx.restore();
}

export function drawUltFire(u){
  switch(u.att.ci){
    case 0:return novaSphere(u);
    case 1:return oblivionDriver(u);
    case 2:return extinctionFlare(u);
    default:return templeStrike(u);
  }
}

/* KAIRO — GALAXY NOVA: a huge sphere plummets from the sky. */
function novaSphere(u){
  const col=ULTCOL[0],t=u.t;
  poseAt(W*0.24,H*0.86,2.3,u.att.ci,u.att.form,'beam',1,0);
  const prog=Math.min(1,t/32);
  const cx=W*0.66,cy=lerp(-160,H*0.44,prog);
  const r=140+30*Math.sin(t*0.25);
  if(t>18)poseAt(W*0.66,H*0.90,1.7,u.def.ci,u.def.form,t>30?'launched':'block',-1,t%3);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let ring=0;ring<3;ring++){
    const rr=r*(1-ring*0.22);
    const g=ctx.createRadialGradient(cx,cy,rr*0.1,cx,cy,rr);
    g.addColorStop(0,'#fff');g.addColorStop(0.45,col);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,rr,0,TAU);ctx.fill();
  }
  for(let i=0;i<10;i++){
    const a=t*0.1+i*(TAU/10);
    ctx.fillStyle=col;
    ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*1.1,cy+Math.sin(a)*r*0.66,5,0,TAU);ctx.fill();
  }
  ctx.restore();
}

/* RIVEN — OBLIVION DRIVER: a close-range dark implosion. */
function oblivionDriver(u){
  const col=ULTCOL[1],t=u.t;
  const cx=W*0.5,cy=H*0.52;
  poseAt(cx-150,H*0.88,1.9,u.att.ci,u.att.form,'punchB',1,0);
  poseAt(cx+50,H*0.86,1.7,u.def.ci,u.def.form,'launched',-1,t%2);
  const r=Math.min(1,t/32)*340;
  ctx.save();
  ctx.globalAlpha=0.8;ctx.fillStyle='#150826';
  ctx.beginPath();ctx.arc(cx,cy,r*0.8,0,TAU);ctx.fill();
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1;
  const g=ctx.createRadialGradient(cx,cy,r*0.4,cx,cy,r);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.75,col);g.addColorStop(0.95,'#fff');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
  for(let i=0;i<8;i++){
    const a=t*0.05+i*(TAU/8);
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.globalAlpha=0.6;
    ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*r*0.3,cy+Math.sin(a)*r*0.3);
    ctx.lineTo(cx+Math.cos(a+0.3)*r,cy+Math.sin(a+0.3)*r);ctx.stroke();
  }
  ctx.restore();
}

/* LORD VESK — EXTINCTION FLARE: a colossal rising pillar. */
function extinctionFlare(u){
  const col=ULTCOL[2],t=u.t;
  const px=W*0.66;
  poseAt(W*0.24,H*0.86,2.2,u.att.ci,u.att.form,'beam',1,0);
  if(t>16)poseAt(px,H*0.90,1.7,u.def.ci,u.def.form,'launched',-1,t%3);
  const grow=Math.min(1,t/22);
  const w=(70+Math.sin(t*0.5)*18)*grow+10;
  const h=grow*H*1.1;
  ctx.save();ctx.globalCompositeOperation='lighter';
  const g=ctx.createLinearGradient(px-w,0,px+w,0);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.5,col);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(px-w,H-h,w*2,h);
  ctx.globalAlpha=0.9;ctx.fillStyle='#fff';ctx.fillRect(px-w*0.35,H-h,w*0.7,h);
  for(let i=0;i<12;i++){
    const yy=H-((t*8+i*60)%H);
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(px+Math.sin(i+t*0.1)*w,yy,4,0,TAU);ctx.fill();
  }
  ctx.restore();
}

/* MASTER IRO — THOUSAND TEMPLE STRIKE: a rapid converging barrage. */
function templeStrike(u){
  const col=ULTCOL[3],t=u.t;
  const dx=W*0.64,dy=H*0.52;
  poseAt(W*0.26,H*0.86,2.1,u.att.ci,u.att.form,(t%6<3)?'punchA':'kick',1,0);
  poseAt(dx,H*0.90,1.7,u.def.ci,u.def.form,'hurt',-1,t%2);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<7;i++){
    const a=t*0.6+i*(TAU/7);
    const rr=70+50*((t*0.3+i)%3);
    ctx.strokeStyle=i%2?'#fff':col;ctx.lineWidth=4;ctx.globalAlpha=0.85;
    ctx.beginPath();
    ctx.moveTo(dx+Math.cos(a)*rr,dy+Math.sin(a)*rr*0.7);
    ctx.lineTo(dx+Math.cos(a)*14,dy+Math.sin(a)*14);
    ctx.stroke();
  }
  for(let i=0;i<4;i++){
    const a=t+i*1.7;
    ctx.fillStyle='#fff';ctx.globalAlpha=0.7;
    ctx.beginPath();ctx.arc(dx+Math.cos(a)*40,dy+Math.sin(a)*30,7,0,TAU);ctx.fill();
  }
  ctx.restore();
}
