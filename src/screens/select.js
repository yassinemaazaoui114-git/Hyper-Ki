/* Character select grid (P1, then P2 in versus mode). */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
import {BINDS,keyLabel} from '../services/bindings.js';
import {drawSky} from '../render/stageDraw.js';
import {drawHead} from '../render/fighterDraw.js';
import {outlineText} from '../render/text.js';

export function drawSelect(){
  drawSky();
  ctx.fillStyle='rgba(12,10,26,0.62)';ctx.fillRect(0,0,W,H);
  const pickingP2=game.selPhase===1;
  const title=pickingP2?(game.mode==='train'?'CHOOSE THE TRAINING DUMMY':'PLAYER 2 — CHOOSE YOUR FIGHTER'):
    (game.mode==='2p'?'PLAYER 1 — CHOOSE YOUR FIGHTER':'CHOOSE YOUR FIGHTER');
  outlineText(title,W/2,64,38,pickingP2?'#8fd4ff':'#ffd24a','center',true);
  const curIdx=pickingP2?game.selIdx2:game.selIdx;
  const cw=230,chh=280,gap=32;
  const total=CHARS.length*cw+(CHARS.length-1)*gap;
  const x0=W/2-total/2;
  for(let i=0;i<CHARS.length;i++){
    const c=CHARS[i];
    const x=x0+i*(cw+gap),y=130;
    const sel=i===curIdx;
    ctx.fillStyle=sel?'rgba(70,50,110,0.9)':'rgba(24,22,44,0.85)';
    ctx.fillRect(x,y,cw,chh);
    ctx.lineWidth=sel?5:3;
    ctx.strokeStyle=sel?(game.frame%30<15?(pickingP2?'#8fd4ff':'#ffd24a'):'#fff'):'#454560';
    ctx.strokeRect(x,y,cw,chh);
    if(pickingP2&&i===game.p1i){
      ctx.fillStyle='#ffd24a';
      ctx.fillRect(x+8,y+8,44,24);
      outlineText('P1',x+30,y+20,15,'#141418');
    }
    ctx.save();
    ctx.translate(x+cw/2,y+108);ctx.scale(3.6,3.6);
    drawHead(c,c.hairC);
    ctx.restore();
    outlineText(c.name,x+cw/2,y+190,20,'#fff');
    // stat pips
    const stats=[['POW',c.pow],['DEF',c.def],['SPD',c.spd]];
    stats.forEach((s,si)=>{
      ctx.font='12px Consolas,monospace';ctx.fillStyle='#aab';ctx.textAlign='left';
      ctx.fillText(s[0],x+22,y+220+si*18);
      const pips=Math.round((s[1]-0.8)*12.5);
      for(let pi=0;pi<5;pi++){
        ctx.fillStyle=pi<pips?'#ffd24a':'#3a3a50';
        ctx.fillRect(x+64+pi*26,y+212+si*18,20,8);
      }
    });
  }
  const c=CHARS[curIdx];
  ctx.textAlign='center';
  outlineText('FORMS: '+c.forms.map(f=>f.n).join(' → '),W/2,452,15,'#cfe8ff');
  outlineText('SIGNATURE: '+c.sig.n+' · BEAMS: '+c.beams.map(b=>b.n).join(' · ')+' · ULTIMATE: '+c.ult,W/2,478,15,'#ffd7a8');
  if(pickingP2&&game.mode==='train')
    outlineText('← → pick the dummy · ENTER confirm · ESC back',W/2,H-60,18,'#e8e8f0');
  else if(pickingP2)
    outlineText('P2: '+keyLabel(BINDS.p2.left)+' / '+keyLabel(BINDS.p2.right)+' select · '
      +keyLabel(BINDS.p2.punch)+' or ENTER confirm · ESC back',W/2,H-60,18,'#e8e8f0');
  else
    outlineText('← → select · ENTER confirm · ESC back',W/2,H-60,18,'#e8e8f0');
}
