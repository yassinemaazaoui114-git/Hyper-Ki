/* Stage palettes. Adding a stage = adding one palette entry. */
export const STAGES=[
 {name:'SHATTERED WASTES',skyTop:'#3f8fd4',skyMid:'#9fd4f0',horizon:'#e7d9a8',skyBot:'#d9b878',
  sun:'rgba(255,244,200,0.9)',cloud:'rgba(255,255,255,0.75)',far:'#7c96b8',mesa:'#b08a5c',
  ground:'#c9a262',groundTop:'#b8905a',crack:'rgba(90,60,30,0.4)',rock:'#a5814e',wall:'#8a6a42'},
 {name:'CRIMSON DUSK',skyTop:'#2c1a4e',skyMid:'#a8425a',horizon:'#ff9a4a',skyBot:'#c2683a',
  sun:'rgba(255,120,60,0.95)',cloud:'rgba(90,45,80,0.7)',far:'#54355c',mesa:'#6e3a3a',
  ground:'#9a5f42',groundTop:'#7e4c34',crack:'rgba(40,15,10,0.5)',rock:'#7c4634',wall:'#5e3428'},
 {name:'GLACIAL RIDGE',skyTop:'#7fb8e8',skyMid:'#cfe8f8',horizon:'#ffffff',skyBot:'#dceef8',
  sun:'rgba(255,255,255,0.9)',cloud:'rgba(255,255,255,0.9)',far:'#8fa8c8',mesa:'#a8c4dc',
  ground:'#e8f0f8',groundTop:'#c8d8ea',crack:'rgba(120,150,190,0.5)',rock:'#b8cede',wall:'#9ab4cc'},
 {name:'MOONLIT RUINS',skyTop:'#0a0e2a',skyMid:'#1c2a55',horizon:'#3a4a80',skyBot:'#2a3050',
  sun:'rgba(230,238,255,0.95)',cloud:'rgba(200,210,255,0.25)',far:'#232848',mesa:'#33395e',
  ground:'#4a4e6e',groundTop:'#3a3e58',crack:'rgba(10,10,25,0.6)',rock:'#3e4262',wall:'#2e3252'},
];

/* Deterministic ground-rock layout shared by all stages (recolored per palette). */
export const ROCKS=[];
for(let i=0;i<26;i++)ROCKS.push({x:-1050+i*84+((i*37)%40),r:6+((i*13)%14)});
