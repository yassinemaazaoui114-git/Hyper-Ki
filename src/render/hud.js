/* Fight HUD: portraits, stacked health bars, ki gauge, form tag,
   combo counters, timer, announcer text, and move callouts. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {auraColor} from '../world/fighter.js';
import {drawHead} from './fighterDraw.js';
import {outlineText} from './text.js';

function drawHUDside(f,right){
  const bw=430,bh=15;
  const bx=right?W-40-bw:40+90;
  const px=right?W-80:80,py=66;
  // portrait
  ctx.save();
  ctx.beginPath();ctx.arc(px,py,42,0,TAU);
  ctx.fillStyle='#1a1a26';ctx.fill();ctx.clip();
  ctx.translate(px,py+10);ctx.scale(right?-2.2:2.2,2.2);
  drawHead(f.char,f.char.forms[f.form].hairC||f.char.hairC);
  ctx.restore();
  ctx.lineWidth=5;ctx.strokeStyle=auraColor(f);
  ctx.beginPath();ctx.arc(px,py,42,0,TAU);ctx.stroke();
  // name
  outlineText(f.char.name,right?W-134:134,30,20,'#fff',right?'right':'left',true);
  // health bars
  const seg=f.maxhp/3;
  const bars=Math.max(0,Math.ceil(f.hp/seg));
  const frac=bars>0?(f.hp-(bars-1)*seg)/seg:0;
  const cols=['#ff4a3d','#ffd23e','#39d354'];
  ctx.fillStyle='#141418';
  ctx.fillRect(bx-3,42-3,bw+6,bh+6);
  ctx.fillStyle=bars>1?cols[bars-2]:'#26262e';
  ctx.fillRect(bx,42,bw,bh);
  const fw=bw*Math.max(0,Math.min(1,frac));
  ctx.fillStyle=bars>0?cols[bars-1]:'#26262e';
  ctx.fillRect(right?bx+bw-fw:bx,42,fw,bh);
  // gray recoverable health
  if(f.gray>0&&bars>0){
    const gw=bw*Math.max(0,Math.min(Math.min(f.gray/seg,1-frac),1));
    ctx.fillStyle='rgba(190,196,205,0.85)';
    ctx.fillRect(right?bx+bw-fw-gw:bx+fw,42,gw,bh);
  }
  // ki gauge (7 segments)
  const ky=64,kw=(bw-24)/7;
  for(let i=0;i<7;i++){
    const kx=right?bx+bw-(i+1)*kw-i*4:bx+i*(kw+4);
    ctx.fillStyle='#141418';
    ctx.fillRect(kx-2,ky-2,kw+4,12+4);
    let fill2='#26262e',part=0;
    if(f.ki>=i+1)part=1;
    else if(f.ki>i)part=f.ki-i;
    if(part>0){
      fill2=f.hyper?'#ff4136':'#3fc8ff';
      if(f.ki>=6.95&&game.frame%20<10)fill2='#fff';
    }
    ctx.fillStyle='#26262e';ctx.fillRect(kx,ky,kw,12);
    if(part>0){
      ctx.fillStyle=fill2;
      const pw=kw*part;
      ctx.fillRect(right?kx+kw-pw:kx,ky,pw,12);
    }
  }
  // form indicator
  const form=f.char.forms[f.form];
  const fy=92;
  ctx.save();
  ctx.translate(right?W-120:120,fy);
  ctx.rotate(Math.PI/4);
  ctx.fillStyle=auraColor(f);
  ctx.fillRect(-6,-6,12,12);
  ctx.strokeStyle='#141418';ctx.lineWidth=2;ctx.strokeRect(-6,-6,12,12);
  ctx.restore();
  outlineText((f.hyper?'HYPER · ':'')+form.n,right?W-134:134,fy,13,f.hyper?'#ff6a5e':'#e8e8f0',right?'right':'left');
}

function drawComboSide(f,right){
  const x=right?W-170:170,y=160;
  if(f.comboHits>=2){
    const pop=1+0.5*Math.max(0,1-(game.frame-f.comboLast)/6);
    ctx.save();ctx.translate(x,y);ctx.scale(pop,pop);
    outlineText(f.comboHits+' HITS',0,0,34,'#ffd24a','center',true);
    outlineText(Math.round(f.comboDmg)+' DMG',0,30,16,'#ffb14a');
    ctx.restore();
  }else if(f.comboFade&&f.comboFade.hits>=2){
    ctx.save();ctx.globalAlpha=Math.max(0,1-f.comboFade.t/50);
    outlineText(f.comboFade.hits+' HITS',x,y,34,'#e8e8f0','center',true);
    outlineText(f.comboFade.dmg+' DMG',x,y+30,16,'#c8c8dc');
    ctx.restore();
  }
}

export function drawHUD(){
  drawHUDside(game.p1,false);
  drawHUDside(game.p2,true);
  drawComboSide(game.p1,false);
  drawComboSide(game.p2,true);
  outlineText(game.timeLimit===Infinity?'∞':String(Math.max(0,game.timer)).padStart(2,'0'),W/2,52,44,'#ffd24a');
}

export function drawAnnouncer(){
  if(!game.ann)return;
  const a=game.ann;
  const pop=1+0.7*Math.max(0,1-a.t/8);
  const alpha=a.dur-a.t<12?Math.max(0,(a.dur-a.t)/12):1;
  ctx.save();ctx.globalAlpha=alpha;
  ctx.translate(W/2,H*0.38);
  ctx.scale(pop,pop);
  outlineText(a.text,0,0,74,a.color,'center',true);
  ctx.restore();
}

export function drawCallout(){
  if(!game.callout)return;
  const c=game.callout;
  const alpha=c.t>60?Math.max(0,(80-c.t)/20):1;
  ctx.save();ctx.globalAlpha=alpha;
  outlineText(c.text,W/2,H-140,30,c.c,'center',true);
  ctx.restore();
}
