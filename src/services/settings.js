/* Persistent user settings (localStorage). */
import {setSoundEnabled} from './audio.js';

export const SETTINGS={sound:true,shake:true,flash:true};
try{Object.assign(SETTINGS,JSON.parse(localStorage.getItem('hkl_settings')||'{}'));}catch(e){}

export function saveSettings(){
  try{localStorage.setItem('hkl_settings',JSON.stringify(SETTINGS));}catch(e){}
}

export function applySound(){setSoundEnabled(SETTINGS.sound);}
