/* Audio engine: Web Audio synthesis only, zero assets.
   Owns the AudioContext lifecycle and the SFX bank.
   Volume policy is injected via setSoundEnabled (settings stays decoupled). */
let AC=null,masterG=null,muted=false,enabled=true,noiseBuf=null;

export function initAudio(){
  if(AC)return;
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    masterG=AC.createGain();
    masterG.gain.value=enabled?0.5:0;
    masterG.connect(AC.destination);
  }catch(e){}
}

export function setSoundEnabled(on){
  enabled=on;muted=!on;
  if(masterG)masterG.gain.value=on?0.5:0;
}

/** Current audio clock (0 before init) — for scheduling multi-note cues. */
export function audioTime(){return AC?AC.currentTime:0;}

export function tone(f,dur,type,vol,slide,at,dest){
  if(!AC||muted)return;
  const t=at||AC.currentTime;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type=type||'square';
  o.frequency.setValueAtTime(Math.max(20,f),t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),t+dur);
  g.gain.setValueAtTime(vol||0.2,t);
  g.gain.exponentialRampToValueAtTime(0.0008,t+dur);
  o.connect(g);g.connect(dest||masterG);
  o.start(t);o.stop(t+dur+0.05);
}

function getNoise(){
  if(!noiseBuf){
    noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);
    const d=noiseBuf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  }
  return noiseBuf;
}

export function noiseHit(dur,vol,freq,at,dest){
  if(!AC||muted)return;
  const t=at||AC.currentTime;
  const s=AC.createBufferSource();s.buffer=getNoise();s.loop=true;
  const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=0.7;
  const g=AC.createGain();
  g.gain.setValueAtTime(vol,t);
  g.gain.exponentialRampToValueAtTime(0.0008,t+dur);
  s.connect(f);f.connect(g);g.connect(dest||masterG);
  s.start(t);s.stop(t+dur+0.05);
}

export const SFX={
  hit(){noiseHit(0.12,0.5,900);tone(160,0.1,'square',0.25,-90);},
  heavy(){noiseHit(0.25,0.7,500);tone(90,0.25,'square',0.35,-55);},
  swing(){noiseHit(0.07,0.16,2600);},
  guard(){tone(700,0.06,'square',0.14,200);noiseHit(0.05,0.2,3000);},
  blast(){tone(880,0.12,'sawtooth',0.18,-500);},
  blastHit(){noiseHit(0.15,0.4,1400);},
  beam(){tone(70,0.9,'sawtooth',0.35,40);noiseHit(0.9,0.35,300);},
  tp(){tone(400,0.15,'sine',0.25,900);},
  cancel(){tone(750,0.09,'square',0.18,600);noiseHit(0.05,0.15,4000);},
  select(){tone(600,0.07,'square',0.16,300);},
  confirm(){tone(500,0.1,'square',0.18,400);tone(760,0.12,'square',0.18,400,audioTime()+0.08);},
  announce(){tone(200,0.3,'sawtooth',0.28,-120);noiseHit(0.3,0.3,700);},
  ko(){tone(60,1.2,'sawtooth',0.45,-30);noiseHit(1.0,0.55,250);},
  transform(){tone(150,0.7,'sawtooth',0.28,600);noiseHit(0.6,0.3,900);},
  rush(){noiseHit(0.3,0.5,600);tone(120,0.3,'square',0.3,80);},
  ult(){tone(50,1.6,'sawtooth',0.45,25);noiseHit(1.4,0.5,200);},
};

/* Continuous hum while a fighter charges ki (node stored on the fighter). */
export function startChargeHum(f){
  if(!AC||muted||f.chargeOsc)return;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type='sawtooth';o.frequency.value=55;
  g.gain.value=f.isCPU?0.04:0.09;
  o.connect(g);g.connect(masterG);o.start();
  f.chargeOsc={o,g};
}
export function stopChargeHum(f){
  if(f&&f.chargeOsc){try{f.chargeOsc.o.stop();}catch(e){}f.chargeOsc=null;}
}
