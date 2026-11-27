// Correct pale matte contamination in the registered 1070x850 cutouts.
// Never expand existing alpha. Preserve dark strands, skin and clothing.
const clamp=(x,lo=0,hi=1)=>Math.max(lo,Math.min(hi,x));
const lum=(r,g,b)=>.2126*r+.7152*g+.0722*b;
export function refinePortraitRGBA(input,w,h,{kind="present"}={}){
 if(input.length!==w*h*4)throw new Error("Expected RGBA pixels");
 const out=Buffer.from(input),sx=w/1070,sy=h/850;
 const upper=Math.min(h-1,Math.floor((kind==="future"?510:444)*sy));
 const yStart=Math.max(0,Math.floor((kind==="future"?12:88)*sy));
 const d=new Uint16Array(w*(upper+1));d.fill(65535);
 for(let y=0;y<=upper;y++)for(let x=0;x<w;x++){
  const p=y*w+x,i=p*4;
  if(input[i+3]>=100&&lum(input[i],input[i+1],input[i+2])<105)d[p]=0;
 }
 for(let y=0;y<=upper;y++)for(let x=0;x<w;x++){
  const p=y*w+x;let v=d[p];if(x)v=Math.min(v,d[p-1]+1);if(y)v=Math.min(v,d[p-w]+1);d[p]=v;
 }
 for(let y=upper;y>=0;y--)for(let x=w-1;x>=0;x--){
  const p=y*w+x;let v=d[p];if(x+1<w)v=Math.min(v,d[p+1]+1);if(y<upper)v=Math.min(v,d[p+w]+1);d[p]=v;
 }
 let changed=0,removed=0;
 for(let y=yStart;y<=upper;y++)for(let x=0;x<w;x++){
  const p=y*w+x,i=p*4,r=input[i],g=input[i+1],b=input[i+2],a=input[i+3];
  if(!a)continue;
  const L=lum(r,g,b),chroma=Math.max(r,g,b)-Math.min(r,g,b);
  // Exclude warm skin and gold tassel, and keep interior hair texture.
  if(L<116||chroma>Math.max(15,L*.105))continue;
  const dist=d[p]/Math.max(.1,Math.min(sx,sy));
  if(L<170&&dist<=3&&a>=248)continue;
  // Neutral studio backdrop is mixed into these edge colors.
  const coverage=clamp((227-L)/(227-55));
  const matte=coverage<.075?0:coverage;
  const alpha=Math.round(Math.min(a,255*matte));
  if(alpha>=a)continue;
  changed++;
  if(alpha<=2){out[i]=out[i+1]=out[i+2]=out[i+3]=0;removed++;continue}
  const divisor=Math.max(.08,matte);
  for(let c=0;c<3;c++)out[i+c]=Math.round(clamp((input[i+c]-227*(1-divisor))/divisor,22,145));
  out[i+3]=alpha;
 }
 return {data:out,changed,removed};
}
