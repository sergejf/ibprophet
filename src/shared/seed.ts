import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

export async function seedData(prisma: PrismaClient) {
  const dataPath = path.resolve(
    process.cwd(),
    "../../../src/shared/seed-data.json",
  );
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);

  // Clear in FK-safe order
  await prisma.pathwayCareerLink.deleteMany();
  await prisma.subjectPathwayLink.deleteMany();
  await prisma.savedLoadout.deleteMany();
  await prisma.career.deleteMany();
  await prisma.universityPathway.deleteMany();
  await prisma.iBSubject.deleteMany();

  // Insert subjects
  for (const s of data.subjects) {
    await prisma.iBSubject.create({ data: s });
  }

  // Insert pathways
  for (const p of data.pathways) {
    await prisma.universityPathway.create({ data: p });
  }

  // Insert careers
  for (const c of data.careers) {
    await prisma.career.create({
      data: {
        ...c,
        pros: JSON.stringify(c.pros),
        cons: JSON.stringify(c.cons),
      },
    });
  }

  // Insert subject-pathway links
  for (const link of data.subjectPathwayLinks) {
    const subject = await prisma.iBSubject.findUnique({
      where: { name: link.subject },
    });
    const pathway = await prisma.universityPathway.findUnique({
      where: { name: link.pathway },
    });
    if (!subject || !pathway) {
      console.warn(`Skipping link: ${link.subject} → ${link.pathway}`);
      continue;
    }
    await prisma.subjectPathwayLink.create({
      data: {
        subjectId: subject.id,
        pathwayId: pathway.id,
        weight: link.weight,
        hlRequired: link.hlRequired,
      },
    });
  }

  // Insert pathway-career links
  for (const link of data.pathwayCareerLinks) {
    const pathway = await prisma.universityPathway.findUnique({
      where: { name: link.pathway },
    });
    const career = await prisma.career.findUnique({
      where: { name: link.career },
    });
    if (!pathway || !career) {
      console.warn(`Skipping link: ${link.pathway} → ${link.career}`);
      continue;
    }
    await prisma.pathwayCareerLink.create({
      data: {
        pathwayId: pathway.id,
        careerId: career.id,
        weight: link.weight,
      },
    });
  }

  console.log("Seed complete!");
}
