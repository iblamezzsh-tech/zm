export const categories = ["All", "Academics", "Competitions", "Leadership", "Volunteering", "Sports", "Certificates"] as const;
export type Category = typeof categories[number];
export type RecordEntry = {
 id:string; title:string; category:Exclude<Category,"All"|"Certificates">; organization:string; period?:string; type:"Experience"|"Participation"|"Award"|"Certificate"; description:string; document?:{src:string; type:"image"|"pdf"; alt:string};
};
export const milestones:RecordEntry[] = [
 {id:"school-leadership",title:"School leadership",category:"Leadership",organization:"Public School No. 1",type:"Experience",description:"I served as a class leader and took part in the school’s leadership community. It was an early opportunity to learn about responsibility and supporting others."},
 {id:"wharton",title:"Global High School Investment Competition",category:"Competitions",organization:"Wharton",period:"2025",type:"Participation",description:"I participated as a team leader, focusing on risk, strategy and collaborative investment research. This entry records participation and responsibilities, not a competition ranking or award."},
 {id:"volunteering",title:"Oltin qanot volunteer team",category:"Volunteering",organization:"Andijan",period:"2025",type:"Experience",description:"I joined the Oltin qanot volunteer team in Andijan in 2025. This entry records my involvement in volunteering, not a certificate or award."},
 {id:"school-sport",title:"School football team leadership",category:"Sports",organization:"Public School No. 1",type:"Experience",description:"At my first school I led our football team, an experience that formed part of my early school leadership journey."},
 {id:"school-quiz",title:"School Zakovat team leadership",category:"Competitions",organization:"Public School No. 1",type:"Experience",description:"I led our school’s Zakovat team and developed my interest in intellectual competition and teamwork."}
];
