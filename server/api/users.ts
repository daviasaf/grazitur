import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === "GET") {
    return await prisma.user.findMany({
      include: { parentes: true, parentesDe: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (method === "POST") {
    const body = await readBody(event);

    // Arrays de parentes para conectar
    let parentesToConnect =
      body.parentesIds?.map((id: number) => ({ id })) || [];

    // Lógica Nova: Se o passageiro digitou o CPF de um familiar
    if (body.cpfFamiliar) {
      const familiar = await prisma.user.findUnique({
        where: { cpf: body.cpfFamiliar },
      });
      if (familiar) {
        parentesToConnect.push({ id: familiar.id });
      } else {
        throw createError({
          statusCode: 404,
          message: "Nenhum passageiro encontrado com este CPF de familiar.",
        });
      }
    }

    try {
      return await prisma.user.create({
        data: {
          nome: body.nome,
          cpf: body.cpf,
          rg: body.rg,
          orgaoExpeditor: body.orgaoExpeditor,
          nascimento: body.nascimento,
          celular: body.celular,
          cidade: body.cidade,
          endereco: body.endereco,
          idade: body.idade ? Number(body.idade) : null,
          isGuia: body.isGuia || false,
          parentes: { connect: parentesToConnect },
        },
      });
    } catch (e: any) {
      // Captura o erro de CPF Duplicado no banco
      if (e.code === "P2002") {
        throw createError({
          statusCode: 400,
          message: "Este CPF já está cadastrado no sistema!",
        });
      }
      throw e;
    }
  }
});
