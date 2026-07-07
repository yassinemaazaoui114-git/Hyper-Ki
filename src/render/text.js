/* Outlined display text used across HUD, menus, and callouts. */
import {ctx} from '../core/canvas.js';

export function outlineText(txt,x,y,size,fill,align,italic){
  ctx.save();
  ctx.font=(italic?'italic ':'')+'900 '+size+'px "Arial Black",Arial,sans-serif';
  ctx.textAlign=align||'center';ctx.textBaseline='middle';
  ctx.lineWidth=Math.max(3,size*0.14);ctx.strokeStyle='#141418';
  ctx.strokeText(txt,x,y);
  ctx.fillStyle=fill;ctx.fillText(txt,x,y);
  ctx.restore();
}
