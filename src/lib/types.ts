export type JobType = "full-time" | "part-time" | "contract" | "live-in";

export type JobCategory =
  | "office"
  | "healthcare"
  | "food"
  | "trades"
  | "driving"
  | "retail"
  | "other";

export interface Job {
  id: string;
  title: string;
  titleHy?: string;
  company: string;
  location: string;
  type: JobType;
  category: JobCategory;
  description: string;
  descriptionHy?: string;
  requirements: string[];
  languages: string[];
  salary?: string;
  contactPhone?: string;
  contactEmail?: string;
  postedAt: string;
  featured?: boolean;
}

export interface HousingListing {
  id: string;
  title: string;
  titleHy?: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  description: string;
  postedAt: string;
}

export interface CarListing {
  id: string;
  title: string;
  location: string;
  price: string;
  year: number;
  mileage?: string;
  description: string;
  postedAt: string;
}

export interface EventListing {
  id: string;
  title: string;
  titleHy?: string;
  location: string;
  date: string;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  nameHy?: string;
  category: string;
  location: string;
  phone: string;
  hours: string;
  description: string;
}

export interface ResumeListing {
  id: string;
  name: string;
  title: string;
  titleHy?: string;
  location: string;
  experience: string;
  languages: string[];
  postedAt: string;
}
