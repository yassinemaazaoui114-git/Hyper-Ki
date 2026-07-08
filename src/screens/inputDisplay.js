/* On-screen input display for training mode: a live history column of
   direction glyphs + button chips, plus the on-block frame-advantage readout. */
import {ctx,W,H} from '../core/canvas.js';
import {TAU} from '../core/math.js';
import {game} from '../core/state.js';
import {outlineText} from '../render/text.js';

const GLYPH={'0,0':'·','1,0':'→','-1,0':'←','0,-1':'↑','0,1':'↓',
  '1,-1':'↗','-1,-1':'↖','1,1':'↘','-1,1':'↙'};
const BTNCOL={P:'#ff9a3c',K:'#4fa8ff',B:'#4fd2ff',G:'#5ad27a',
  C:'#ffd24a',T:'#c98cff',U:'#ff5a5a'};

export function drawInputDisplay(){
  const log=game.inputLog;
  const x=26,y0=196,rowH=26;
  outlineText('INPUTS',x+16,y0-24,13,'#8fa8c8','left');
  for(let i=0;i<log.length;i++){
    const e=log[i];
    const y=y0+i*rowH;
    ctx.save();
    ctx.globalAlpha=Math.max(0.2,1-e.t/240);
    outlineText(GLYPH[e.dc]||'·',x+8,y,20,'#fff','center');
    let bx=x+28;
    for(const b of e.btns){
      ctx.fillStyle=BTNCOL[b]||'#fff';
      ctx.beginPath();ctx.arc(bx+9,y,10,0,TAU);ctx.fill();
      ctx.lineWidth=2;ctx.strokeStyle='#141418';ctx.stroke();
      outlineText(b,bx+9,y,13,'#141418','center');
      bx+=25;
    }
    ctx.restore();
  }
  // on-block frame advantage readout
  if(game.frameAdv){
    const v=game.frameAdv.val;
    ctx.save();ctx.globalAlpha=Math.max(0,1-game.frameAdv.t/90);
    outlineText('ON BLOCK',W/2,132,14,'#8fa8c8');
    outlineText((v>=0?'+':'')+v,W/2,158,30,v>=0?'#5ad27a':'#ff6a6a','center',true);
    ctx.restore();
  }
}
