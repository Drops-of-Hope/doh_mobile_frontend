export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "donor" | "organizer" | "general";
}

export const donorFAQs: FAQItem[] = [
  {
    id: "donor-1",
    question: "Who can donate blood?",
    answer:
      "Generally, healthy individuals aged 18-65 who weigh at least 50kg (110 lbs) can donate blood. You must be in good health and meet specific eligibility criteria.",
    category: "donor",
  },
  {
    id: "donor-2",
    question: "How often can I donate blood?",
    answer:
      "You can donate whole blood every 8 weeks (56 days). This allows your body enough time to replenish the blood cells.",
    category: "donor",
  },
  {
    id: "donor-3",
    question: "What should I do before donating blood?",
    answer:
      "Get a good night's sleep, eat a healthy meal (avoid fatty foods), drink plenty of fluids, and avoid alcohol for 24 hours before donation.",
    category: "donor",
  },
  {
    id: "donor-4",
    question: "How long does the donation process take?",
    answer:
      "The entire process takes about 30-45 minutes, including registration, health screening, and the actual donation (which takes 8-10 minutes).",
    category: "donor",
  },
  {
    id: "donor-5",
    question: "Is blood donation safe?",
    answer:
      "Yes, blood donation is very safe. All equipment is sterile and used only once. There is no risk of contracting any infection from donating blood.",
    category: "donor",
  },
  {
    id: "donor-6",
    question: "What are the side effects of blood donation?",
    answer:
      "Most people feel fine after donating. Some may experience mild dizziness, fatigue, or bruising at the needle site. These effects are temporary.",
    category: "donor",
  },
  {
    id: "donor-7",
    question: "Can I donate if I have tattoos or piercings?",
    answer:
      "You must wait 6 months after getting a tattoo or piercing before donating blood to ensure there's no risk of infection.",
    category: "donor",
  },
  {
    id: "donor-8",
    question: "What blood types are most needed?",
    answer:
      "O-negative blood is universal and always in high demand. However, all blood types are needed to help patients with various medical conditions.",
    category: "donor",
  },
];

export const organizerFAQs: FAQItem[] = [
  {
    id: "organizer-1",
    question: "How do I organize a blood donation camp?",
    answer:
      "Contact your local blood bank or health department. You'll need to secure a location, recruit volunteers, and coordinate with medical staff for the collection process.",
    category: "organizer",
  },
  {
    id: "organizer-2",
    question: "What facilities are needed for a blood camp?",
    answer:
      "You need a clean, spacious area with adequate lighting, proper ventilation, electrical outlets, tables, chairs, and access to restrooms. A registration area and refreshment station are also recommended.",
    category: "organizer",
  },
  {
    id: "organizer-3",
    question: "How many volunteers do I need?",
    answer:
      "For a small camp (20-30 donors), you'll need 8-10 volunteers for registration, refreshments, donor care, and general assistance. Larger camps require proportionally more volunteers.",
    category: "organizer",
  },
  {
    id: "organizer-4",
    question: "How far in advance should I plan?",
    answer:
      "Start planning at least 6-8 weeks in advance. This allows time for permits, volunteer recruitment, promotion, and coordination with the blood bank.",
    category: "organizer",
  },
  {
    id: "organizer-5",
    question: "What permits or approvals do I need?",
    answer:
      "Check with local health authorities and your blood bank partner. You may need permits for the venue, food service (for refreshments), and compliance with health regulations.",
    category: "organizer",
  },
  {
    id: "organizer-6",
    question: "How do I promote the blood camp?",
    answer:
      "Use social media, local newspapers, community bulletin boards, and word of mouth. Partner with local organizations, schools, and businesses to spread awareness.",
    category: "organizer",
  },
  {
    id: "organizer-7",
    question: "What should I provide for donors?",
    answer:
      "Provide light refreshments (juice, cookies, sandwiches), comfortable seating, and a welcoming environment. Some camps also provide certificates or small tokens of appreciation.",
    category: "organizer",
  },
  {
    id: "organizer-8",
    question: "How do I handle emergencies during the camp?",
    answer:
      "Have a clear emergency protocol, ensure medical staff are present, keep emergency contact numbers handy, and have a plan for dealing with donor reactions or medical emergencies.",
    category: "organizer",
  },
];

export const generalFAQs: FAQItem[] = [
  {
    id: "general-1",
    question: "Why is blood donation important?",
    answer:
      "Blood donation saves lives. Every donation can help up to three people. Blood is needed for surgeries, cancer treatment, chronic illnesses, and traumatic injuries.",
    category: "general",
  },
  {
    id: "general-2",
    question: "How is donated blood used?",
    answer:
      "Blood is separated into components: red blood cells for anemia and blood loss, plasma for burn victims and shock patients, and platelets for cancer patients and surgeries.",
    category: "general",
  },
  {
    id: "general-3",
    question: "How long does donated blood last?",
    answer:
      "Red blood cells last up to 42 days, platelets last 5 days, and plasma can be frozen and stored for up to one year.",
    category: "general",
  },
  {
    id: "general-4",
    question: "Can I find out where my blood went?",
    answer:
      "Due to privacy laws, you cannot know the specific recipient. However, blood banks may provide general information about how your donation was used.",
    category: "general",
  },
];

export const getAllFAQs = (): FAQItem[] => {
  return [...donorFAQs, ...organizerFAQs, ...generalFAQs];
};

export const getFAQsByCategory = (
  category: "donor" | "organizer" | "general",
): FAQItem[] => {
  switch (category) {
    case "donor":
      return donorFAQs;
    case "organizer":
      return organizerFAQs;
    case "general":
      return generalFAQs;
    default:
      return [];
  }
};
