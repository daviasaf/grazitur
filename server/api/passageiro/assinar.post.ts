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

  // Verifica se o usuário é um dependente
  if (excursao.contratoGrupos) {
    try {
      const grupos = JSON.parse(excursao.contratoGrupos);
      // Checa se o userId está dentro do array de dependentes de algum líder
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

  // Prepara o objeto de assinaturas
  let assinaturas: Record<string, string> = {};
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
