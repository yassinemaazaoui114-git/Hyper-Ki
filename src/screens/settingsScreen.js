/* Game settings screen: sound, screen shake, hit flash, controls entry. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {drawSky} from '../render/stageDraw.js';
import {outlineText} from '../render/text.js';

export function drawSettings(){
  drawSky();
  ctx.fillStyle='rgba(12,10,26,0.7)';ctx.fillRect(0,0,W,H);
  outlineText('SETTINGS',W/2,86,46,'#ffd24a','center',true);
  const rows=[['SOUND',SETTINGS.sound?'ON':'OFF'],
              ['SCREEN SHAKE',SETTINGS.shake?'ON':'OFF'],
              ['HIT FLASH',SETTINGS.flash?'ON':'OFF'],
              ['CONTROLS · VIEW & REBIND','▶']];
  rows.forEach((r,i)=>{
    const sel=game.setSel===i;
    const y=190+i*84;
    ctx.fillStyle=sel?'rgba(70,50,110,0.9)':'rgba(24,22,44,0.8)';
    ctx.fillRect(W/2-320,y-32,640,64);
    ctx.lineWidth=sel?4:2;
    ctx.strokeStyle=sel?(game.frame%30<15?'#ffd24a':'#fff'):'#454560';
    ctx.strokeRect(W/2-320,y-32,640,64);
    outlineText(r[0],W/2-290,y,20,sel?'#ffd24a':'#9a9ab8','left');
    outlineText(r[1],W/2+290,y,21,r[1]==='OFF'?'#8888a0':'#fff','right');
  });
  outlineText('↑↓ select · ←→ or ENTER toggle · ESC — back',W/2,H-46,18,'#e8e8f0');
}
