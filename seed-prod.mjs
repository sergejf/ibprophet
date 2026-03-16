import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const dataPath = path.resolve('src/shared/seed-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

await prisma.pathwayCareerLink.deleteMany();
await prisma.subjectPathwayLink.deleteMany();
await prisma.savedLoadout.deleteMany();
await prisma.career.deleteMany();
await prisma.universityPathway.deleteMany();
await prisma.iBSubject.deleteMany();

for (const s of data.subjects) {
  await prisma.iBSubject.create({ data: s });
}
for (const p of data.pathways) {
  await prisma.universityPathway.create({ data: p });
}
for (const c of data.careers) {
  await prisma.career.create({
    data: { ...c, pros: JSON.stringify(c.pros), cons: JSON.stringify(c.cons) },
  });
}
for (const link of data.subjectPathwayLinks) {
  const subject = await prisma.iBSubject.findUnique({ where: { name: link.subject } });
  const pathway = await prisma.universityPathway.findUnique({ where: { name: link.pathway } });
  if (!subject || !pathway) { console.warn(`Skipping: ${link.subject} → ${link.pathway}`); continue; }
  await prisma.subjectPathwayLink.create({
    data: { subjectId: subject.id, pathwayId: pathway.id, weight: link.weight, hlRequired: link.hlRequired },
  });
}
for (const link of data.pathwayCareerLinks) {
  const pathway = await prisma.universityPathway.findUnique({ where: { name: link.pathway } });
  const career = await prisma.career.findUnique({ where: { name: link.career } });
  if (!pathway || !career) { console.warn(`Skipping: ${link.pathway} → ${link.career}`); continue; }
  await prisma.pathwayCareerLink.create({
    data: { pathwayId: pathway.id, careerId: career.id, weight: link.weight },
  });
}

console.log('Seed complete!');
await prisma.$disconnect();
