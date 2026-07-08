/* Pre-match settings: stage, time limit, difficulty (arcade only). */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
import {STAGES} from '../data/stages.js';
import {DIFF,TIMES} from '../data/modes.js';
import {drawSky} from '../render/stageDraw.js';
import {outlineText} from '../render/text.js';

export function drawMSettings(){
  drawSky();
  ctx.fillStyle='rgba(12,10,26,0.66)';ctx.fillRect(0,0,W,H);
  outlineText('MATCH SETTINGS',W/2,72,42,'#ffd24a','center',true);
  const modeLabel=game.mode==='train'?'  ·  TRAINING':game.mode==='2p'?'  ·  2 PLAYERS':'  ·  VS CPU';
  outlineText(CHARS[game.p1i].name+'   VS   '+CHARS[game.p2i].name+modeLabel,W/2,128,20,'#cfe8ff');
  const rows=[['STAGE',STAGES[game.stageI].name]];
  if(game.mode!=='train')rows.push(['TIME',TIMES[game.timeIdx]===Infinity?'∞  NO LIMIT':TIMES[game.timeIdx]+' SECONDS']);
  if(game.mode==='1p')rows.push(['DIFFICULTY',DIFF[game.selDiff].name]);
  rows.forEach((r,i)=>{
    const sel=game.msRow===i;
    const y=200+i*84;
    ctx.fillStyle=sel?'rgba(70,50,110,0.9)':'rgba(24,22,44,0.8)';
    ctx.fillRect(W/2-360,y-32,720,64);
    ctx.lineWidth=sel?4:2;
    ctx.strokeStyle=sel?(game.frame%30<15?'#ffd24a':'#fff'):'#454560';
    ctx.strokeRect(W/2-360,y-32,720,64);
    outlineText(r[0],W/2-330,y,20,sel?'#ffd24a':'#9a9ab8','left');
    outlineText((sel?'◀   ':'')+r[1]+(sel?'   ▶':''),W/2+330,y,21,'#fff','right');
  });
  // stage preview
  const S=STAGES[game.stageI];
  const pw=340,ph=110,px=W/2-pw/2,py=200+rows.length*84+8;
  const g=ctx.createLinearGradient(0,py,0,py+ph);
  g.addColorStop(0,S.skyTop);g.addColorStop(0.6,S.horizon);g.addColorStop(1,S.skyBot);
  ctx.fillStyle=g;ctx.fillRect(px,py,pw,ph);
  ctx.fillStyle=S.mesa;
  ctx.beginPath();
  ctx.moveTo(px+42,py+ph-24);ctx.lineTo(px+62,py+ph-64);
  ctx.lineTo(px+122,py+ph-64);ctx.lineTo(px+142,py+ph-24);
  ctx.closePath();ctx.fill();
  ctx.fillStyle=S.ground;ctx.fillRect(px,py+ph-24,pw,24);
  ctx.lineWidth=3;ctx.strokeStyle='#ffd24a';ctx.strokeRect(px,py,pw,ph);
  outlineText('↑↓ row · ←→ change · ENTER — FIGHT! · ESC — back',W/2,H-46,18,'#e8e8f0');
}
