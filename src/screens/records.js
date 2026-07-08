/* RECORDS screen: lifetime player stats + favorite fighter. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {CHARS} from '../data/characters.js';
import {PROFILE,favoritePick} from '../services/profile.js';
import {drawSky} from '../render/stageDraw.js';
import {drawHead} from '../render/fighterDraw.js';
import {outlineText} from '../render/text.js';

export function drawRecords(){
  drawSky();
  ctx.fillStyle='rgba(12,10,26,0.72)';ctx.fillRect(0,0,W,H);
  outlineText('RECORDS',W/2,74,44,'#ffd24a','center',true);
  const rate=PROFILE.games?Math.round(PROFILE.wins/PROFILE.games*100):0;
  const rows=[
    ['ARCADE WINS',PROFILE.wins],
    ['ARCADE LOSSES',PROFILE.losses],
    ['WIN RATE',rate+'%'],
    ['LADDER CLEARS',PROFILE.ladderClears],
    ['ULTIMATES LANDED',PROFILE.ultimates],
  ];
  rows.forEach((r,i)=>{
    const y=150+i*52;
    ctx.fillStyle='rgba(24,22,44,0.8)';ctx.fillRect(W/2-330,y-22,660,44);
    ctx.lineWidth=2;ctx.strokeStyle='#454560';ctx.strokeRect(W/2-330,y-22,660,44);
    outlineText(r[0],W/2-306,y,19,'#9a9ab8','left');
    outlineText(''+r[1],W/2+306,y,22,'#fff','right');
  });
  const fav=favoritePick();
  const fy=150+rows.length*52+18;
  outlineText('FAVORITE FIGHTER',W/2,fy,19,'#9a9ab8');
  if(fav>=0&&CHARS[fav]){
    ctx.save();ctx.translate(W/2,fy+58);ctx.scale(2.4,2.4);
    drawHead(CHARS[fav],CHARS[fav].hairC);
    ctx.restore();
    outlineText(CHARS[fav].name,W/2,fy+104,24,'#ffd24a','center',true);
  }else{
    outlineText('— none yet, go play! —',W/2,fy+44,20,'#8888a0');
  }
  outlineText('ESC — back      ·      hold ↓ + Punch — reset records',W/2,H-38,16,'#e8e8f0');
}
