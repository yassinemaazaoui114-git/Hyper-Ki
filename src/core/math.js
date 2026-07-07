/* Pure math helpers — no game knowledge, no side effects. */
export const TAU=Math.PI*2;
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const lerp=(a,b,t)=>a+(b-a)*t;
export const rand=(a,b)=>a+Math.random()*(b-a);

/** Lighten/darken a #rrggbb color by amt (-255..255). */
export function shade(hex,amt){
  const n=parseInt(hex.slice(1),16);
  let r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=clamp(r,0,255);g=clamp(g,0,255);b=clamp(b,0,255);
  return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
}

/** Horizontal distance between two entities with an x field. */
export function dist(a,b){return Math.abs(a.x-b.x);}
