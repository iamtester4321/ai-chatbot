import { prisma } from "../config/db";
import { Prisma, User } from "@prisma/client";

interface CreateUserDTO {
  email: string;
  password?: string;
}

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async ({
  email,
  password,
}: CreateUserDTO): Promise<User> => {
  if (password) {
    return prisma.user.create({
      data: { email, password },
    });
  } else {
    return prisma.user.create({
      data: { email },
    });
  }
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });
};
