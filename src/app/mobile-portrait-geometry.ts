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

// Reframe the original image, not the already zoomed hero screenshot.
// The supplied reference has a 160×185 panel on a 234×514 screen.
export function mobileCreditFrame(w:number,h:number){
 const fit=Math.min(w/1070,h/850);
 const width=Math.min(w*.69,h*.44*(160/185),360);
 const height=width*(185/160);
 const top=h*.45-height/2;
 const side=(w-width)/2;
 const bottom=h-top-height;
 const sourceFit=Math.min(height*.84/746,width*.72/400);
 return {width,height,top,side,bottom,scale:fit>0?sourceFit/fit:1};
}
