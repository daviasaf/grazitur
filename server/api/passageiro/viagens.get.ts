import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let cpf = query.cpf;

  if (!cpf) {
    throw createError({
      statusCode: 400,
      statusMessage: "O CPF é obrigatório.",
    });
  }

  cpf = cpf.replace(/[^\d]+/g, "");

  const user = await prisma.user.findFirst({
    where: { cpf: cpf },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Nenhum passageiro encontrado com este CPF.",
    });
  }


  const excursoes = await prisma.excursao.findMany({
    where: {
      usuarios: {
        some: { id: user.id },
      },
    },
    include: {
      usuarios: true, 
    },
  });


  const excursoesFormatadas = excursoes.map((ex) => {
    let val = [];
    let pags = {};
    let det = {};
    let grp = {};
    let assinaturas = {};

    if (ex.valores) {
      try {
        val =
          typeof ex.valores === "string" ? JSON.parse(ex.valores) : ex.valores;
      } catch (e) {}
    }
    if (ex.pagamentosJson) {
      try {
        pags = JSON.parse(ex.pagamentosJson);
      } catch (e) {}
    }
    if (ex.contratoDetalhes) {
      try {
        det = JSON.parse(ex.contratoDetalhes);
      } catch (e) {}
    }
    if (ex.contratoGrupos) {
      try {
        grp = JSON.parse(ex.contratoGrupos);
      } catch (e) {}
    }
    if (ex.assinaturasJson) {
      try {
        assinaturas = JSON.parse(ex.assinaturasJson);
      } catch (e) {}
    }

    return {
      ...ex,
      valores: Array.isArray(val) ? val : [],
      pagamentos: pags,
      detalhes: det,
      grupos: grp,
      assinaturas: assinaturas,
    };
  });

  return {
    user,
    excursoes: excursoesFormatadas,
  };
});
