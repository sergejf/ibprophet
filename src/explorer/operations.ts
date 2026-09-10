import type {
  GetSubjects,
  GetPathwaysForSubjects,
} from "wasp/server/operations";
import type {
  IBSubject,
  UniversityPathway,
  Career,
  SubjectPathwayLink,
  PathwayCareerLink,
} from "wasp/entities";

export const getSubjects: GetSubjects<void, IBSubject[]> = async (
  _args,
  context,
) => {
  return context.entities.IBSubject.findMany({
    orderBy: [{ group: "asc" }, { name: "asc" }],
  });
};

type PathwayInput = {
  subjectIds: string[];
  hlSubjectIds: string[];
};

type PathwayResult = {
  pathways: (UniversityPathway & {
    subjectLinks: (SubjectPathwayLink & { subject: IBSubject })[];
    careerLinks: (PathwayCareerLink & { career: Career })[];
  })[];
};

export const getPathwaysForSubjects: GetPathwaysForSubjects<
  PathwayInput,
  PathwayResult
> = async (args, context) => {
  const { subjectIds, hlSubjectIds } = args;

  if (
    subjectIds.length === 0 ||
    subjectIds.length > 6 ||
    hlSubjectIds.length > 6
  ) {
    return { pathways: [] };
  }

  // Find all pathway links for selected subjects
  const links = await context.entities.SubjectPathwayLink.findMany({
    where: { subjectId: { in: subjectIds } },
    include: { pathway: true },
  });

  // Filter out hlRequired links where subject isn't HL
  const validLinks = links.filter(
    (link) => !link.hlRequired || hlSubjectIds.includes(link.subjectId),
  );

  // Get unique pathway IDs
  const pathwayIds = [...new Set(validLinks.map((l) => l.pathwayId))];

  if (pathwayIds.length === 0) {
    return { pathways: [] };
  }

  // Fetch full pathway data with career links
  const pathways = await context.entities.UniversityPathway.findMany({
    where: { id: { in: pathwayIds } },
    include: {
      subjectLinks: {
        where: { subjectId: { in: subjectIds } },
        include: { subject: true },
      },
      careerLinks: {
        include: { career: true },
      },
    },
  });

  return { pathways };
};

// NOTE: getSavedLoadouts / saveLoadout removed alongside the `auth` block in
// main.wasp — they required `context.user`. Restore them with auth when
// accounts ship, and bound `name` / `subjectConfig` length before persisting.
