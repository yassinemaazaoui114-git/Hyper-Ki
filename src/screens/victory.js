/* Post-match victory screen. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
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
  if(game.ladder){
    const won=wnr===game.p1;
    const last=game.ladder.idx>=game.ladder.queue.length-1;
    const total=game.ladder.queue.length;
    if(!won){
      outlineText('DEFEATED',W/2,118,60,'#ff5a5a','center',true);
      outlineText('You cleared '+game.ladder.idx+' / '+total+' matches',W/2,186,22,'#e8e8f0');
      if(game.frame%50<32)outlineText('ENTER — title      ESC — character select',W/2,H-46,20,'#fff');
    }else if(last){
      outlineText('LADDER CLEAR!',W/2,114,58,'#ffd24a','center',true);
      outlineText(wnr.char.name+' conquered the whole roster!',W/2,182,22,'#e8e8f0');
      if(game.frame%50<32)outlineText('ENTER — title',W/2,H-46,20,'#fff');
    }else{
      const nextCi=game.ladder.queue[game.ladder.idx+1];
      outlineText(wnr.char.name+' WINS!',W/2,114,56,'#ffd24a','center',true);
      outlineText('Next: '+CHARS[nextCi].name+'   ·   match '+(game.ladder.idx+2)+' / '+total,W/2,182,22,'#e8e8f0');
      if(game.frame%50<32)outlineText('ENTER — continue      ESC — quit ladder',W/2,H-46,20,'#fff');
    }
    return;
  }
  outlineText(wnr.char.name+' WINS!',W/2,120,64,'#ffd24a','center',true);
  outlineText(wnr.char.quote,W/2,190,22,'#e8e8f0');
  if(game.frame%50<32)outlineText('ENTER — rematch      ESC — character select',W/2,H-46,20,'#fff');
}
