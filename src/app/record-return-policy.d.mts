export type ReturnMarker={id:string;y:number;top:number;width:number;height:number};
export function parseReturnMarker(value:unknown):ReturnMarker|null;
export function desiredCardOffset(top:number,height:number,viewport:number,safe:number):number;
