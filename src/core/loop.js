/* Fixed-timestep game loop (60 Hz simulation, rAF-paced rendering). */
export function startLoop(step,render){
  let last=0,acc=0;
  function loop(ts){
    requestAnimationFrame(loop);
    if(!last)last=ts;
    let dt=(ts-last)/1000;last=ts;
    if(dt>0.05)dt=0.05;
    acc+=dt;
    while(acc>=1/60){acc-=1/60;step();}
    render();
  }
  requestAnimationFrame(loop);
}
