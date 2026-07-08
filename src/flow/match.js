/* Match lifecycle: setup, the fight step, pause menu, KO, and victory. */
import {game,other,setAnn} from '../core/state.js';
import {clamp,rand} from '../core/math.js';
import {CHARS} from '../data/characters.js';
import {TIMES} from '../data/modes.js';
import {pressed} from '../input/keyboard.js';
import {humanIntent} from '../input/intents.js';
import {aiUpdate} from '../ai/cpu.js';
import {dummyIntent,DUMMY_BEHAVIORS} from '../ai/dummy.js';
import {recordInput} from '../world/inputlog.js';
import {recordResult,recordLadderClear,recordPick,unlockSkin} from '../services/profile.js';
import {makeFighter} from '../world/fighter.js';
import {updateFighter} from '../world/fighterUpdate.js';
import {updatePose} from '../world/animation.js';
import {updateProjectiles} from '../world/projectiles.js';
import {updateBeams} from '../world/beams.js';
import {updateCam} from '../world/camera.js';
import {POSES,clonePose} from '../data/poses.js';
import {SFX,stopChargeHum,tone,audioTime} from '../services/audio.js';

export function startMatch(){
  game.p1=makeFighter(game.p1i,-260,1,false,game.skin1);
  game.p2=makeFighter(game.p2i,260,-1,game.mode!=='2p',game.skin2);
  game.projs.length=0;game.beams.length=0;game.parts.length=0;game.ghosts.length=0;
  game.dmgTexts.length=0;
  game.inputLog.length=0;game.frameAdv=null;
  game.timeLimit=game.mode==='train'?Infinity:TIMES[game.timeIdx];
  game.timer=game.timeLimit===Infinity?Infinity:game.timeLimit;
  game.timerAcc=0;
  game.cam.x=0;game.cam.y=0;game.cam.z=1;game.cam.shake=0;
  game.clash=null;game.rush=null;game.ult=null;game.winner=null;
  game.koDramatic=false;game.bigHit=false;
  game.vanishChain=0;game.vanishFxT=0;
  game.ann=null;game.callout=null;game.paused=false;
  game.state='vs';game.t=0;
}

/* Arcade ladder: fight every other character in order, difficulty ramping. */
export function startLadder(){
  const q=[];
  for(let i=0;i<CHARS.length;i++)if(i!==game.p1i)q.push(i);
  game.ladder={queue:q,idx:0,baseDiff:game.selDiff};
  game.p2i=q[0];
  game.diff=game.selDiff;
  recordPick(game.p1i);
  startMatch();
}

export function stepReady(){
  game.t++;
  updatePose(game.p1);updatePose(game.p2);
  if(game.t===1)setAnn('READY?',55,'#fff');
  if(game.t===62){setAnn('FIGHT!',35,'#ffd24a');SFX.announce();}
  if(game.t>=95)game.state='fight';
  updateCam();
}

export function stepFight(){
  const p1=game.p1,p2=game.p2;
  if(game.paused){stepPauseMenu();return;}
  if(pressed.start||pressed.back){game.paused=true;game.pauseSel=0;game.pauseView=0;SFX.select();return;}
  humanIntent(p1,'');
  if(game.mode==='2p')humanIntent(p2,'2');
  else if(game.mode==='train')dummyIntent(p2,p1); // training dummy behavior
  else aiUpdate(p2,p1);
  updateFighter(p1,p2);
  updateFighter(p2,p1);
  // push overlapping fighters apart
  if(p1.y<=0&&p2.y<=0&&p1.state!=='down'&&p2.state!=='down'){
    const dx=p2.x-p1.x;
    if(Math.abs(dx)<46){
      const push=(46-Math.abs(dx))/2*(dx>=0?1:-1);
      p1.x-=push;p2.x+=push;
      p1.x=clamp(p1.x,-1080,1080);p2.x=clamp(p2.x,-1080,1080);
    }
  }
  updateProjectiles();
  updateBeams();
  // combo bookkeeping: a combo ends once the victim regains control
  for(const f of [p1,p2]){
    if(f.comboHits>0){
      const d=other(f);
      if(game.frame-f.comboLast>28&&d.state!=='hurt'&&d.state!=='launched'){
        if(f.comboHits>=2)f.comboFade={hits:f.comboHits,dmg:Math.round(f.comboDmg),t:0};
        f.comboHits=0;f.comboDmg=0;
      }
    }
    if(f.comboFade&&++f.comboFade.t>50)f.comboFade=null;
  }
  // training: fighters heal back to full when left alone so practice never ends
  if(game.mode==='train'){
    for(const f of [p1,p2]){
      if(game.frame-f.lastHitFrame>50&&f.hp<f.maxhp){
        f.hp=Math.min(f.maxhp,f.hp+f.maxhp/90);
        if(f.hp>=f.maxhp)f.gray=0;
      }
    }
    recordInput();
    if(game.frameAdv&&++game.frameAdv.t>90)game.frameAdv=null;
  }
  updateCam();
  if(game.timeLimit!==Infinity){
    game.timerAcc++;
    if(game.timerAcc>=60){
      game.timerAcc=0;game.timer--;
      if(game.timer<=0)timeUp();
    }
  }
}

export function stepPauseMenu(){
  if(game.pauseView===1){ // move list open
    if(pressed.back||pressed.start){game.pauseView=0;SFX.select();}
    return;
  }
  const train=game.mode==='train';
  const n=train?4:3;               // extra DUMMY row in training
  const quitIdx=n-1;
  if(pressed.up||pressed.up2){game.pauseSel=(game.pauseSel+n-1)%n;SFX.select();}
  if(pressed.down||pressed.down2){game.pauseSel=(game.pauseSel+1)%n;SFX.select();}
  // cycle dummy behavior on its row
  if(train&&game.pauseSel===2){
    const d=((pressed.right||pressed.right2)?1:0)-((pressed.left||pressed.left2)?1:0);
    if(d){game.dummyBehavior=(game.dummyBehavior+d+DUMMY_BEHAVIORS.length)%DUMMY_BEHAVIORS.length;SFX.select();}
  }
  if(pressed.back){game.paused=false;SFX.select();return;}
  if(pressed.start||pressed.punch||pressed.punch2){
    if(game.pauseSel===0){SFX.confirm();game.paused=false;}
    else if(game.pauseSel===1){SFX.confirm();game.pauseView=1;}
    else if(train&&game.pauseSel===2){game.dummyBehavior=(game.dummyBehavior+1)%DUMMY_BEHAVIORS.length;SFX.select();}
    else if(game.pauseSel===quitIdx){
      SFX.confirm();game.paused=false;game.ladder=null;
      stopChargeHum(game.p1);stopChargeHum(game.p2);
      game.state='select';game.selPhase=0;
    }
  }
}

export function timeUp(){
  const p1=game.p1,p2=game.p2;
  const r1=p1.hp/p1.maxhp,r2=p2.hp/p2.maxhp;
  game.winner=r1>=r2?p1:p2;
  game.koMode='time';game.state='ko';game.koT=0;game.koDramatic=false;
  if(game.mode==='1p')recordResult(game.winner===p1);
  setAnn('TIME UP!',999,'#ffd24a');SFX.announce();
  stopChargeHum(p1);stopChargeHum(p2);
}

export function stepKO(){
  const p1=game.p1,p2=game.p2;
  const dramatic=game.koDramatic;
  game.koT++;
  // dramatic finishes crawl in deep slow-mo, then ease back to normal
  const slowMod=dramatic?(game.koT<130?5:2):3;
  if(game.koT%slowMod===0){
    p1.intent={};p2.intent={};
    updateFighter(p1,p2);updateFighter(p2,p1);
  }
  const loser=game.winner===p1?p2:p1;
  const tz=dramatic?1.45:1.15;
  game.cam.x+=(clamp(loser.x,-620,620)-game.cam.x)*0.1;
  game.cam.z+=(tz-game.cam.z)*(dramatic?0.05:0.06);
  if(game.koT>=(dramatic?210:(game.koMode==='ko'?150:90))){
    game.state='victory';game.t=0;game.ann=null;game.koDramatic=false;
    game.winner.state='victory';
    game.winner.pose=clonePose(POSES.idle);
    tone(392,0.15,'square',0.2,0);
    tone(523,0.15,'square',0.2,0,audioTime()+0.15);
    tone(659,0.35,'square',0.2,0,audioTime()+0.3);
  }
}

export function stepVictory(){
  game.t++;
  updatePose(game.winner);
  if(game.ladder){
    const won=game.winner===game.p1;
    const more=game.ladder.idx<game.ladder.queue.length-1;
    if(pressed.start){
      SFX.confirm();
      if(won&&more){ // advance to the next, harder opponent
        game.ladder.idx++;
        game.p2i=game.ladder.queue[game.ladder.idx];
        game.diff=Math.min(2,game.ladder.baseDiff+game.ladder.idx);
        startMatch();
      }else{ // ladder cleared, or defeated -> back to title
        if(won&&!more){recordLadderClear();unlockSkin(game.p1i);}
        game.ladder=null;game.state='title';game.titleSel=0;game.t=0;
      }
    }
    if(pressed.back){SFX.select();game.ladder=null;game.state='select';game.selPhase=0;}
    return;
  }
  if(pressed.start){SFX.confirm();startMatch();}
  if(pressed.back){SFX.select();game.state='select';game.selPhase=0;}
}
