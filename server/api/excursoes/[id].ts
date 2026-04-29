import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const method = getMethod(event);

  if (method === "DELETE") {
    return await prisma.excursao.delete({
      where: { id },
    });
  }

  if (method === "PUT") {
    const body = await readBody(event);

    // Pegamos o que veio no body ou mantemos o que está no banco por padrão
    let assinaturasParaSalvar = body.assinaturasJson;

    // Buscamos a excursão atual no banco para comparar as mudanças
    const excursaoAtual = await prisma.excursao.findUnique({
      where: { id },
    });

    if (excursaoAtual) {
      let assinaturas: Record<string, any> = {};

      try {
        // Carrega as assinaturas atuais
        assinaturas = JSON.parse(
          excursaoAtual.assinaturasJson || "{}",
        ) as Record<string, any>;
      } catch (e) {
        assinaturas = {} as Record<string, any>;
      }

      let houveMudancaQueInvalida = false;

      // =====================================================
      // 1. LÓGICA DE PAGAMENTO
      // =====================================================

      if (
        body.pagamentosJson &&
        excursaoAtual.pagamentosJson !== body.pagamentosJson
      ) {
        try {
          const pagsAntigos = JSON.parse(
            excursaoAtual.pagamentosJson || "{}",
          ) as Record<string, any>;

          const pagsNovos = JSON.parse(body.pagamentosJson) as Record<
            string,
            any
          >;

          // Verifica cada passageiro
          for (const userId in pagsNovos) {
            if (pagsNovos[userId] !== pagsAntigos[userId]) {
              if (assinaturas[userId]) {
                delete assinaturas[userId];
                houveMudancaQueInvalida = true;
              }
            }
          }
        } catch (e) {
          console.error("Erro ao processar mudança de pagamentos:", e);
        }
      }

      // =====================================================
      // 2. LÓGICA DE GRUPOS
      // =====================================================

      if (
        body.contratoGrupos &&
        excursaoAtual.contratoGrupos !== body.contratoGrupos
      ) {
        try {
          const gruposAntigos = JSON.parse(
            excursaoAtual.contratoGrupos || "{}",
          ) as Record<string, string[]>;

          const gruposNovos = JSON.parse(body.contratoGrupos) as Record<
            string,
            string[]
          >;

          // Se mudou líder ou dependentes
          for (const lider in gruposNovos) {
            const arrayAntigo = gruposAntigos[lider] || [];

            const arrayNovo = gruposNovos[lider] || [];

            if (
              arrayAntigo.length !== arrayNovo.length ||
              !arrayAntigo.every((val) => arrayNovo.includes(val))
            ) {
              if (assinaturas[lider]) {
                delete assinaturas[lider];
                houveMudancaQueInvalida = true;
              }
            }
          }
        } catch (e) {
          console.error("Erro ao processar mudança de grupos:", e);
        }
      }

      // =====================================================
      // DEFINIR O QUE SALVAR
      // =====================================================

      if (houveMudancaQueInvalida) {
        assinaturasParaSalvar = JSON.stringify(assinaturas);
      } else if (!assinaturasParaSalvar) {
        assinaturasParaSalvar = excursaoAtual.assinaturasJson;
      }
    }

    // =====================================================
    // UPDATE FINAL
    // =====================================================

    return await prisma.excursao.update({
      where: { id },

      data: {
        nome: body.nome,
        lugar: body.lugar,
        vagas: Number(body.vagas),

        guiaId: body.guiaId ? Number(body.guiaId) : null,

        valores: body.valores,

        ativarContrato: body.ativarContrato,

        aplicarParcelas: body.aplicarParcelas,

        contratoDetalhes: body.contratoDetalhes,

        contratoGrupos: body.contratoGrupos,

        pagamentosJson: body.pagamentosJson,

        assinaturasJson: assinaturasParaSalvar,

        liberarContratos: body.liberarContratos || false,
      },
    });
  }
});
