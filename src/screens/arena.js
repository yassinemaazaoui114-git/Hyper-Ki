/* Arena screen: the in-fight composite (stage, fighters, fx, HUD)
   plus the clash overlay, vanish prompts, and the pause menu. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {BINDS,keyLabel} from '../services/bindings.js';
import {worldBegin,worldEnd} from '../world/camera.js';
import {drawSky,drawGround,drawShadow} from '../render/stageDraw.js';
import {drawFighterView,drawAura} from '../render/fighterDraw.js';
import {drawParticles,drawProjectiles,drawBeams,drawClashWorld,drawSpeedlines} from '../render/fxDraw.js';
import {drawHUD,drawAnnouncer,drawCallout} from '../render/hud.js';
import {outlineText} from '../render/text.js';
import {drawMoveList} from './moveList.js';

export function drawArena(){
  const p1=game.p1,p2=game.p2;
  drawSky();
  worldBegin();
  drawGround();
  drawShadow(p1);drawShadow(p2);
  for(const g of game.ghosts){
    ctx.save();ctx.globalAlpha=(1-g.t/13)*0.4;
    drawFighterView({...g,tint:g.tint});
    ctx.restore();
  }
  drawAura(p1);drawAura(p2);
  drawFighterView(p2);
  drawFighterView(p1);
  drawBeams();
  if(game.state==='clash')drawClashWorld();
  drawProjectiles();
  drawParticles();
  // vanish window prompt (human players only)
  if(game.frame%8<5)for(const f of [p1,p2]){
    if(f.vanishW>0&&!f.isCPU&&f.ki>=1+0.5*game.vanishChain){
      const B=BINDS[f===p1?'p1':'p2'];
      outlineText('['+keyLabel(B.guard)+'] VANISH!',f.x,-(f.y+205*f.scl),20,'#9fe8ff');
    }
  }
  for(const t of game.dmgTexts){
    ctx.save();
    ctx.globalAlpha=Math.max(0,1-t.t/50);
    outlineText(t.txt,t.x,t.y-t.t*0.9,t.big?26:18,
      t.chip?'#9fb8d8':(t.big?'#ff8a4a':'#fff'));
    ctx.restore();
  }
  worldEnd();
  drawSpeedlines();
  drawHUD();
  drawAnnouncer();
  drawCallout();
  if(game.state==='clash'){
    const c=game.clash;
    if(game.frame%14<9){
      if(game.mode==='2p'){
        outlineText('P1 MASH ['+keyLabel(BINDS.p1.punch)+']!',W/2-330,H-90,28,c.a.color,'center',true);
        outlineText('P2 MASH ['+keyLabel(BINDS.p2.punch)+']!',W/2+330,H-90,28,c.b.color,'center',true);
      }else outlineText('MASH ['+keyLabel(BINDS.p1.punch)+']!',W/2,H-90,40,'#ffd24a','center',true);
    }
    // tug meter
    ctx.fillStyle='#141418';ctx.fillRect(W/2-262,H-62,524,26);
    ctx.fillStyle=c.b.color;ctx.fillRect(W/2-256,H-56,512,14);
    ctx.fillStyle=c.a.color;ctx.fillRect(W/2-256,H-56,512*c.meter,14);
  }
  if(game.paused){
    if(game.pauseView===1){drawMoveList();return;}
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,W,H);
    outlineText('PAUSED',W/2,H/2-130,56,'#fff','center',true);
    ['RESUME','MOVE LIST','QUIT MATCH'].forEach((s,i)=>{
      const sel=game.pauseSel===i;
      const y=H/2-40+i*60;
      if(sel){
        ctx.fillStyle='rgba(255,210,74,0.16)';
        ctx.fillRect(W/2-190,y-26,380,52);
      }
      outlineText((sel?'▶  ':'')+s+(sel?'  ◀':''),W/2,y,sel?30:24,sel?'#ffd24a':'#c8c8dc');
    });
    outlineText('↑↓ select · ENTER confirm · ESC resume',W/2,H/2+160,16,'#e8e8f0');
  }
}
