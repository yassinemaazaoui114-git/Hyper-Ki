/* Post-match victory screen. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {auraColor} from '../world/fighter.js';
import {drawSky} from '../render/stageDraw.js';
import {drawFighterView,drawAuraShape} from '../render/fighterDraw.js';
import {outlineText} from '../render/text.js';

export function drawVictory(){
  drawSky();
  ctx.fillStyle='rgba(16,10,30,0.5)';ctx.fillRect(0,0,W,H);
  const wnr=game.winner;
  ctx.save();ctx.translate(W/2,H*0.75);ctx.scale(2.2,2.2);
  drawAuraShape(0,4,60,200,auraColor(wnr),game.frame,0.5);
  drawFighterView({...wnr,x:0,y:0,state:'victory',pose:wnr.pose});
  ctx.restore();
  outlineText(wnr.char.name+' WINS!',W/2,120,64,'#ffd24a','center',true);
  outlineText(wnr.char.quote,W/2,190,22,'#e8e8f0');
  if(game.frame%50<32)outlineText('ENTER — rematch      ESC — character select',W/2,H-46,20,'#fff');
}
