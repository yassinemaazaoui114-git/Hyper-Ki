/* Interactive controls table: view + rebind every action per player. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {ACTIONS,BINDS,keyLabel} from '../services/bindings.js';
import {drawSky} from '../render/stageDraw.js';
import {outlineText} from '../render/text.js';

export function drawControls(){
  drawSky();
  ctx.fillStyle='rgba(8,8,18,0.84)';ctx.fillRect(0,0,W,H);
  outlineText('CONTROLS',W/2,44,32,'#ffd24a','center',true);
  outlineText('↑↓ ←→ select · ENTER rebind (then press the new key) · ESC back',W/2,78,14,'#bcd4ec');
  const x0=W/2-430,rowH=38,y0=126;
  outlineText('ACTION',x0+10,y0-28,14,'#9a9ab8','left');
  outlineText('PLAYER 1',W/2+40,y0-28,14,'#ffd24a','left');
  outlineText('PLAYER 2',W/2+280,y0-28,14,'#8fd4ff','left');
  ACTIONS.forEach((a,i)=>{
    const y=y0+i*rowH;
    if(i%2===0){ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(x0,y-rowH/2,860,rowH);}
    outlineText(a[1],x0+10,y,14,'#e8e8f0','left');
    for(const c of [0,1]){
      const bx=c===0?W/2+40:W/2+280;
      const key=BINDS[c===0?'p1':'p2'][a[0]];
      const sel=game.rbRow===i&&game.rbCol===c;
      const wait=sel&&game.rbWait;
      ctx.fillStyle=wait?'#ff5030':(sel?'#ffd24a':'rgba(30,30,55,0.9)');
      ctx.fillRect(bx-8,y-15,170,30);
      ctx.lineWidth=sel?3:2;ctx.strokeStyle=sel?'#fff':'#454560';
      ctx.strokeRect(bx-8,y-15,170,30);
      const txt=wait?(game.frame%30<18?'PRESS KEY…':''):keyLabel(key);
      outlineText(txt,bx+77,y,14,sel?'#141418':'#fff');
    }
  });
  const ry=y0+ACTIONS.length*rowH+8;
  const rsel=game.rbRow===ACTIONS.length;
  ctx.fillStyle=rsel?'rgba(255,210,74,0.16)':'rgba(24,22,44,0.8)';
  ctx.fillRect(W/2-180,ry-17,360,34);
  ctx.lineWidth=rsel?3:2;ctx.strokeStyle=rsel?'#ffd24a':'#454560';
  ctx.strokeRect(W/2-180,ry-17,360,34);
  outlineText('RESET TO DEFAULTS',W/2,ry,16,rsel?'#ffd24a':'#c8c8dc');
  outlineText('toward+blast = SIGNATURE · hold blast = beam · guard+punch = THROW · charge+attack (hold) = CHARGED HEAVY (crushes guard!)',W/2,ry+38,12,'#9fb8d8');
  outlineText('guard mid-attack = KI CANCEL · guard on hit = TELEPORT · guard when flying = VANISH · strike blasts = DEFLECT · ult key = ULTIMATE',W/2,ry+60,12,'#9fb8d8');
}
