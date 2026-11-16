import { prisma } from "@/lib/prisma";
import {
  mapBusiness,
  mapCar,
  mapEvent,
  mapHousing,
  mapJob,
  mapResume,
} from "@/lib/mappers";
import type { Job } from "@/lib/types";

export async function listJobs(options: {
  q?: string;
  location?: string;
  category?: string;
  type?: string;
} = {}) {
  const jobs = await prisma.job.findMany({
    orderBy: { postedAt: "desc" },
  });

  const q = options.q?.trim().toLowerCase() ?? "";
  return jobs
    .map(mapJob)
    .filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.titleHy?.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesLocation = !options.location || job.location === options.location;
      const matchesCategory = !options.category || job.category === options.category;
      const matchesType = !options.type || job.type === options.type;
      return matchesQuery && matchesLocation && matchesCategory && matchesType;
    });
}

export async function getJobById(id: string): Promise<Job | null> {
  const job = await prisma.job.findUnique({ where: { id } });
  return job ? mapJob(job) : null;
}

export async function listResumes() {
  const rows = await prisma.resume.findMany({ orderBy: { postedAt: "desc" } });
  return rows.map(mapResume);
}

export async function listHousing() {
  const rows = await prisma.housing.findMany({ orderBy: { postedAt: "desc" } });
  return rows.map(mapHousing);
}

export async function listCars() {
  const rows = await prisma.car.findMany({ orderBy: { postedAt: "desc" } });
  return rows.map(mapCar);
}

export async function listEvents() {
  const rows = await prisma.event.findMany({ orderBy: { date: "asc" } });
  return rows.map(mapEvent);
}

export async function listBusinesses() {
  const rows = await prisma.business.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapBusiness);
}

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
