// Função auxiliar para processar texto de pagamento internamente
const processarPagamento = (excursao, pId) => {
  if (!excursao.aplicarParcelas) return "À combinar";
  if (!excursao.pagamentos) return "Pendente";
  return excursao.pagamentos[String(pId)] || "Pendente";
};

// NOVA FUNÇÃO: Gera o PDF de apenas UM contrato assinado (Versão Final com Assinatura Dupla)
export const gerarContratoAssinadoPDF = async (
  exSelecionada,
  userId,
  showToast,
) => {
  showToast("Gerando contrato assinado... Aguarde.", "warning");
  try {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule;
    const doc = new jsPDF();

    const ex = exSelecionada;
    const det = ex.detalhes || {};
    const grupos = ex.grupos || {};

    // Busca o passageiro (Líder) garantindo comparação de String
    const lider = ex.usuarios.find((u) => String(u.id) === String(userId));

    if (!lider) {
      showToast("Passageiro não encontrado.", "danger");
      return;
    }

    const nomeLiderSafe = lider.nome || "Passageiro";
    const idsDependentes = (grupos[String(lider.id)] || []).map(String);
    const dependentesObjs = ex.usuarios.filter((u) =>
      idsDependentes.includes(String(u.id)),
    );

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      "CONTRATO DE PRESTAÇÃO DE SERVIÇOS E AQUISIÇÃO DE PACOTE TURÍSTICO",
      105,
      20,
      { align: "center" },
    );

    doc.setFontSize(10);
    let textY = 30;

    const addText = (txt, isBold = false, marginT = 0) => {
      textY += marginT;
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const safeTxt = String(txt || "");
      const lines = doc.splitTextToSize(safeTxt, 180);
      for (let i = 0; i < lines.length; i++) {
        if (textY > 280) {
          doc.addPage();
          textY = 20;
        }
        doc.text(lines[i], 15, textY, { maxWidth: 180 });
        textY += 5;
      }
    };

    const dependentesTexto =
      dependentesObjs.length > 0
        ? ` ACOMPANHANTES (DEPENDENTES): ${dependentesObjs.map((d) => d.nome).join(", ")}.`
        : "";

    addText("CLÁUSULA 1 – DAS PARTES", true, 5);
    addText(
      `A) CONTRATANTE: O(a) Sr(a). ${nomeLiderSafe}, portador(a) do RG ${lider.orgaoExpeditor || "_______________"}, inscrito no CPF sob o nº ${lider.cpf || "_______________"}, residente e domiciliado na ${lider.endereco || "_______________"} - ${lider.cidade || "_______________"}, celular: ${lider.celular || "_______________"}.${dependentesTexto}`,
    );
    addText(
      `B) CONTRATADA: 58.904.532 LÍVIA GRAZIELA DOS SANTOS – GRAZI TURISMO, inscrita no CNPJ nº 58.904.532/0001-33, com sede em Quissamã/RJ.`,
    );
    addText(
      `Este Contrato é formulado à luz do Código de Defesa do Consumidor, da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de Turismo – BRAZTOA.`,
    );

    addText("CLÁUSULA 2 – DO OBJETO", true, 5);
    addText(
      "O presente contrato tem como objeto a prestação de serviços de intermediação e organização turística, incluindo transporte, hospedagem (quando houver) e passeios. A CONTRATADA atua como intermediadora, não sendo responsável direta pela execução de serviços de terceiros.",
    );

    addText("CLÁUSULA 3 – DA CIÊNCIA E ACEITAÇÃO DOS RISCOS", true, 5);
    addText(
      "O CONTRATANTE declara estar ciente de que atividades turísticas envolvem riscos naturais (afogamento, acidentes, mal súbito, lesões). Declara participar por livre vontade, assumindo tais riscos.",
    );

    addText("CLÁUSULA 4 – DA RESPONSABILIDADE E SAÚDE", true, 5);
    addText(
      "É responsabilidade do CONTRATANTE estar em boas condições de saúde, informar limitações, seguir orientações da equipe e zelar por sua segurança. A CONTRATADA não se responsabiliza por ocorrências decorrentes de imprudência ou negligência.",
    );

    addText("CLÁUSULA 5 – DO SEGURO VIAGEM", true, 5);
    addText(
      "O CONTRATANTE declara ciência sobre a contratação de seguro viagem. Está ciente de que despesas médicas, hospitalares ou funerárias são de sua inteira responsabilidade.",
    );

    addText("CLÁUSULA 6 – ATENDIMENTO MÉDICO E EMERGÊNCIAS", true, 5);
    addText(
      "Em caso de emergência, a CONTRATADA prestará apoio na busca de socorro, porém todas as despesas serão de responsabilidade exclusiva do CONTRATANTE ou familiares.",
    );

    addText("CLÁUSULA 7 – DO TRANSPORTE E TERCEIROS", true, 5);
    addText(
      "A responsabilidade civil e criminal pelo transporte é exclusiva da empresa transportadora. A CONTRATADA isenta-se de responsabilidade por acidentes, atrasos ou falhas mecânicas.",
    );

    addText("CLÁUSULA 8 – CASO FORTUITO E FORÇA MAIOR", true, 5);
    addText(
      "A CONTRATADA não se responsabiliza por fenômenos da natureza, calamidade pública, greves ou problemas técnicos que exijam alteração ou cancelamento da viagem.",
    );

    addText(
      "CLÁUSULA 9 – CANCELAMENTO, DESISTÊNCIA E TAXAS (Pelo Contratante)",
      true,
      5,
    );
    addText(
      "Rescisão com mais de 30 dias: multa 10%; Entre 30 a 20 dias: 20%; Entre 19 a 15 dias: 50%; Entre 14 a 10 dias: 80%; Menos de 9 dias: 100% (sem restituição). O valor pode ser revertido em crédito para futuras viagens.",
    );

    addText("CLÁUSULA 10 – CANCELAMENTO PELA CONTRATADA", true, 5);
    addText(
      "Caso o pacote seja cancelado por falta de quórum ou condições climáticas, o cliente poderá optar por reagendamento, crédito ou reembolso integral.",
    );

    addText("CLÁUSULA 11 – COMPORTAMENTO E BAGAGENS", true, 5);
    addText(
      "A CONTRATADA poderá desligar da excursão, sem reembolso, quem colocar em risco o grupo. A CONTRATADA não se responsabiliza por perda, roubo ou extravio de objetos pessoais e bagagens.",
    );

    addText("CLÁUSULA 12 – DO FINANCIAMENTO E QUITAÇÃO", true, 5);
    addText(
      "O serviço só será prestado após quitação total. Não há cobrança de juros. Inadimplência gera o cancelamento do pacote.",
    );

    addText("CLÁUSULA 13 – FORO", true, 5);
    addText(
      "As partes elegem o foro da comarca de Quissamã/RJ para dirimir eventuais dúvidas.",
    );

    addText("DESCRIÇÃO DA PRESTAÇÃO DE SERVIÇO", true, 10);
    addText(`Destino da viagem: ${ex.lugar || "Não informado"}`, false, 2);
    addText(
      `Data de saída: ${det.dataSaida || "__/__/____"}   Horário: ${det.horaSaida || "__:__"}`,
      false,
      0,
    );
    addText(
      `Data de retorno: ${det.dataRetorno || "__/__/____"}   Horário: ${det.horaRetorno || "__:__"}`,
      false,
      0,
    );
    addText(
      `Transporte: ${det.transporte || "_________________"}   Empresa: ${det.empresa || "_________________"}`,
      false,
      0,
    );

    textY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DOS PASSAGEIROS E PAGAMENTOS:", 15, textY);
    textY += 5;

    const grupoFamiliarTabela = [lider, ...dependentesObjs];
    const head = [["Nome Completo", "Nascimento", "CPF", "Pagamento"]];
    const body = grupoFamiliarTabela.map((m) => [
      m.nome || "-",
      m.nascimento || "-",
      m.cpf || "-",
      processarPagamento(ex, m.id),
    ]);

    autoTable(doc, {
      startY: textY,
      head: head,
      body: body,
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: 0,
        font: "helvetica",
        lineWidth: 0.1,
        lineColor: 0,
      },
      theme: "grid",
      margin: { left: 15, right: 15 },
    });

    textY = doc.lastAutoTable.finalY + 15;

    if (textY + 60 > 280) {
      doc.addPage();
      textY = 20;
    }

    addText(
      "DECLARAÇÃO FINAL: O CONTRATANTE declara que leu, compreendeu e concorda com todas as cláusulas acima, especialmente quanto aos riscos envolvidos e responsabilidades assumidas.",
      true,
      5,
    );

    textY += 20;

    // --- LOGICA DE ASSINATURA DUPLA ---
    const dataAssinaturaPassageiro = ex.assinaturas?.[String(lider.id)]
      ? new Date(ex.assinaturas[String(lider.id)]).toLocaleDateString("pt-BR")
      : "____/____/____";

    const dataHoje = new Date().toLocaleDateString("pt-BR");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0); // Verde para status digital

    // Assinatura do Passageiro
    doc.text(
      `ASSINADO DIGITALMENTE EM: ${dataAssinaturaPassageiro}`,
      105,
      textY - 2,
      { align: "center" },
    );
    doc.setTextColor(0, 0, 0);
    doc.text("_____________________________________________", 105, textY, {
      align: "center",
    });
    textY += 5;
    doc.setFont("helvetica", "normal");
    doc.text(`CONTRATANTE: ${nomeLiderSafe}`, 105, textY, { align: "center" });

    textY += 20;

    // Assinatura do Guia
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 128, 0);
    doc.text(`ASSINADO DIGITALMENTE EM: ${dataHoje}`, 105, textY - 2, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
    doc.text("_____________________________________________", 105, textY, {
      align: "center",
    });
    textY += 5;
    doc.setFont("helvetica", "normal");
    doc.text(
      "CONTRATADA: 58.904.532 LÍVIA GRAZIELA DOS SANTOS - GRAZI TURISMO",
      105,
      textY,
      { align: "center" },
    );

    doc.save(`Contrato_Assinado_${nomeLiderSafe.replace(/\s+/g, "_")}.pdf`);
    showToast("Contrato baixado!", "success");
  } catch (error) {
    console.error("ERRO PDF:", error);
    showToast("Erro ao gerar PDF.", "danger");
  }
};

// Funções de exportação de lista mantidas para referência
export const exportarListaPDF = async (excursao, showToast) => {
  try {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Lista de Passageiros - ${excursao.nome}`, 14, 20);
    const head = [["Nº", "Nome Completo", "CPF", "Órgão"]];
    const dados = excursao.usuarios.map((u, i) => [
      i + 1,
      u.nome,
      u.cpf || "-",
      u.orgaoExpeditor || "-",
    ]);
    autoTable(doc, { startY: 30, head: head, body: dados });
    doc.save(`Lista_${excursao.nome.replace(/\s+/g, "_")}.pdf`);
    showToast("Lista PDF baixada!", "success");
  } catch (e) {
    showToast("Erro na lista.", "danger");
  }
};

export const exportarListaExcel = (excursao, showToast) => {
  let csv = "\uFEFFNº;Nome;CPF;Orgao\n";
  excursao.usuarios.forEach((u, i) => {
    csv += `${i + 1};${u.nome};${u.cpf || "-"};${u.orgaoExpeditor || "-"}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Lista_${excursao.nome.replace(/\s+/g, "_")}.csv`;
  link.click();
  showToast("Lista Excel baixada!", "success");
};
