/* Central game state context.
   One deliberate, injected singleton instead of scattered window globals.
   Systems import { game } and read/write through it; nothing else is shared. */
export const game={
  // flow
  state:'title',t:0,frame:0,diff:1,
  // roster picks & fighters
  p1i:0,p2i:1,p1:null,p2:null,
  // menus
  mode:'1p',selIdx:0,selIdx2:1,selPhase:0,selDiff:1,titleSel:0,dummyBehavior:0,ladder:null,
  skin1:0,skin2:0,
  stageI:0,timeIdx:2,timeLimit:99,msRow:0,setSel:0,pauseSel:0,
  rbRow:0,rbCol:0,rbWait:false,pauseView:0,
  // world entities
  projs:[],beams:[],parts:[],ghosts:[],dmgTexts:[],
  inputLog:[],frameAdv:null,
  cam:{x:0,y:0,z:1,shake:0},
  // match
  timer:99,timerAcc:0,
  ann:null,callout:null,flash:0,
  clash:null,rush:null,ult:null,
  winner:null,koT:0,koMode:'ko',paused:false,
  koDramatic:false,bigHit:false,
  vanishChain:0,vanishFxT:0,
};

/** Big announcer text (READY? / FIGHT! / K.O.!). */
export function setAnn(text,dur,color){game.ann={text,t:0,dur,color:color||'#fff'};}

/** Move-name / event callout near the bottom of the screen. */
export function setCallout(text,c){game.callout={text,c:c||'#ffd24a',t:0};}

/** The opponent of a fighter (1v1). */
export function other(f){return f===game.p1?game.p2:game.p1;}
