import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const { userId, excursaoId } = await readBody(event);
  return await prisma.excursao.update({
    where: { id: excursaoId },
    data: { usuarios: { disconnect: { id: userId } } },
  });
});
