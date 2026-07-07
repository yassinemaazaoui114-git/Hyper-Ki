/* Melee attack frame-data.
   start/act/rec are frames; rng is reach; kb knockback; st hitstun.
   Flags: heavy (screen fx), launch (juggle starter), smash (spike down),
   thr (throw: unblockable grab), van (opens vanish window on hit),
   vanish (is a vanish counter-strike), crush (guard crush), next (chain link). */
export const ATK={
 p1:{dmg:18,start:4,act:4,rec:8, rng:78,kb:2.5,st:16,pose:'punchA',next:'p2',lunge:5},
 p2:{dmg:20,start:4,act:4,rec:9, rng:82,kb:3,  st:17,pose:'punchB',next:'p3',lunge:5},
 p3:{dmg:24,start:5,act:4,rec:10,rng:88,kb:4,  st:19,pose:'kick',  next:'p4',lunge:6},
 p4:{dmg:32,start:6,act:5,rec:14,rng:96,kb:13, st:24,pose:'kickBig',heavy:1,van:1,lunge:7},
 k1:{dmg:24,start:6,act:5,rec:11,rng:92,kb:4,  st:19,pose:'kick',  next:'k2',lunge:6},
 k2:{dmg:30,start:7,act:5,rec:14,rng:98,kb:11, st:22,pose:'kickBig',heavy:1,van:1,lunge:7},
 launcher:{dmg:28,start:8,act:5,rec:17,rng:84,kb:2,st:24,pose:'launcher',launch:1,heavy:1,lunge:5},
 air:{dmg:24,start:5,act:6,rec:10,rng:88,kb:7,st:18,pose:'kick',lunge:3},
 smash:{dmg:34,start:6,act:6,rec:14,rng:115,kb:5,st:26,pose:'smash',smash:1,heavy:1,lunge:2},
 throw:{dmg:45,start:8,act:4,rec:20,rng:88,kb:13,st:0,pose:'grab',thr:1,lunge:4},
 vanish:{dmg:30,start:3,act:5,rec:14,rng:95,kb:15,st:0,pose:'smash',heavy:1,van:1,vanish:1,lunge:6},
 heavy:{dmg:40,start:8,act:5,rec:18,rng:100,kb:16,st:0,pose:'kickBig',heavy:1,van:1,crush:1,lunge:8},
};
