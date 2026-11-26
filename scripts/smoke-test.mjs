// Run against a locally started production build: node scripts/smoke-test.mjs http://localhost:3000
import assert from "node:assert/strict";
const base=new URL(process.argv[2]??"http://localhost:3000");
const routes={"/":"ZiyoMuhammad","/about":"My","/projects":"Ideas into","/projects/overthink":"OverThink","/projects/finance4youth":"Finance4Youth","/projects/rezamin":"ReZamin","/achievements":"Milestones","/off-the-record":"Off the","/contact":"Telegram"};
for(const [route,needle] of Object.entries(routes)){const response=await fetch(new URL(route,base));assert.equal(response.status,200,route);const html=await response.text();assert.ok(html.includes(needle),route+" missing expected text");console.log("PASS",route)}
const ids=["business-studies-2026","fergana-mun","football-second-place","grade-2-commendation-2018","grade-5-academic-award","grade-6-academic-award","grade-6-commendation","handball-first-place-2022","informatics-olympiad-third-place","kamalak-active-member","namangan-mun-2026","school-honor-2026","zakovat-best-player-2024"];
for(const id of ids){const response=await fetch(new URL("/documents/"+id+".webp",base));assert.equal(response.status,200,id);assert.match(response.headers.get("content-type")??"",/image\/webp/i);console.log("PASS certificate",id)}
const missing=await fetch(new URL("/projects/unknown-project",base));assert.equal(missing.status,404);console.log("PASS unknown project 404");
