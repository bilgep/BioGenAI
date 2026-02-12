import { prisma } from "../db";
import type { GeneratedBio } from "@prisma/client";

export const createBio = (resumeId: number, content: string): Promise<GeneratedBio> =>
  prisma.generatedBio.create({ data: { resumeId, content } });

export const getBioById = (id: number): Promise<GeneratedBio | null> =>
  prisma.generatedBio.findUnique({ where: { id } });