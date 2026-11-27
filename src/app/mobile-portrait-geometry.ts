// Reference-led geometry for the original 1070 × 850 portrait assets.
// Measured visual landmarks (approximate): hair crown y=104, face/head width
// ≈400px, graduation cap apex y=20. The source image itself is not stretched.
export function mobilePortraitScale(w:number,h:number,titleBottom:number){
 const fit=Math.min(w/1070,h/850);
 if(!fit||!Number.isFinite(fit))return 1;
 const hairHeight=746,capHeight=830,headWidth=400;
 const desired=.745*h/hairHeight;
 const widthLimit=.96*w/headWidth;
 const topLimit=Math.max(1,h-titleBottom-12)/capHeight;
 return Math.max(.8,Math.min(desired,widthLimit,topLimit)/fit);
}
export function approachLook(value:number,target:number,dt:number){
 return target>value?Math.min(target,value+dt/1.18):Math.max(target,value-dt/1.18);
}
export function lookAlpha(x:number,y:number,progress:number){
 if(progress<=0)return 0;
 if(progress>=1)return 255;
 const p=progress*progress*(3-2*progress);
 const edge=-.19+1.38*p+.046*Math.sin(x*8.2+p*4)+.022*Math.sin(x*19-p*5);
 const t=Math.max(0,Math.min(1,(edge-y+.07)/.14));
 return Math.round(255*t*t*(3-2*t));
}
