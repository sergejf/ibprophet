import type { GetCareer } from "wasp/server/operations";
import type {
  Career,
  PathwayCareerLink,
  UniversityPathway,
  SubjectPathwayLink,
  IBSubject,
} from "wasp/entities";
import { msg, CAREER_NOT_FOUND } from "../shared/errors";

type CareerResult = Career & {
  pathwayLinks: (PathwayCareerLink & {
    pathway: UniversityPathway & {
      subjectLinks: (SubjectPathwayLink & { subject: IBSubject })[];
    };
  })[];
};

export const getCareer: GetCareer<{ slug: string }, CareerResult> = async (
  args,
  context,
) => {
  const career = await context.entities.Career.findUnique({
    where: { slug: args.slug },
    include: {
      pathwayLinks: {
        include: {
          pathway: {
            include: {
              subjectLinks: {
                include: { subject: true },
              },
            },
          },
        },
      },
    },
  });

  if (!career) throw new Error(msg(CAREER_NOT_FOUND, { slug: args.slug }));
  return career;
};
