/* Effect rendering: particles, projectiles, beams, clash glow, speedlines. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {clashJunction} from '../minigames/clash.js';

export function drawParticles(){
  for(const p of game.parts){
    ctx.save();
    ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.max));
    if(p.lighter)ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=p.c;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fill();
    ctx.restore();
  }
}

export function drawProjectiles(){
  for(const p of game.projs){
    ctx.save();ctx.globalCompositeOperation='lighter';
    if(p.sig){
      ctx.globalAlpha=0.35;ctx.fillStyle=p.c;
      ctx.beginPath();
      ctx.ellipse(p.x-Math.sign(p.vx)*p.r*1.5,-p.y,p.r*2.2,p.r*0.85,0,0,TAU);
      ctx.fill();
      ctx.globalAlpha=0.85;
      ctx.beginPath();ctx.arc(p.x,-p.y,p.r*1.3,0,TAU);ctx.fill();
      ctx.globalAlpha=1;ctx.fillStyle='#fff';
      ctx.beginPath();ctx.arc(p.x,-p.y,p.r*0.6,0,TAU);ctx.fill();
    }else{
      ctx.fillStyle=p.c;
      ctx.beginPath();ctx.arc(p.x,-p.y,14,0,TAU);ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath();ctx.arc(p.x,-p.y,7,0,TAU);ctx.fill();
    }
    ctx.restore();
  }
}

export function drawBeamSegment(x0,x1,h,color,t){
  const y=-h;
  const pulse=1+0.12*Math.sin(t*0.5);
  ctx.save();ctx.globalCompositeOperation='lighter';
  ctx.lineCap='round';
  ctx.globalAlpha=0.35;
  ctx.strokeStyle=color;ctx.lineWidth=52*pulse;
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  ctx.globalAlpha=0.85;
  ctx.lineWidth=30*pulse;ctx.stroke();
  ctx.globalAlpha=1;
  ctx.strokeStyle='#fff';ctx.lineWidth=13*pulse;ctx.stroke();
  ctx.restore();
}

export function drawBeams(){
  for(const b of game.beams){
    if(b.state!=='fly')continue;
    const tip=b.x+b.dir*b.len;
    drawBeamSegment(b.x,tip,b.h,b.color,b.t);
    ctx.save();ctx.globalCompositeOperation='lighter';
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(tip,-b.h,20+4*Math.sin(b.t*0.6),0,TAU);ctx.fill();
    ctx.restore();
  }
}

export function drawClashWorld(){
  const c=game.clash;
  const jx=clashJunction();
  const h=(c.a.h+c.b.h)/2;
  drawBeamSegment(c.a.x,jx,c.a.h,c.a.color,c.t);
  drawBeamSegment(c.b.x,jx,c.b.h,c.b.color,c.t+7);
  ctx.save();ctx.globalCompositeOperation='lighter';
  const r=44+10*Math.sin(c.t*0.5);
  const g=ctx.createRadialGradient(jx,-h,4,jx,-h,r);
  g.addColorStop(0,'#fff');g.addColorStop(0.5,c.a.color);g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.arc(jx,-h,r,0,TAU);ctx.fill();
  ctx.restore();
}

export function drawSpeedlines(){
  let on=game.vanishFxT>0;
  for(const f of [game.p1,game.p2])if(f&&(f.state==='dash'||f.state==='rushdash'))on=true;
  if(!on)return;
  ctx.save();ctx.globalAlpha=0.25;ctx.strokeStyle='#fff';ctx.lineWidth=2;
  for(let i=0;i<14;i++){
    const y=(i*61+game.frame*23)%H;
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y-30);ctx.stroke();
  }
  ctx.restore();
}
