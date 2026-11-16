import type {
  Business as DbBusiness,
  Car as DbCar,
  Event as DbEvent,
  Housing as DbHousing,
  Job as DbJob,
  Resume as DbResume,
} from "@prisma/client";
import type {
  Business,
  CarListing,
  EventListing,
  HousingListing,
  Job,
  JobCategory,
  JobType,
  ResumeListing,
} from "@/lib/types";

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mapJob(job: DbJob): Job {
  return {
    id: job.id,
    title: job.title,
    titleHy: job.titleHy ?? undefined,
    company: job.company,
    location: job.location,
    type: job.type as JobType,
    category: job.category as JobCategory,
    description: job.description,
    descriptionHy: job.descriptionHy ?? undefined,
    requirements: parseStringArray(job.requirements),
    languages: parseStringArray(job.languages),
    salary: job.salary ?? undefined,
    contactPhone: job.contactPhone ?? undefined,
    contactEmail: job.contactEmail ?? undefined,
    postedAt: job.postedAt.toISOString(),
    featured: job.featured,
  };
}

export function mapResume(resume: DbResume): ResumeListing {
  return {
    id: resume.id,
    name: resume.name,
    title: resume.title,
    titleHy: resume.titleHy ?? undefined,
    location: resume.location,
    experience: resume.experience,
    languages: parseStringArray(resume.languages),
    postedAt: resume.postedAt.toISOString(),
  };
}

export function mapHousing(home: DbHousing): HousingListing {
  return {
    id: home.id,
    title: home.title,
    titleHy: home.titleHy ?? undefined,
    location: home.location,
    price: home.price,
    beds: home.beds,
    baths: home.baths,
    description: home.description,
    postedAt: home.postedAt.toISOString(),
  };
}

export function mapCar(car: DbCar): CarListing {
  return {
    id: car.id,
    title: car.title,
    location: car.location,
    price: car.price,
    year: car.year,
    mileage: car.mileage ?? undefined,
    description: car.description,
    postedAt: car.postedAt.toISOString(),
  };
}

export function mapEvent(event: DbEvent): EventListing {
  return {
    id: event.id,
    title: event.title,
    titleHy: event.titleHy ?? undefined,
    location: event.location,
    date: event.date,
    description: event.description,
  };
}

export function mapBusiness(business: DbBusiness): Business {
  return {
    id: business.id,
    name: business.name,
    nameHy: business.nameHy ?? undefined,
    category: business.category,
    location: business.location,
    phone: business.phone,
    hours: business.hours,
    description: business.description,
  };
}
