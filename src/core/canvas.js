/* Canvas bootstrap: owns the drawing surface and letterbox scaling. */
export const W=1280,H=720;
export const cv=document.getElementById('cv');
export const ctx=cv.getContext('2d');

export function fitCanvas(){
  const s=Math.min(innerWidth/W,innerHeight/H);
  cv.style.width=(W*s)+'px';
  cv.style.height=(H*s)+'px';
}

export function initCanvas(){
  addEventListener('resize',fitCanvas);
  fitCanvas();
}
