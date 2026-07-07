/* Stage rendering: parallax sky/backdrop (screen space) and the
   ground plane (world space), themed by the active stage palette. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {STAGES,ROCKS} from '../data/stages.js';

export function drawSky(){
  const S=STAGES[game.stageI];
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,S.skyTop);g.addColorStop(0.55,S.skyMid);
  g.addColorStop(0.72,S.horizon);g.addColorStop(1,S.skyBot);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // sun / moon
  ctx.fillStyle=S.sun;
  ctx.beginPath();ctx.arc(W*0.78,110,52,0,TAU);ctx.fill();
  const cx=game.cam.x;
  // clouds
  ctx.fillStyle=S.cloud;
  for(let i=0;i<5;i++){
    const x=((i*340-cx*0.05)%(W+300)+W+300)%(W+300)-150;
    const y=70+((i*97)%160);
    ctx.beginPath();
    ctx.ellipse(x,y,70,20,0,0,TAU);
    ctx.ellipse(x+45,y-10,45,16,0,0,TAU);
    ctx.fill();
  }
  // far mountains
  ctx.fillStyle=S.far;
  ctx.beginPath();ctx.moveTo(0,H*0.62);
  for(let i=0;i<=8;i++){
    const x=i*(W/8)-((cx*0.12)%(W/8));
    ctx.lineTo(x-W/16,H*0.62-((i*53)%90)-40);
    ctx.lineTo(x+W/16,H*0.62);
  }
  ctx.lineTo(W,H*0.62);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  // mesas
  ctx.fillStyle=S.mesa;
  for(let i=0;i<4;i++){
    const x=((i*520-cx*0.28)%(W+560)+W+560)%(W+560)-280;
    const y=H*0.66,w=140+(i%2)*60,h=110+(i%3)*30;
    ctx.beginPath();
    ctx.moveTo(x-w/2-24,y);ctx.lineTo(x-w/2,y-h);
    ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w/2+24,y);
    ctx.closePath();ctx.fill();
  }
}

export function drawGround(){
  const S=STAGES[game.stageI];
  ctx.fillStyle=S.ground;
  ctx.fillRect(-1350,0,2700,600);
  ctx.fillStyle=S.groundTop;
  ctx.fillRect(-1350,0,2700,10);
  // cracks
  ctx.strokeStyle=S.crack;ctx.lineWidth=3;
  for(let i=0;i<14;i++){
    const x=-1200+i*180;
    ctx.beginPath();ctx.moveTo(x,12);
    ctx.lineTo(x+40,60+(i*31)%50);ctx.lineTo(x+10,120+(i*17)%60);
    ctx.stroke();
  }
  // rocks
  for(const r of ROCKS){
    ctx.fillStyle=S.rock;
    ctx.beginPath();ctx.arc(r.x,-r.r*0.3,r.r,Math.PI,0);ctx.fill();
  }
  // arena walls (cliff edges)
  for(const wx of [-1140,1140]){
    ctx.fillStyle=S.wall;
    ctx.fillRect(wx-40,-300,80,900);
    ctx.strokeStyle='#141418';ctx.lineWidth=4;
    ctx.strokeRect(wx-40,-300,80,900);
  }
}

export function drawShadow(f){
  const s=Math.max(0.3,Math.min(1,1-f.y/450));
  ctx.fillStyle='rgba(40,25,10,0.35)';
  ctx.beginPath();
  ctx.ellipse(f.x,6,46*s*f.scl,10*s,0,0,TAU);
  ctx.fill();
}
