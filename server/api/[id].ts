import { prisma } from "../utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const method = getMethod(event);

  if (method === "DELETE") {
    return await prisma.user.delete({ where: { id } });
  }

  if (method === "PUT") {
    const body = await readBody(event);
    return await prisma.user.update({
      where: { id },
      data: { ...body, idade: Number(body.idade) },
    });
  }
});
