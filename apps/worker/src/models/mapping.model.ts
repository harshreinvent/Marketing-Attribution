import { prisma } from "../db/prisma";

export const mappingModel = {
  async findSourceRules(clientId: string) {
    return prisma.mapping.findMany({ where: { client_id: clientId, type: "source" } });
  },
  async findLocationRules(clientId: string) {
    return prisma.mapping.findMany({ where: { client_id: clientId, type: "location" } });
  },
  async findStageRules(clientId: string) {
    return prisma.mapping.findMany({ where: { client_id: clientId, type: "stage" } });
  },
};
