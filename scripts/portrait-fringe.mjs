// Secondary decontamination of semi-transparent, neutral hair edge pixels.
// Read an immutable matte, never broaden alpha, never move any landmarks.
export function refinePresentFringe(data,w,h){
 const source=Buffer.from(data),out=Buffer.from(data);
 const sy=h/850, sx=w/1070, radius=Math.max(2,Math.round(3*Math.min(sx,sy)));
 const lo=Math.max(radius,Math.floor(80*sy)),hi=Math.min(h-radius-1,Math.floor(245*sy));
 const lum=(r,g,b)=>.2126*r+.7152*g+.0722*b;
 let count=0;
 for(let y=lo;y<=hi;y++)for(let x=radius;x<w-radius;x++){
  const i=(y*w+x)*4,r=source[i],g=source[i+1],b=source[i+2],a=source[i+3];
  const L=lum(r,g,b),chroma=Math.max(r,g,b)-Math.min(r,g,b);
  if(a<5||a>=250||L<80||chroma>Math.max(20,L*.16))continue;
  let transparent=false,sum=[0,0,0],weight=0;
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
   const dist=dx*dx+dy*dy;if(dist>radius*radius)continue;
   const j=((y+dy)*w+x+dx)*4;
   if(source[j+3]<35)transparent=true;
   const l=lum(source[j],source[j+1],source[j+2]);
   if(source[j+3]>=210&&l<95){const k=1/(1+dist);for(let c=0;c<3;c++)sum[c]+=source[j+c]*k;weight+=k;}
  }
  if(!transparent||weight===0)continue;
  const dark=sum.map(v=>v/weight),dl=lum(...dark);
  if(L-dl<24)continue;
  const blend=Math.min(.83,Math.max(0,(L-dl-18)/100))*(1-.25*a/255);
  for(let c=0;c<3;c++)out[i+c]=Math.round(source[i+c]*(1-blend)+dark[c]*blend);
  count++;
 }
 return {data:out,changed:count};
}
