/* Title screen: logo, showcase fighters, main menu, controls hint. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {VERSION} from '../config/version.js';
import {BINDS,keyLabel} from '../services/bindings.js';
import {drawSky} from '../render/stageDraw.js';
import {drawFighterView,drawAuraShape,fakeFighter} from '../render/fighterDraw.js';
import {outlineText} from '../render/text.js';

export function drawTitle(){
  drawSky();
  ctx.fillStyle='rgba(20,14,30,0.45)';ctx.fillRect(0,0,W,H);
  // showcase fighters
  ctx.save();ctx.translate(230,H*0.72);ctx.scale(1.5,1.5);
  drawAuraShape(0,4,58,190,'#ffdf4d',game.frame,0.4);
  drawFighterView(fakeFighter(0,1,'punchA',1));
  ctx.restore();
  ctx.save();ctx.translate(W-230,H*0.72);ctx.scale(1.5,1.5);
  drawAuraShape(0,4,58,190,'#c9a6ff',game.frame+30,0.4);
  drawFighterView(fakeFighter(1,0,'beam',-1));
  ctx.restore();
  // logo
  ctx.save();
  ctx.translate(W/2,170);
  ctx.rotate(-0.03);
  outlineText('HYPER KI',0,-34,86,'#ffd24a','center',true);
  outlineText('LEGENDS',0,44,96,'#ff7f24','center',true);
  ctx.restore();
  outlineText('A BUDOKAI-STYLE 2.5D FIGHTER',W/2,268,18,'#cfe8ff');
  // main menu
  const items=['ARCADE  ·  VS CPU','VERSUS  ·  2 PLAYERS','TRAINING  ·  PRACTICE','SETTINGS'];
  items.forEach((s,i)=>{
    const sel=i===game.titleSel;
    const y=338+i*50;
    if(sel){
      ctx.fillStyle='rgba(255,210,74,0.14)';
      ctx.fillRect(W/2-280,y-22,560,44);
    }
    outlineText((sel?'▶  ':'')+s+(sel?'  ◀':''),W/2,y,sel?28:22,sel?'#ffd24a':'#c8c8dc','center',sel);
  });
  outlineText('↑ ↓ select  ·  ENTER confirm',W/2,560,16,'#e8e8f0');
  const bl=p=>['left','right','up','down'].map(a=>keyLabel(BINDS[p][a])).join(' ')
    +' + '+['punch','kick','blast','charge','guard','transform','ult'].map(a=>keyLabel(BINDS[p][a])).join(' ');
  outlineText('P1: '+bl('p1')+'        P2: '+bl('p2'),W/2,614,15,'#bcd4ec');
  outlineText('View & rebind controls in SETTINGS → CONTROLS  ·  ENTER/ESC pauses a match',W/2,644,14,'#9fb8d8');
  outlineText(VERSION,W-14,H-16,13,'#ffd24a','right');
}
