import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, excursaoId } = await readBody(event);
  const excursao = await prisma.excursao.findUnique({
    where: { id: excursaoId },
  });

  let pagamentos: Record<string, string> = {};
  if (excursao?.pagamentosJson) {
    try {
      pagamentos = JSON.parse(excursao.pagamentosJson);
    } catch (e) {}
    delete pagamentos[String(userId)];
  }

  return await prisma.excursao.update({
    where: { id: excursaoId },
    data: {
      usuarios: { disconnect: { id: userId } },
      pagamentosJson: JSON.stringify(pagamentos),
    },
  });
});
