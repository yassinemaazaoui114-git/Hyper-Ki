/* Frame dispatcher: routes step() and render() to whichever
   screen/state is active. The only place that knows every state. */
import {ctx,W,H} from '../core/canvas.js';
import {game} from '../core/state.js';
import {SETTINGS} from '../services/settings.js';
import {pressed,clearPressed} from '../input/keyboard.js';
import {updateParticles,updateGhosts,updateDmgTexts} from '../world/fx.js';
import {stepReady,stepFight,stepKO,stepVictory} from './match.js';
import {stepTitle,stepSelect,stepMSettings,stepSettings,stepControls} from './screens.js';
import {stepClash} from '../minigames/clash.js';
import {stepRush} from '../minigames/rush.js';
import {stepUlt} from '../minigames/ultimate.js';
import {drawTitle} from '../screens/title.js';
import {drawSelect} from '../screens/select.js';
import {drawMSettings} from '../screens/msettings.js';
import {drawSettings} from '../screens/settingsScreen.js';
import {drawControls} from '../screens/controlsScreen.js';
import {drawVS} from '../screens/vs.js';
import {drawArena} from '../screens/arena.js';
import {drawRush} from '../screens/rushScreen.js';
import {drawUlt} from '../screens/ultScreen.js';
import {drawVictory} from '../screens/victory.js';

export function step(){
  game.frame++;
  if(game.ann){game.ann.t++;if(game.ann.t>game.ann.dur)game.ann=null;}
  if(game.callout){game.callout.t++;if(game.callout.t>80)game.callout=null;}
  if(game.flash>0)game.flash--;
  game.cam.shake*=0.85;
  if(game.cam.shake<0.3)game.cam.shake=0;
  if(game.vanishFxT>0)game.vanishFxT--;
  updateParticles();updateGhosts();updateDmgTexts();
  switch(game.state){
    case 'title':stepTitle();break;
    case 'select':stepSelect();break;
    case 'msettings':stepMSettings();break;
    case 'settings':stepSettings();break;
    case 'controls':stepControls();break;
    case 'vs':game.t++;if(game.t>100||pressed.start){game.state='ready';game.t=0;}break;
    case 'ready':stepReady();break;
    case 'fight':stepFight();break;
    case 'clash':stepClash();break;
    case 'rush':stepRush();break;
    case 'ult':stepUlt();break;
    case 'ko':stepKO();break;
    case 'victory':stepVictory();break;
  }
  clearPressed();
}

export function render(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,W,H);
  switch(game.state){
    case 'title':drawTitle();break;
    case 'select':drawSelect();break;
    case 'msettings':drawMSettings();break;
    case 'settings':drawSettings();break;
    case 'controls':drawControls();break;
    case 'vs':drawVS();break;
    case 'ready':case 'fight':case 'ko':case 'clash':drawArena();break;
    case 'rush':drawRush();break;
    case 'ult':drawUlt();break;
    case 'victory':drawVictory();break;
  }
  if(game.state!=='rush'&&game.state!=='ult'&&game.flash>0&&SETTINGS.flash){
    ctx.fillStyle='rgba(255,255,255,'+(game.flash/8)+')';
    ctx.fillRect(0,0,W,H);
  }
}
