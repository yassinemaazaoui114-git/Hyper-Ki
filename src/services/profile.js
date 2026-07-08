/* Persistent player profile: lifetime stats saved to localStorage. */
export const PROFILE={games:0,wins:0,losses:0,ladderClears:0,ultimates:0,picks:{}};
try{Object.assign(PROFILE,JSON.parse(localStorage.getItem('hkl_profile')||'{}'));}catch(e){}
if(!PROFILE.picks||typeof PROFILE.picks!=='object')PROFILE.picks={};

export function saveProfile(){
  try{localStorage.setItem('hkl_profile',JSON.stringify(PROFILE));}catch(e){}
}

export function recordResult(win){
  PROFILE.games++;
  if(win)PROFILE.wins++;else PROFILE.losses++;
  saveProfile();
}
export function recordPick(ci){PROFILE.picks[ci]=(PROFILE.picks[ci]||0)+1;saveProfile();}
export function recordLadderClear(){PROFILE.ladderClears++;saveProfile();}
export function recordUltimate(){PROFILE.ultimates++;saveProfile();}

export function resetProfile(){
  PROFILE.games=0;PROFILE.wins=0;PROFILE.losses=0;
  PROFILE.ladderClears=0;PROFILE.ultimates=0;PROFILE.picks={};
  saveProfile();
}

/** Index of the most-picked character, or -1 if none yet. */
export function favoritePick(){
  let best=-1,bestN=0;
  for(const k in PROFILE.picks){
    if(PROFILE.picks[k]>bestN){bestN=PROFILE.picks[k];best=+k;}
  }
  return best;
}
