import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, excursaoId, opcaoPagamento } = await readBody(event);

  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
    include: { _count: { select: { usuarios: true } } },
  });
  if (!excursao)
    throw createError({ statusCode: 404, message: "Excursão não encontrada." });
  if (excursao._count.usuarios >= excursao.vagas)
    throw createError({
      statusCode: 400,
      message: "Esta excursão já atingiu o limite de vagas!",
    });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { excursoes: true },
  });
  if (user?.excursoes.some((e) => e.id === excursaoId))
    throw createError({
      statusCode: 400,
      message: "O usuário já está cadastrado nesta excursão.",
    });

  let pagamentos: Record<string, string> = {};
  if (excursao.pagamentosJson) {
    try {
      pagamentos = JSON.parse(excursao.pagamentosJson);
    } catch (e) {}
  }
  if (opcaoPagamento) pagamentos[String(userId)] = String(opcaoPagamento);

  await prisma.user.update({
    where: { id: userId },
    data: { excursoes: { connect: { id: excursaoId } } },
  });

  await prisma.excursao.update({
    where: { id: excursaoId },
    data: { pagamentosJson: JSON.stringify(pagamentos) },
  });

  return { success: true };
});
