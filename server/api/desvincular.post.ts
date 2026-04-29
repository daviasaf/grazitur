import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, excursaoId } = await readBody(event);
  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
  });

  let pagamentos: Record<string, string> = {};
  let grupos: Record<string, string[]> = {};
  let assinaturas: Record<string, string> = {};

  if (excursao) {
    // 1. Remover Pagamentos
    if (excursao.pagamentosJson) {
      try {
        pagamentos = JSON.parse(excursao.pagamentosJson);
      } catch (e) {}
      delete pagamentos[String(userId)];
    }

    // 2. Remover dos Grupos de Contrato (Líder ou Dependente)
    // ... (após as remoções de pagamentos e assinaturas)

    // 2. Remover dos Grupos de Contrato (Líder ou Dependente)
    if (excursao.contratoGrupos) {
      try {
        grupos = JSON.parse(excursao.contratoGrupos);
      } catch (e) {}

      // Se for líder, remove o grupo inteiro (ou você pode querer apenas remover o líder)
      delete grupos[String(userId)];

      // Remove se ele for dependente de qualquer grupo
      for (const liderId in grupos) {
        if (Array.isArray(grupos[liderId])) {
          grupos[liderId] = grupos[liderId].filter(
            (id) => String(id) !== String(userId),
          );
          // Se o grupo ficou vazio, remove a chave do líder
          if (grupos[liderId].length === 0) delete grupos[liderId];
        }
      }
    }
    // ...

    // 3. Remover a Assinatura (se tiver)
    if (excursao.assinaturasJson) {
      try {
        assinaturas = JSON.parse(excursao.assinaturasJson);
      } catch (e) {}
      delete assinaturas[String(userId)];
    }
  }

  return await prisma.excursao.update({
    where: { id: excursaoId },
    data: {
      usuarios: { disconnect: { id: userId } },
      pagamentosJson: JSON.stringify(pagamentos),
      contratoGrupos: JSON.stringify(grupos),
      assinaturasJson: JSON.stringify(assinaturas),
    },
  });
});
