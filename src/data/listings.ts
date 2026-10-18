import type {
  Business,
  CarListing,
  EventListing,
  HousingListing,
  ResumeListing,
} from "@/lib/types";

export const housing: HousingListing[] = [
  {
    id: "home-1",
    title: "3BD / 2BA Affordable Unit",
    titleHy: "3 bed / 2 bath affordable unit",
    location: "Tujunga, CA",
    price: "$1,250/mo",
    beds: 3,
    baths: 2,
    description:
      "Affordable unit for rent. Brand-new building, Section 8 welcome. Minimum requirements for 4 people; max income under $70,000.",
    postedAt: "2026-10-16T16:45:00Z",
  },
  {
    id: "home-2",
    title: "1BD / 1BA Remodeled Addition",
    titleHy: "1 bed remodeled private addition",
    location: "North Hollywood, CA",
    price: "$1,750/mo",
    beds: 1,
    baths: 1,
    description:
      "Fully remodeled addition with mini-split A/C, private entrance, washer/dryer, and utilities included.",
    postedAt: "2026-10-16T14:50:00Z",
  },
  {
    id: "home-3",
    title: "Newly Built ADU",
    titleHy: "Newly built ADU for rent",
    location: "Winnetka, CA",
    price: "$1,900/mo",
    beds: 1,
    baths: 1,
    description:
      "Prime location near JONS, Aroma Market, Costco, and CSUN. Quiet street, modern finishes.",
    postedAt: "2026-10-15T12:50:00Z",
  },
  {
    id: "home-4",
    title: "Brand New 3BD ADU",
    titleHy: "Brand new 3 bedroom ADU",
    location: "Glendale, CA",
    price: "$3,850/mo",
    beds: 3,
    baths: 2,
    description:
      "Separate entrance, 1,100 sqft, open floor plan, center island kitchen, alarm system, laminate floors.",
    postedAt: "2026-10-14T16:45:00Z",
  },
];

export const cars: CarListing[] = [
  {
    id: "car-1",
    title: "2026 Mercedes-Benz E350 — Uber Black / Lyft Black",
    location: "Glendale, CA",
    price: "$700/week",
    year: 2026,
    description:
      "Driver needed for Uber Black / Lyft Black. Fully ready with all permits, including LAX. Weekly rental.",
    postedAt: "2026-10-16T11:51:00Z",
  },
  {
    id: "car-2",
    title: "2023 Alloy Wheel Package & Roof Rails",
    location: "Glendale, CA",
    price: "$16,395",
    year: 2023,
    mileage: "Clean CA title",
    description:
      "One previous owner. Detailed service records available. Recently serviced prior to sale.",
    postedAt: "2026-10-12T08:28:00Z",
  },
  {
    id: "car-3",
    title: "2022 Jeep Wrangler 4xe",
    location: "Glendale, CA",
    price: "$20,995",
    year: 2022,
    mileage: "One owner",
    description:
      "Clean California car. Passed pre-delivery inspection, oil change, and emissions check.",
    postedAt: "2026-09-29T08:11:00Z",
  },
];

export const events: EventListing[] = [
  {
    id: "event-1",
    title: "Glendale Armenian Cultural Night",
    titleHy: "Glendale Armenian cultural night",
    location: "Glendale Public Library, CA",
    date: "2026-11-02",
    description:
      "Music, poetry, and local makers. Free community evening celebrating Armenian-American arts in Los Angeles.",
  },
  {
    id: "event-2",
    title: "Small Business Networking Breakfast",
    titleHy: "Small business networking breakfast",
    location: "Burbank, CA",
    date: "2026-11-08",
    description:
      "Meet Armenian-owned businesses, share hiring needs, and grow your local network over coffee.",
  },
  {
    id: "event-3",
    title: "Career Workshop: Resume & Interview Prep",
    titleHy: "Career workshop — resume and interview prep",
    location: "North Hollywood, CA",
    date: "2026-11-15",
    description:
      "Bilingual workshop for job seekers. Bring your draft resume and practice interview answers.",
  },
];

export const businesses: Business[] = [
  {
    id: "biz-1",
    name: "AKH Construction",
    category: "Construction",
    location: "Los Angeles, CA",
    phone: "(818) 555-1001",
    hours: "Mon–Sat 8am–6pm",
    description:
      "Complete A-to-Z construction and finishing services for homes and commercial spaces.",
  },
  {
    id: "biz-2",
    name: "State Farm — Katarine Sargsyan",
    nameHy: "State Farm — Katarine Sargsyan Agency",
    category: "Insurance",
    location: "Woodland Hills, CA",
    phone: "(818) 555-1002",
    hours: "Mon–Fri 9am–5pm",
    description:
      "Insurance agency serving Armenian-speaking families. Auto, home, and life coverage.",
  },
  {
    id: "biz-3",
    name: "Valley Plumbing 24/7",
    category: "Plumbing",
    location: "Los Angeles, CA",
    phone: "(818) 555-1003",
    hours: "24/7 emergency",
    description:
      "Calls answered around the clock — water heaters, tankless, main line cleaning, drainage.",
  },
  {
    id: "biz-4",
    name: "Aroma Market",
    nameHy: "Aroma Market Glendale",
    category: "Grocery",
    location: "Glendale, CA",
    phone: "(818) 555-1004",
    hours: "Daily 8am–10pm",
    description:
      "Armenian and Middle Eastern groceries, fresh produce, and prepared foods.",
  },
];

export const resumes: ResumeListing[] = [
  {
    id: "resume-1",
    name: "Ani K.",
    title: "Office Administrator seeking full-time role",
    titleHy: "Office administrator seeking full-time work",
    location: "Glendale, CA",
    experience: "5 years office & reception experience",
    languages: ["Armenian", "English", "Russian"],
    postedAt: "2026-10-14T09:00:00Z",
  },
  {
    id: "resume-2",
    name: "Hakob M.",
    title: "Experienced caregiver available",
    titleHy: "Experienced caregiver available now",
    location: "North Hollywood, CA",
    experience: "7 years board & care / live-in",
    languages: ["Armenian", "English"],
    postedAt: "2026-10-12T11:30:00Z",
  },
  {
    id: "resume-3",
    name: "Lilit S.",
    title: "Cook looking for restaurant kitchen",
    titleHy: "Cook seeking restaurant kitchen role",
    location: "Burbank, CA",
    experience: "4 years prep & line cook",
    languages: ["Armenian", "English"],
    postedAt: "2026-10-10T16:00:00Z",
  },
];
