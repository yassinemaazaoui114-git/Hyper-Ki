/* VS splash shown between select and the fight. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
import {STAGES} from '../data/stages.js';
import {DIFF} from '../data/modes.js';
import {drawSky} from '../render/stageDraw.js';
import {drawFighterView,fakeFighter} from '../render/fighterDraw.js';
import {outlineText} from '../render/text.js';

export function drawVS(){
  drawSky();
  ctx.fillStyle='rgba(10,8,24,0.7)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,127,36,0.25)';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(W*0.58,0);ctx.lineTo(W*0.42,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(300,H*0.78);ctx.scale(1.9,1.9);
  drawFighterView(fakeFighter(game.p1i,0,'idle',1));
  ctx.restore();
  ctx.save();ctx.translate(W-300,H*0.78);ctx.scale(1.9,1.9);
  drawFighterView(fakeFighter(game.p2i,0,'idle',-1));
  ctx.restore();
  outlineText(CHARS[game.p1i].name,300,120,44,'#ffd24a','center',true);
  outlineText(CHARS[game.p2i].name,W-300,120,44,'#c9a6ff','center',true);
  const pop=1+0.5*Math.max(0,1-game.t/10);
  ctx.save();ctx.translate(W/2,H/2);ctx.scale(pop,pop);
  outlineText('VS',0,0,120,'#ff5030','center',true);
  ctx.restore();
  const tl=game.timeLimit===Infinity?'∞':game.timeLimit+'s';
  outlineText((game.mode==='2p'?'2P VERSUS':DIFF[game.diff].name)+' · '+STAGES[game.stageI].name+' · TIME '+tl,W/2,H-50,18,'#e8e8f0');
}
