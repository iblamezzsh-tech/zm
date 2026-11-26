import {existsSync} from "node:fs";
import {join} from "node:path";
import {certificateRecords} from "./achievements/data";
import type {RecordEntry} from "./achievements/data";
export type FeaturedRecord=RecordEntry & {chapter:string; headline:string; dateLabel:string};
const choices=[
 {id:"handball-first-place-2022",chapter:"On the court",headline:"First place.",dateLabel:"2022"},
 {id:"zakovat-best-player-2024",chapter:"Around the table",headline:"Ask better questions.",dateLabel:"2023–24"},
 {id:"informatics-olympiad-third-place",chapter:"In the classroom",headline:"Think in systems.",dateLabel:"2025–26"},
 {id:"business-studies-2026",chapter:"Beyond the classroom",headline:"A wider perspective.",dateLabel:"2026"},
 {id:"namangan-mun-2026",chapter:"Beyond borders",headline:"Listen differently.",dateLabel:"2026"}
];
export function getFeaturedRecords():FeaturedRecord[]{return choices.flatMap(choice=>{const record=certificateRecords.find(r=>r.id===choice.id);if(!record?.document||!existsSync(join(process.cwd(),"public",record.document.src.replace(/^\//,""))))return [];return [{...record,chapter:choice.chapter,headline:choice.headline,dateLabel:choice.dateLabel}]})}
