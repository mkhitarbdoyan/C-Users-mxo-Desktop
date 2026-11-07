import type { Job } from "@/lib/types";

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Customer Service Worker — Business Office",
    titleHy: "Customer Service — Business Office (Armenian/English)",
    company: "Glendale Business Services",
    location: "Glendale, CA",
    type: "full-time",
    category: "office",
    description:
      "Business office needs reliable customer service workers. Answer phones, greet clients, and support daily office operations in a bilingual environment.",
    descriptionHy:
      "Reliable bilingual customer service role in a Glendale business office. Phones, front desk, and daily support.",
    requirements: [
      "5 days a week, 9:00 AM – 5:00 PM",
      "Friendly communication skills",
      "Armenian and English preferred",
    ],
    languages: ["Armenian", "English"],
    salary: "$18–22/hr",
    contactPhone: "(818) 555-0142",
    postedAt: "2026-10-16T16:35:00Z",
    featured: true,
  },
  {
    id: "job-2",
    title: "Experienced Cook / Salad Specialist",
    titleHy: "Experienced cook and salad specialist needed",
    company: "Arax Kitchen",
    location: "Glendale, CA",
    type: "full-time",
    category: "food",
    description:
      "Looking for an experienced cook specializing in salads and prep for a busy Armenian restaurant kitchen. Fast-paced, team-oriented environment.",
    requirements: [
      "Prior kitchen experience required",
      "Ability to work weekends",
      "Food handler card preferred",
    ],
    languages: ["Armenian", "English"],
    salary: "$20–25/hr + tips",
    contactPhone: "(818) 555-0198",
    postedAt: "2026-10-16T14:34:00Z",
    featured: true,
  },
  {
    id: "job-3",
    title: "Live-in Caregivers — Board & Care",
    titleHy: "Live-in caregivers needed for board and care",
    company: "Sherman Oaks Care Home",
    location: "Sherman Oaks, CA",
    type: "live-in",
    category: "healthcare",
    description:
      "Energetic, friendly caregivers needed for a board and care facility. Room and board included. Compassion and reliability are essential.",
    requirements: [
      "Live-in schedule with room provided",
      "Prior caregiving experience preferred",
      "Valid ID and references",
    ],
    languages: ["Armenian", "English", "Russian"],
    salary: "$200–250/day + room",
    contactPhone: "(818) 555-0271",
    postedAt: "2026-10-16T09:21:00Z",
  },
  {
    id: "job-4",
    title: "Intake Coordinator — Home Care",
    titleHy: "Home care intake coordinator",
    company: "Valley Home Health",
    location: "North Hollywood, CA",
    type: "full-time",
    category: "healthcare",
    description:
      "We are hiring an Intake Coordinator for home care. Coordinate new client intake, manage paperwork, and communicate with families and caregivers. English and Armenian required; Russian preferred.",
    requirements: [
      "English and Armenian required; Russian preferred",
      "Full-time, permanent",
      "Office experience a plus",
    ],
    languages: ["Armenian", "English", "Russian"],
    salary: "$22–28/hr",
    contactEmail: "hiring@valleyhomehealth.example",
    postedAt: "2026-10-15T12:24:00Z",
    featured: true,
  },
  {
    id: "job-5",
    title: "Experienced Bodyman — Auto Body Shop",
    titleHy: "Experienced auto body craftsman needed",
    company: "NoHo Collision",
    location: "North Hollywood, CA",
    type: "full-time",
    category: "trades",
    description:
      "Experienced bodyman needed for a busy body shop. Bodywork, prep, and paint support. We speak English, Armenian, and Russian.",
    requirements: [
      "Hands-on body shop experience",
      "Own basic tools preferred",
      "Reliable transportation",
    ],
    languages: ["Armenian", "English", "Russian"],
    salary: "DOE",
    contactPhone: "(747) 777-2474",
    postedAt: "2026-10-14T11:10:00Z",
  },
  {
    id: "job-6",
    title: "Truck Driver — Car Hauling",
    titleHy: "Truck driver needed for car hauling",
    company: "Pacific Auto Transport",
    location: "Santa Clarita, CA",
    type: "full-time",
    category: "driving",
    description:
      "Driver needed to haul 2 cars with open and enclosed trailers. Knowing English is preferred but not required.",
    requirements: [
      "Valid CDL or equivalent experience",
      "Clean driving record",
      "Comfortable with long local routes",
    ],
    languages: ["Armenian", "Russian"],
    salary: "$1,200–1,600/week",
    contactPhone: "(661) 555-0334",
    postedAt: "2026-10-16T12:30:00Z",
  },
  {
    id: "job-7",
    title: "Dispatcher — Non-Emergency Transport",
    titleHy: "Dispatcher for non-emergency transport",
    company: "LA Comfort Ride",
    location: "Los Angeles, CA",
    type: "full-time",
    category: "office",
    description:
      "Dispatcher needed for a non-emergency medical transportation company. Coordinate drivers, schedule rides, and support clients by phone.",
    requirements: [
      "Strong phone skills",
      "Able to multitask under pressure",
      "Bilingual Armenian/English a plus",
    ],
    languages: ["Armenian", "English"],
    salary: "$19–23/hr",
    contactPhone: "(747) 221-1328",
    postedAt: "2026-10-16T11:20:00Z",
  },
  {
    id: "job-8",
    title: "Part-time / Full-time Cooks — Commercial Kitchen",
    titleHy: "Cooks for commercial kitchen",
    company: "Valley Meal Prep Co.",
    location: "Van Nuys, CA",
    type: "part-time",
    category: "food",
    description:
      "Reliable cooks needed to prepare food for facilities in a fast-paced commercial kitchen. Flexible shifts available.",
    requirements: [
      "Kitchen experience preferred",
      "Able to stand for long periods",
      "Flexible schedule",
    ],
    languages: ["Armenian", "English", "Spanish"],
    salary: "$18–21/hr",
    contactPhone: "(818) 555-0411",
    postedAt: "2026-10-05T08:51:00Z",
  },
  {
    id: "job-9",
    title: "Retail Associate — Market",
    titleHy: "Retail associate for neighborhood market",
    company: "Sunrise Armenian Market",
    location: "Burbank, CA",
    type: "part-time",
    category: "retail",
    description:
      "Friendly retail associate needed for a neighborhood Armenian market. Cashier duties, stocking, and helping customers find products.",
    requirements: [
      "Weekend availability",
      "Cash handling experience preferred",
      "Armenian language a strong plus",
    ],
    languages: ["Armenian", "English"],
    salary: "$17–19/hr",
    contactPhone: "(818) 555-0550",
    postedAt: "2026-10-13T15:00:00Z",
  },
  {
    id: "job-10",
    title: "Office Manager — Dental Practice",
    titleHy: "Office manager for dental practice",
    company: "Smile Dental Glendale",
    location: "Glendale, CA",
    type: "full-time",
    category: "office",
    description:
      "Office manager needed to oversee scheduling, billing coordination, and front-desk operations for a growing dental practice.",
    requirements: [
      "2+ years office management experience",
      "Dental or medical office experience preferred",
      "Armenian and English required",
    ],
    languages: ["Armenian", "English"],
    salary: "$55k–65k/year",
    contactEmail: "careers@smiledental.example",
    postedAt: "2026-10-12T10:00:00Z",
  },
];

export const jobCategories: {
  id: Job["category"];
  label: string;
  labelHy: string;
}[] = [
  { id: "office", label: "Office", labelHy: "Office" },
  { id: "healthcare", label: "Healthcare", labelHy: "Healthcare" },
  { id: "food", label: "Food & Kitchen", labelHy: "Food & Kitchen" },
  { id: "trades", label: "Trades", labelHy: "Trades" },
  { id: "driving", label: "Driving", labelHy: "Driving" },
  { id: "retail", label: "Retail", labelHy: "Retail" },
  { id: "other", label: "Other", labelHy: "Other" },
];

export const locations = [
  "Glendale, CA",
  "North Hollywood, CA",
  "Sherman Oaks, CA",
  "Van Nuys, CA",
  "Burbank, CA",
  "Los Angeles, CA",
  "Santa Clarita, CA",
];

export function getJobById(id: string): Job | undefined {
  return jobs.find((job) => job.id === id);
}

export function filterJobs(options: {
  q?: string;
  location?: string;
  category?: string;
  type?: string;
}): Job[] {
  const q = options.q?.trim().toLowerCase() ?? "";
  return jobs.filter((job) => {
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.titleHy?.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);
    const matchesLocation =
      !options.location || job.location === options.location;
    const matchesCategory =
      !options.category || job.category === options.category;
    const matchesType = !options.type || job.type === options.type;
    return matchesQuery && matchesLocation && matchesCategory && matchesType;
  });
}
