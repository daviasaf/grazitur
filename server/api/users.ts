import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const formatarNome = (nome: string) => {
  if (!nome) return nome;
  const preposicoes = ["da", "de", "di", "do", "du", "das", "dos", "e"];
  return nome
    .toLowerCase()
    .split(" ")
    .map((word) =>
      preposicoes.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

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

    let parentesToConnect =
      body.parentesIds?.map((id: number) => ({ id })) || [];

    let parentesDeToConnect: { id: number }[] = [];

    // Limpa a máscara do CPF do familiar antes de procurar na base de dados
    if (body.cpfFamiliar) {
      const familiar = await prisma.user.findUnique({
        where: { cpf: String(body.cpfFamiliar).replace(/[^\d]+/g, "") },
      });
      if (familiar) {
        // Se este novo usuário está sendo criado através do link/botão do familiar logado,
        // o familiar logado é o LÍDER. O novo usuário deve apontar para ele no array "parentesDe".
        parentesDeToConnect.push({ id: familiar.id });
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
          nome: formatarNome(body.nome),
          email: body.email,
          cpf: body.cpf ? String(body.cpf).replace(/[^\d]+/g, "") : "",
          rg: body.rg,
          orgaoExpeditor: body.orgaoExpeditor,
          nascimento: body.nascimento,
          celular: body.celular,
          cidade: body.cidade,
          endereco: body.endereco,
          idade: body.idade ? Number(body.idade) : null,
          isGuia: body.isGuia || false,
          parentes: { connect: parentesToConnect },
          parentesDe: { connect: parentesDeToConnect }, 
        },
      });
    } catch (e: any) {
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
