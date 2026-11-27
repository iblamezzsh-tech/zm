export function parseReturnMarker(value){
 if(!value||typeof value.id!=="string"||!/^[-a-z0-9]+$/.test(value.id)||![value.y,value.top,value.width,value.height].every(Number.isFinite)||value.y<0||value.width<=0||value.height<=0)return null;
 return {id:value.id,y:value.y,top:value.top,width:value.width,height:value.height};
}
export function desiredCardOffset(top,height,viewport,safe){
 // Preserve the old viewport-relative card placement when possible; when a
 // card is taller than the usable space, align its top under the header.
 const lo=Math.max(0,Math.min(viewport-1,safe));
 const hi=Math.max(lo,viewport-Math.min(height,viewport-lo)-12);
 return Math.max(lo,Math.min(hi,top));
}
