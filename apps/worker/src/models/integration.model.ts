import { prisma } from "../db/prisma";

export const integrationModel = {
  async findByClient(clientId: string, platform: string) {
    return prisma.integration.findUnique({
      where: { client_id_platform: { client_id: clientId, platform } },
    });
  },
};
