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

  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
  });

  if (!excursao) {
    throw createError({
      statusCode: 404,
      statusMessage: "Excursão não encontrada.",
    });
  }


  if (excursao.contratoGrupos) {
    try {
      const grupos = JSON.parse(excursao.contratoGrupos);

      const ehDependente = Object.values(grupos).some((dependentesArray: any) =>
        dependentesArray.map(String).includes(String(userId)),
      );

      if (ehDependente) {
        throw createError({
          statusCode: 403,
          statusMessage:
            "Dependentes não assinam o contrato, apenas o titular.",
        });
      }
    } catch (e) {
      console.error("Erro ao verificar dependente:", e);
    }
  }


  let assinaturas: Record<string, string> = {};
  if (excursao.assinaturasJson) {
    try {
      assinaturas = JSON.parse(excursao.assinaturasJson);
    } catch (e) {
      console.error("Erro ao ler assinaturas antigas", e);
    }
  }


  assinaturas[String(userId)] = new Date().toISOString();


  await prisma.excursao.update({
    where: { id: excursaoId },
    data: {
      assinaturasJson: JSON.stringify(assinaturas),
    },
  });

  return { success: true, message: "Contrato assinado com sucesso." };
});
