/* Dragon Rush cinematic screen + directional picker widgets. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {drawFighterView,drawAuraShape,fakeFighter} from '../render/fighterDraw.js';
import {drawHUD} from '../render/hud.js';
import {outlineText} from '../render/text.js';

export function drawRushPicker(cx,label,pick,hide){
  const arrows=['←','↑','→'];
  const sp=hide?100:140,bw=hide?80:96,bh=hide?70:84;
  if(label)outlineText(label,cx,H-185,17,'#fff');
  for(let i=0;i<3;i++){
    const x=cx-sp+i*sp,y=H-110;
    const sel=!hide&&pick===i;
    ctx.fillStyle=sel?'#ffd24a':'rgba(20,20,40,0.85)';
    ctx.fillRect(x-bw/2,y-bh/2,bw,bh);
    ctx.lineWidth=4;ctx.strokeStyle=sel?'#fff':'#5a5a80';
    ctx.strokeRect(x-bw/2,y-bh/2,bw,bh);
    outlineText(arrows[i],x,y,hide?32:44,sel?'#141418':'#fff');
  }
  if(hide&&pick>=0)outlineText('LOCKED!',cx,H-42,20,'#9fe8ff');
}

export function drawRush(){
  const r=game.rush;
  const p1=game.p1,p2=game.p2;
  // cinematic sky
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#1a2c66');g.addColorStop(1,'#5a86c8');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // radial speed lines
  ctx.save();ctx.globalAlpha=0.3;ctx.strokeStyle='#fff';ctx.lineWidth=3;
  for(let i=0;i<24;i++){
    const a=i/24*TAU+game.frame*0.02;
    ctx.beginPath();
    ctx.moveTo(W/2+Math.cos(a)*180,H/2+Math.sin(a)*120);
    ctx.lineTo(W/2+Math.cos(a)*900,H/2+Math.sin(a)*640);
    ctx.stroke();
  }
  ctx.restore();
  // chase: defender ahead, attacker behind
  const wob=Math.sin(game.frame*0.2)*14;
  const hitPop=(r.phase==='result'&&r.pa!==r.pd&&r.t>=10&&r.t<20)?26:0;
  ctx.save();ctx.translate(W/2+120+wob+hitPop,H*0.55);ctx.scale(1.7,1.7);
  drawFighterView({...fakeFighter(r.def.ci,r.def.form,'hurt',1),flashT:hitPop?4:0});
  ctx.restore();
  ctx.save();ctx.translate(W/2-160-wob,H*0.55);ctx.scale(1.7,1.7);
  drawAuraShape(0,4,58,190,'#ff3b2f',game.frame,0.5);
  drawFighterView(fakeFighter(r.att.ci,r.att.form,hitPop?'punchA':'dash',1));
  ctx.restore();
  outlineText('DRAGON RUSH',W/2,80,52,'#ff5030','center',true);
  // round dots
  for(let i=0;i<3;i++){
    ctx.fillStyle=i<r.round?'#ffd24a':'#3a3a55';
    ctx.beginPath();ctx.arc(W/2-40+i*40,130,12,0,TAU);ctx.fill();
    ctx.lineWidth=3;ctx.strokeStyle='#141418';ctx.stroke();
  }
  const arrows=['←','↑','→'];
  if(r.phase==='pick'){
    if(game.mode==='2p'){
      drawRushPicker(W/2-300,'P1 · '+(r.att===p1?'STRIKE!':'ESCAPE!'),r.att===p1?r.pickA:r.pickD,true);
      drawRushPicker(W/2+300,'P2 · '+(r.att===p2?'STRIKE!':'ESCAPE!'),r.att===p2?r.pickA:r.pickD,true);
    }else{
      const humanIsAtt=!r.att.isCPU;
      outlineText(humanIsAtt?'PICK A DIRECTION TO STRIKE!':'GUESS THEIR PICK TO ESCAPE!',W/2,H-190,24,'#fff');
      drawRushPicker(W/2,null,humanIsAtt?r.pickA:r.pickD,false);
    }
    // pick timer
    ctx.fillStyle='#141418';ctx.fillRect(W/2-160,H-230,320,10);
    ctx.fillStyle='#ff5030';ctx.fillRect(W/2-160,H-230,320*(1-r.t/60),10);
  }else{
    outlineText(arrows[r.pa]+'  vs  '+arrows[r.pd],W/2,H-150,44,'#fff');
    if(r.t>=10)outlineText(r.pa===r.pd?'ESCAPED!':'DIRECT HIT!',W/2,H-90,36,r.pa===r.pd?'#9fe8ff':'#ffd24a','center',true);
  }
  drawHUD();
  if(game.flash>0&&SETTINGS.flash){ctx.fillStyle='rgba(255,255,255,'+(game.flash/8)+')';ctx.fillRect(0,0,W,H);}
}
