/* In-pause move list: every technique with the player's live bindings. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {BINDS,keyLabel} from '../services/bindings.js';
import {outlineText} from '../render/text.js';

export function moveRows(p){
  const B=BINDS[p],L=keyLabel;
  return [
   ['DASH','2× '+L(B.left)+' or 2× '+L(B.right)],
   ['JUMP / SIDESTEP',L(B.up)+' / '+L(B.down)],
   ['PUNCH COMBO',L(B.punch)+' ×4'],
   ['KICK COMBO',L(B.kick)+' ×2'],
   ['THROW / GUARD BREAK','hold '+L(B.guard)+' + '+L(B.punch)],
   ['KI CANCEL (0.5 KI)',L(B.guard)+' during your attack'],
   ['VANISH COUNTER (1+ KI)',L(B.guard)+' when sent flying'],
   ['CHARGED HEAVY','hold '+L(B.charge)+' + hold '+L(B.punch)+'/'+L(B.kick)+' · crushes guard'],
   ['LAUNCHER → PURSUIT','toward+'+L(B.kick)+' then '+L(B.punch)],
   ['KI BLAST','tap '+L(B.blast)],
   ['DEFLECT','strike an incoming blast with any attack'],
   ['SIGNATURE WAVE (1 KI)','toward+'+L(B.blast)+' (hold = charge)'],
   ['BEAM 1 / 2 (3/4 KI)','hold '+L(B.blast)+' / '+L(B.down)+'+hold '+L(B.blast)],
   ['CHARGE KI','hold '+L(B.charge)],
   ['GUARD','hold '+L(B.guard)],
   ['TELEPORT COUNTER (2 KI)','tap '+L(B.guard)+' on impact'],
   ['TRANSFORM (5 KI)',L(B.transform)],
   ['HYPER MODE (3 KI)',L(B.punch)+'+'+L(B.kick)+' together'],
   ['DRAGON RUSH','in HYPER: '+L(B.punch)+'+'+L(B.kick)],
   ['ULTIMATE (5 KI)','in HYPER: '+L(B.ult)+' → arrow duels'],
  ];
}

export function drawMoveList(){
  ctx.fillStyle='rgba(4,4,12,0.88)';ctx.fillRect(0,0,W,H);
  outlineText('MOVE LIST',W/2,42,32,'#ffd24a','center',true);
  const two=game.mode==='2p';
  const c1=game.p1.char;
  outlineText(c1.name+' — SIG: '+c1.sig.n+' · BEAMS: '+c1.beams.map(b=>b.n).join(' / ')+' · ULT: '+c1.ult,
    W/2,78,13,'#ffd7a8');
  if(two){
    const c2=game.p2.char;
    outlineText(c2.name+' — SIG: '+c2.sig.n+' · BEAMS: '+c2.beams.map(b=>b.n).join(' / ')+' · ULT: '+c2.ult,
      W/2,100,13,'#bfe3ff');
  }
  const r1=moveRows('p1'),r2=moveRows('p2');
  const y0=two?138:126,rowH=28;
  const lx=W/2-480;
  outlineText('MOVE',lx,y0-24,14,'#9a9ab8','left');
  outlineText('PLAYER 1',W/2-150,y0-24,14,'#ffd24a','left');
  if(two)outlineText('PLAYER 2',W/2+180,y0-24,14,'#8fd4ff','left');
  r1.forEach((r,i)=>{
    const y=y0+i*rowH;
    if(i%2===0){ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(lx-10,y-rowH/2,970,rowH);}
    outlineText(r[0],lx,y,13,'#e8e8f0','left');
    outlineText(r[1],W/2-150,y,13,'#fff','left');
    if(two)outlineText(r2[i][1],W/2+180,y,13,'#fff','left');
  });
  outlineText('ENTER or ESC — back to pause menu',W/2,H-22,14,'#bcd4ec');
}
