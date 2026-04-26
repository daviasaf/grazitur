import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const method = getMethod(event);

  if (method === "DELETE") {
    return await prisma.excursao.delete({ where: { id } });
  }

  if (method === "PUT") {
    const body = await readBody(event);
    return await prisma.excursao.update({
      where: { id },
      data: {
        nome: body.nome,
        lugar: body.lugar,
        preco: Number(body.preco),
        vagas: Number(body.vagas),
        guiaId: body.guiaId ? Number(body.guiaId) : null, // ATUALIZA O GUIA
      },
    });
  }
});
