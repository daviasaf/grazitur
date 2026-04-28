import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, excursaoId } = body;

  if (!userId || !excursaoId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Dados de assinatura incompletos.",
    });
  }

  // Busca a excursão
  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
  });

  if (!excursao) {
    throw createError({
      statusCode: 404,
      statusMessage: "Excursão não encontrada.",
    });
  }

  // Prepara o objeto de assinaturas
  let assinaturas = {};
  if (excursao.assinaturasJson) {
    try {
      assinaturas = JSON.parse(excursao.assinaturasJson);
    } catch (e) {
      console.error("Erro ao ler assinaturas antigas", e);
    }
  }

  // Registra a assinatura com a data/hora atual ISO
  assinaturas[String(userId)] = new Date().toISOString();

  // Salva no banco de dados
  await prisma.excursao.update({
    where: { id: excursaoId },
    data: {
      assinaturasJson: JSON.stringify(assinaturas),
    },
  });

  return { success: true, message: "Contrato assinado com sucesso." };
});
