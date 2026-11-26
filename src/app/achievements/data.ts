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

// Transcribed from the owner's thirteen uploaded certificate photographs.
export const certificateRecords:RecordEntry[] = [
  {
    "id": "namangan-mun-2026",
    "title": "Namangan Model United Nations",
    "category": "Competitions",
    "organization": "Namangan Presidential School",
    "period": "31 October 2026",
    "type": "Participation",
    "description": "Certificate of participation in the Model United Nations conference held at Namangan Presidential School on 31 October 2026.",
    "document": {
      "src": "/documents/namangan-mun-2026.webp",
      "type": "image",
      "alt": "Namangan Model United Nations — original certificate photograph"
    }
  },
  {
    "id": "fergana-mun",
    "title": "Fergana Model United Nations",
    "category": "Competitions",
    "organization": "Fergana Presidential School",
    "type": "Participation",
    "description": "Certificate recognizing active participation in the Fergana Presidential School Model United Nations conference and engagement in global discussions.",
    "document": {
      "src": "/documents/fergana-mun.webp",
      "type": "image",
      "alt": "Fergana Model United Nations — original certificate photograph"
    }
  },
  {
    "id": "informatics-olympiad-third-place",
    "title": "Informatics Olympiad — third place",
    "category": "Academics",
    "organization": "Specialized Boarding School No. 1, Andijan",
    "period": "2025–2026",
    "type": "Award",
    "description": "Third place in Informatics at Stage II (Andijan city) of the Republican Subject Olympiad during the 2025–2026 academic year.",
    "document": {
      "src": "/documents/informatics-olympiad-third-place.webp",
      "type": "image",
      "alt": "Informatics Olympiad — third place — original certificate photograph"
    }
  },
  {
    "id": "school-honor-2026",
    "title": "Academic achievement honor certificate",
    "category": "Academics",
    "organization": "Specialized Boarding School No. 1, Andijan",
    "period": "25 May 2026",
    "type": "Award",
    "description": "School commendation for knowledge, diligence, strong academic results and national and international certificates during the 2025–2026 academic year.",
    "document": {
      "src": "/documents/school-honor-2026.webp",
      "type": "image",
      "alt": "Academic achievement honor certificate — original certificate photograph"
    }
  },
  {
    "id": "business-studies-2026",
    "title": "Business Studies — course completion",
    "category": "Academics",
    "organization": "President’s Gifted Children National Program / SBS No. 1",
    "period": "20 February 2026",
    "type": "Certificate",
    "description": "Completed the Business Studies course conducted entirely in English under the President’s Gifted Children National Program.",
    "document": {
      "src": "/documents/business-studies-2026.webp",
      "type": "image",
      "alt": "Business Studies — course completion — original certificate photograph"
    }
  },
  {
    "id": "zakovat-best-player-2024",
    "title": "Best Zakovat player of the year",
    "category": "Competitions",
    "organization": "Bilimdonlar Zakovat Club, Andijan",
    "period": "2023–2024",
    "type": "Award",
    "description": "Recognition for achievements in the school's Zakovat club during the 2023–2024 academic year (Yilning eng yaxshi bilimdon yigiti).",
    "document": {
      "src": "/documents/zakovat-best-player-2024.webp",
      "type": "image",
      "alt": "Best Zakovat player of the year — original certificate photograph"
    }
  },
  {
    "id": "handball-first-place-2022",
    "title": "Andijan regional handball championship — first place",
    "category": "Sports",
    "organization": "Andijan Regional Tourism and Sports Department",
    "period": "5 March 2022",
    "type": "Award",
    "description": "First-place diploma in the Andijan regional handball championship.",
    "document": {
      "src": "/documents/handball-first-place-2022.webp",
      "type": "image",
      "alt": "Andijan regional handball championship — first place — original certificate photograph"
    }
  },
  {
    "id": "football-second-place",
    "title": "School football tournament — second place",
    "category": "Sports",
    "organization": "Specialized Boarding School No. 1, Andijan",
    "type": "Award",
    "description": "Certificate for second place in a football competition among students of Specialized Boarding School No. 1 in Andijan.",
    "document": {
      "src": "/documents/football-second-place.webp",
      "type": "image",
      "alt": "School football tournament — second place — original certificate photograph"
    }
  },
  {
    "id": "grade-6-commendation",
    "title": "Grade 6 school commendation",
    "category": "Academics",
    "organization": "School commendation",
    "type": "Award",
    "description": "Recognition for excellent study, active participation in class and school activities, and helping the class teacher.",
    "document": {
      "src": "/documents/grade-6-commendation.webp",
      "type": "image",
      "alt": "Grade 6 school commendation — original certificate photograph"
    }
  },
  {
    "id": "grade-6-academic-award",
    "title": "Grade 6 academic excellence",
    "category": "Academics",
    "organization": "Public School No. 1, Oltinko‘l district",
    "type": "Award",
    "description": "Commendation for excellent academic performance and exemplary behavior in Grade 6.",
    "document": {
      "src": "/documents/grade-6-academic-award.webp",
      "type": "image",
      "alt": "Grade 6 academic excellence — original certificate photograph"
    }
  },
  {
    "id": "grade-5-academic-award",
    "title": "Grade 5 academic excellence",
    "category": "Academics",
    "organization": "Public School No. 1, Oltinko‘l district",
    "type": "Award",
    "description": "School award recognizing excellent study and school uniform in Grade 5.",
    "document": {
      "src": "/documents/grade-5-academic-award.webp",
      "type": "image",
      "alt": "Grade 5 academic excellence — original certificate photograph"
    }
  },
  {
    "id": "grade-2-commendation-2018",
    "title": "Grade 2 commendation",
    "category": "Academics",
    "organization": "Public School No. 1, Oltinko‘l district",
    "period": "24 May 2018",
    "type": "Award",
    "description": "School commendation for exemplary behavior and excellent academic performance.",
    "document": {
      "src": "/documents/grade-2-commendation-2018.webp",
      "type": "image",
      "alt": "Grade 2 commendation — original certificate photograph"
    }
  },
  {
    "id": "kamalak-active-member",
    "title": "Most active Kamalak member",
    "category": "Leadership",
    "organization": "Kamolot / Kamalak children’s organization, Oltinko‘l district",
    "period": "2015–2016",
    "type": "Award",
    "description": "Honor certificate recognizing active involvement in the organization's activities, in the Most Active Kamalak Member nomination. The academic year is transcribed as printed.",
    "document": {
      "src": "/documents/kamalak-active-member.webp",
      "type": "image",
      "alt": "Most active Kamalak member — original certificate photograph"
    }
  }
];
