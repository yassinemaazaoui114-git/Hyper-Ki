/* Ultimate attack cinematic screen + arrow duel UI. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {auraColor} from '../world/fighter.js';
import {ROUND_OPTS} from '../minigames/ultimate.js';
import {drawFighterView,drawAuraShape,fakeFighter} from '../render/fighterDraw.js';
import {drawCallout} from '../render/hud.js';
import {outlineText} from '../render/text.js';

export function drawUlt(){
  const u=game.ult;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // energy backdrop
  ctx.save();ctx.globalAlpha=0.35;
  for(let i=0;i<18;i++){
    const a=i/18*TAU-game.frame*0.03;
    ctx.strokeStyle=auraColor(u.att);ctx.lineWidth=4;
    ctx.beginPath();
    ctx.moveTo(W/2+Math.cos(a)*120,H/2+Math.sin(a)*80);
    ctx.lineTo(W/2+Math.cos(a)*900,H/2+Math.sin(a)*620);
    ctx.stroke();
  }
  ctx.restore();
  if(u.phase!=='fire'){
    ctx.save();ctx.translate(W/2-200,H*0.72);ctx.scale(2.1,2.1);
    drawAuraShape(0,4,64,210,auraColor(u.att),game.frame,0.6);
    drawFighterView(fakeFighter(u.att.ci,u.att.form,'beam',1));
    ctx.restore();
    ctx.save();ctx.translate(W/2+330,H*0.72);ctx.scale(1.6,1.6);
    drawFighterView(fakeFighter(u.def.ci,u.def.form,'block',-1));
    ctx.restore();
  }else{
    // giant beam across the screen
    ctx.save();
    const bw2=90+Math.sin(u.t*0.4)*14;
    ctx.globalCompositeOperation='lighter';
    ctx.fillStyle=auraColor(u.att);
    ctx.globalAlpha=0.5;ctx.fillRect(140,H*0.55-bw2,W,bw2*2);
    ctx.globalAlpha=1;ctx.fillStyle='#fff';
    ctx.fillRect(140,H*0.55-bw2*0.45,W,bw2*0.9);
    ctx.restore();
    ctx.save();ctx.translate(180,H*0.85);ctx.scale(2.1,2.1);
    drawFighterView(fakeFighter(u.att.ci,u.att.form,'beam',1));
    ctx.restore();
    if(u.t>20){
      ctx.save();ctx.translate(W-260,H*0.55);ctx.scale(1.6,1.6);
      drawFighterView({...fakeFighter(u.def.ci,u.def.form,'launched',-1),flashT:u.t%4});
      ctx.restore();
    }
  }
  outlineText(u.att.char.ult,W/2,80,48,auraColor(u.att),'center',true);
  if(u.phase==='round'||u.phase==='reveal'){
    const opts=ROUND_OPTS[u.round];
    const AR={left:'←',up:'↑',right:'→',down:'↓'};
    // round progress dots
    for(let i=0;i<3;i++){
      ctx.fillStyle=i<u.round?'#ffd24a':'#3a3a55';
      ctx.beginPath();ctx.arc(W/2-40+i*40,130,12,0,TAU);ctx.fill();
      ctx.lineWidth=3;ctx.strokeStyle='#141418';ctx.stroke();
    }
    const attHuman=!u.att.isCPU,defHuman=!u.def.isCPU;
    const both=attHuman&&defHuman;
    let msg;
    if(both)msg='ATTACKER: pick to strike · DEFENDER: match to block!';
    else if(attHuman)msg="PICK AN ARROW — don't let them match it!";
    else msg='MATCH THEIR ARROW TO BLOCK THE ULTIMATE!';
    outlineText(msg,W/2,H-215,22,'#fff');
    const n=opts.length,sp=112;
    const cx0=W/2-(n-1)*sp/2;
    for(let i=0;i<n;i++){
      const x=cx0+i*sp,y=H-115;
      const humanPick=both?-1:(attHuman?u.pickA:u.pickD);
      const sel=u.phase==='round'&&humanPick===i;
      const revA=u.phase==='reveal'&&u.pickA===i;
      const revD=u.phase==='reveal'&&u.pickD===i;
      ctx.fillStyle=sel?'#ffd24a':
        (revA&&revD?'#ff5030':(revA?'rgba(255,210,74,0.92)':(revD?'rgba(143,212,255,0.92)':'rgba(20,20,40,0.85)')));
      ctx.fillRect(x-44,y-40,88,80);
      ctx.lineWidth=4;ctx.strokeStyle=(sel||revA||revD)?'#fff':'#5a5a80';
      ctx.strokeRect(x-44,y-40,88,80);
      outlineText(AR[opts[i]],x,y,40,(sel||revA||revD)?'#141418':'#fff');
    }
    if(both){
      const p1pick=u.att===game.p1?u.pickA:u.pickD;
      const p2pick=u.att===game.p2?u.pickA:u.pickD;
      outlineText('P1 '+(u.att===game.p1?'ATTACK':'DEFEND')+(p1pick>=0?' · LOCKED':''),W/2-380,H-115,15,'#ffd24a');
      outlineText('P2 '+(u.att===game.p2?'ATTACK':'DEFEND')+(p2pick>=0?' · LOCKED':''),W/2+380,H-115,15,'#8fd4ff');
    }
    if(u.phase==='round'){
      ctx.fillStyle='#141418';ctx.fillRect(W/2-160,H-185,320,10);
      ctx.fillStyle='#ff5030';ctx.fillRect(W/2-160,H-185,320*(1-u.t/60),10);
    }else{
      outlineText(u.pickA===u.pickD?'BLOCKED!':'ADVANCE!',W/2,H-185,34,
        u.pickA===u.pickD?'#8fd4ff':'#ffd24a','center',true);
    }
  }
  if(game.flash>0&&SETTINGS.flash){ctx.fillStyle='rgba(255,255,255,'+(game.flash/8)+')';ctx.fillRect(0,0,W,H);}
  drawCallout();
}
