import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === "GET") {
    return await prisma.excursao.findMany({
      include: {
        usuarios: true,
        guia: true,
        _count: { select: { usuarios: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (method === "POST") {
    const body = await readBody(event);
    return await prisma.excursao.create({
      data: {
        nome: body.nome,
        lugar: body.lugar,
        vagas: Number(body.vagas),
        guiaId: body.guiaId ? Number(body.guiaId) : null,
        valores: body.valores,
        ativarContrato: body.ativarContrato || false,
        aplicarParcelas: body.aplicarParcelas || false,
        contratoDetalhes: body.contratoDetalhes || "{}",
        contratoGrupos: body.contratoGrupos || "{}",
      },
    });
  }
});
