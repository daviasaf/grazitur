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
  const id = Number(event.context.params?.id);
  const method = getMethod(event);

  if (method === "DELETE") {
    return await prisma.user.delete({ where: { id } });
  }

  if (method === "PUT") {
    const body = await readBody(event);
    return await prisma.user.update({
      where: { id },
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
        parentes: {
          set: body.parentesIds?.map((id: number) => ({ id })) || [],
        },
      },
    });
  }
});
