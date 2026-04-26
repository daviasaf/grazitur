import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, excursaoId } = await readBody(event);

  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
    include: { _count: { select: { usuarios: true } } },
  });

  if (!excursao) {
    throw createError({ statusCode: 404, message: "Excursão não encontrada." });
  }

  // 2. Verifica se a excursão já está lotada
  if (excursao._count.usuarios >= excursao.vagas) {
    throw createError({
      statusCode: 400,
      message: "Esta excursão já atingiu o limite de vagas!",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { excursoes: true },
  });

  const jaEstaNaExcursao = user?.excursoes.some((e) => e.id === excursaoId);
  if (jaEstaNaExcursao) {
    throw createError({
      statusCode: 400,
      message: "O usuário já está cadastrado nesta excursão.",
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      excursoes: { connect: { id: excursaoId } },
    },
  });

  return { success: true };
});
