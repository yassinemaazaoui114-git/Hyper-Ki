/* Menu flow: title, character select, match settings, game settings,
   and the interactive controls/rebind screen. Step logic only — drawing
   lives in src/screens/. */
import {game} from '../core/state.js';
import {clamp,rand} from '../core/math.js';
import {CHARS} from '../data/characters.js';
import {STAGES} from '../data/stages.js';
import {TIMES} from '../data/modes.js';
import {pressed,setCaptureKey} from '../input/keyboard.js';
import {ACTIONS,assignBind,resetBinds} from '../services/bindings.js';
import {SETTINGS,saveSettings,applySound} from '../services/settings.js';
import {SFX} from '../services/audio.js';
import {startMatch} from './match.js';

export function stepTitle(){
  game.t++;
  if(pressed.up){game.titleSel=(game.titleSel+3)%4;SFX.select();}
  if(pressed.down){game.titleSel=(game.titleSel+1)%4;SFX.select();}
  if(pressed.start){
    SFX.confirm();game.t=0;
    if(game.titleSel===0){game.mode='1p';game.state='select';game.selPhase=0;}
    else if(game.titleSel===1){game.mode='2p';game.state='select';game.selPhase=0;}
    else if(game.titleSel===2){game.mode='train';game.state='select';game.selPhase=0;}
    else{game.state='settings';game.setSel=0;}
  }
}

export function stepSelect(){
  game.t++;
  if(game.selPhase===0){
    if(pressed.left){game.selIdx=(game.selIdx+CHARS.length-1)%CHARS.length;SFX.select();}
    if(pressed.right){game.selIdx=(game.selIdx+1)%CHARS.length;SFX.select();}
    if(pressed.start){
      game.p1i=game.selIdx;SFX.confirm();
      if(game.mode==='2p'||game.mode==='train')game.selPhase=1;
      else{game.p2i=Math.floor(rand(0,CHARS.length));game.state='msettings';game.msRow=0;}
    }
    if(pressed.back){SFX.select();game.state='title';}
  }else{
    if(pressed.left2||pressed.left){game.selIdx2=(game.selIdx2+CHARS.length-1)%CHARS.length;SFX.select();}
    if(pressed.right2||pressed.right){game.selIdx2=(game.selIdx2+1)%CHARS.length;SFX.select();}
    if(pressed.start||pressed.punch2){
      game.p2i=game.selIdx2;SFX.confirm();
      game.state='msettings';game.msRow=0;
    }
    if(pressed.back){SFX.select();game.selPhase=0;}
  }
}

export function stepMSettings(){
  const rows=game.mode==='train'?1:game.mode==='1p'?3:2;
  if(pressed.up||pressed.up2){game.msRow=(game.msRow+rows-1)%rows;SFX.select();}
  if(pressed.down||pressed.down2){game.msRow=(game.msRow+1)%rows;SFX.select();}
  const d=((pressed.right||pressed.right2)?1:0)-((pressed.left||pressed.left2)?1:0);
  if(d){
    SFX.select();
    if(game.msRow===0)game.stageI=(game.stageI+d+STAGES.length)%STAGES.length;
    else if(game.msRow===1)game.timeIdx=(game.timeIdx+d+TIMES.length)%TIMES.length;
    else game.selDiff=clamp(game.selDiff+d,0,2);
  }
  if(pressed.start){game.diff=game.selDiff;SFX.confirm();startMatch();}
  if(pressed.back){SFX.select();game.state='select';game.selPhase=(game.mode==='2p'||game.mode==='train')?1:0;}
}

export function stepSettings(){
  if(pressed.up){game.setSel=(game.setSel+3)%4;SFX.select();}
  if(pressed.down){game.setSel=(game.setSel+1)%4;SFX.select();}
  const tog=pressed.left||pressed.right||pressed.start;
  if(tog){
    if(game.setSel===0){SETTINGS.sound=!SETTINGS.sound;applySound();saveSettings();SFX.select();}
    else if(game.setSel===1){SETTINGS.shake=!SETTINGS.shake;saveSettings();SFX.select();}
    else if(game.setSel===2){SETTINGS.flash=!SETTINGS.flash;saveSettings();SFX.select();}
    else if(pressed.start){SFX.confirm();game.state='controls';game.rbRow=0;game.rbCol=0;game.rbWait=false;}
  }
  if(pressed.back){SFX.select();game.state='title';}
}

export function stepControls(){
  if(game.rbWait)return;
  const rows=ACTIONS.length+1; // +1 = reset row
  if(pressed.up){game.rbRow=(game.rbRow+rows-1)%rows;SFX.select();}
  if(pressed.down){game.rbRow=(game.rbRow+1)%rows;SFX.select();}
  if((pressed.left||pressed.right)&&game.rbRow<ACTIONS.length){game.rbCol=1-game.rbCol;SFX.select();}
  if(pressed.start){
    if(game.rbRow===ACTIONS.length){
      resetBinds();
    }else{
      SFX.confirm();game.rbWait=true;
      const side=game.rbCol===0?'p1':'p2';
      const act=ACTIONS[game.rbRow][0];
      setCaptureKey(k=>assignBind(side,act,k));
    }
  }
  if(pressed.back){SFX.select();game.state='settings';}
}
