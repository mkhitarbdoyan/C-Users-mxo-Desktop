import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { jobs } from "../src/data/jobs";
import {
  businesses,
  cars,
  events,
  housing,
  resumes,
} from "../src/data/listings";

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.housing.deleteMany();
  await prisma.car.deleteMany();
  await prisma.event.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("password123", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "ArmJob Demo",
      email: "demo@armjob.local",
      passwordHash,
    },
  });

  const employer = await prisma.user.create({
    data: {
      name: "Glendale Employers",
      email: "employer@armjob.local",
      passwordHash,
    },
  });

  for (const job of jobs) {
    await prisma.job.create({
      data: {
        id: job.id,
        title: job.title,
        titleHy: job.titleHy,
        company: job.company,
        location: job.location,
        type: job.type,
        category: job.category,
        description: job.description,
        descriptionHy: job.descriptionHy,
        requirements: JSON.stringify(job.requirements),
        languages: JSON.stringify(job.languages),
        salary: job.salary,
        contactPhone: job.contactPhone,
        contactEmail: job.contactEmail,
        featured: Boolean(job.featured),
        postedAt: new Date(job.postedAt),
        authorId: employer.id,
      },
    });
  }

  for (const resume of resumes) {
    await prisma.resume.create({
      data: {
        id: resume.id,
        name: resume.name,
        title: resume.title,
        titleHy: resume.titleHy,
        location: resume.location,
        experience: resume.experience,
        languages: JSON.stringify(resume.languages),
        postedAt: new Date(resume.postedAt),
        authorId: demoUser.id,
      },
    });
  }

  for (const home of housing) {
    await prisma.housing.create({
      data: {
        id: home.id,
        title: home.title,
        titleHy: home.titleHy,
        location: home.location,
        price: home.price,
        beds: home.beds,
        baths: home.baths,
        description: home.description,
        postedAt: new Date(home.postedAt),
        authorId: demoUser.id,
      },
    });
  }

  for (const car of cars) {
    await prisma.car.create({
      data: {
        id: car.id,
        title: car.title,
        location: car.location,
        price: car.price,
        year: car.year,
        mileage: car.mileage,
        description: car.description,
        postedAt: new Date(car.postedAt),
        authorId: demoUser.id,
      },
    });
  }

  for (const event of events) {
    await prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        titleHy: event.titleHy,
        location: event.location,
        date: event.date,
        description: event.description,
        authorId: demoUser.id,
      },
    });
  }

  for (const business of businesses) {
    await prisma.business.create({
      data: {
        id: business.id,
        name: business.name,
        nameHy: business.nameHy,
        category: business.category,
        location: business.location,
        phone: business.phone,
        hours: business.hours,
        description: business.description,
        authorId: demoUser.id,
      },
    });
  }

  console.log("Seeded ArmJob database");
  console.log("Demo login: demo@armjob.local / password123");
  console.log("Employer login: employer@armjob.local / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
