import { prisma } from "../../db/client";

export const UserService = {
  async getById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  },
};
