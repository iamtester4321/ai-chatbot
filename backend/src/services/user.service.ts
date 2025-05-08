import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function findOrCreateUser(payload: {
  googleId: string;
  email: string;
  name: string;
}): Promise<User> {
  const { googleId, email } = payload;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return user;
  }

  user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { email },
    });
    return user;
  }

  user = await prisma.user.create({
    data: {
      email,
      password: null,
    },
  });

  return user;
}
