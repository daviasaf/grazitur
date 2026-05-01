// app/utils/exportacoes.js

const processarPagamento = (excursao, pId) => {
  if (!excursao.aplicarParcelas) return "À combinar";
  if (!excursao.pagamentos) return "Pendente";
  return excursao.pagamentos[String(pId)] || "Pendente";
};

const formatarCPFLista = (v) => {
  if (!v) return "-";
  let cpf = String(v).replace(/\D/g, "");
  if (cpf.length === 11) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
};

export const gerarContratoAssinadoPDF = async (
  exSelecionada,
  userId,
  showToast,
) => {
  try {
    const ex = exSelecionada;
    const grupos = ex.grupos || {};
    const ehDependente = Object.values(grupos).some((arr) =>
      arr.map(String).includes(String(userId)),
    );
    if (ehDependente) {
      showToast(
        "Apenas o titular do grupo pode baixar o contrato assinado.",
        "warning",
      );
      return;
    }

    showToast("Gerando documento... Aguarde.", "warning");

    const lider = ex.usuarios.find((u) => String(u.id) === String(userId));
    if (!lider) {
      showToast("Usuário não encontrado na excursão.", "danger");
      return;
    }

    const dependentesObjs = ex.usuarios.filter((u) =>
      (grupos[String(lider.id)] || []).map(String).includes(String(u.id)),
    );
    const grupoFamiliar = [lider, ...dependentesObjs];
    const det = ex.detalhes || {};

    let dataAssinaturaPassageiro = "_______________";
    let isAssinado = false;
    if (ex.assinaturas && ex.assinaturas[String(lider.id)]) {
      dataAssinaturaPassageiro = new Date(
        ex.assinaturas[String(lider.id)],
      ).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
      isAssinado = true;
    }

    const agora = new Date();
    const dataHoraAssinaturaContratada = agora.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    let tabelaHTML = `<table style="width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; font-size: 9.5pt; page-break-inside: auto;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #2C3E50; color: #ffffff; text-align: center; width: 5%;">Nº</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #2C3E50; color: #ffffff; text-align: left; width: 35%;">NOME COMPLETO</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #2C3E50; color: #ffffff; text-align: center; width: 15%;">NASCIMENTO</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #2C3E50; color: #ffffff; text-align: center; width: 20%;">DOCUMENTO</th>
          <th style="border: 1px solid #ddd; padding: 8px; background-color: #2C3E50; color: #ffffff; text-align: center; width: 25%;">PAGAMENTO</th>
        </tr>
      </thead>
      <tbody>`;

    grupoFamiliar.forEach((m, i) => {
      const bgStyle =
        i % 2 === 0
          ? "background-color: #f9f9f9;"
          : "background-color: #ffffff;";
      const pag = processarPagamento(ex, m.id);
      let nomeFormatado = m.nome;
      if (pag === "Criança de 0 a 1,9 meses - Isento") {
        nomeFormatado += " (Criança de colo)";
      }
      tabelaHTML += `<tr style="${bgStyle} page-break-inside: avoid; page-break-after: auto;">
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${i + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${nomeFormatado}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${m.nascimento || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${m.cpf || m.rg || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #2C3E50;">${pag}</td>
      </tr>`;
    });
    tabelaHTML += `</tbody></table>`;

    const roteiroHTML = (det.roteiro || "").replace(/\n/g, "<br>");
    const dependentesTexto =
      dependentesObjs.length > 0
        ? `<br><br><b>ACOMPANHANTES (DEPENDENTES):</b> ${dependentesObjs.map((d) => d.nome).join(", ")}.`
        : "";

    let valoresHtml = "Valores não especificados no sistema.";
    if (ex.valores && Array.isArray(ex.valores) && ex.valores.length > 0) {
      valoresHtml = ex.valores
        .map((v) => `<b>${v.vezes}x</b> de <b>R$ ${v.valor}</b>`)
        .join("<br>");
    }

    const contratoHTML = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10.5pt; line-height: 1.6; color: #333; padding: 20px;">
        <style>
          p, ul, li, div.box-destaque, table, tr, td, th { page-break-inside: avoid !important; }
          h1, h2, h3, h4, h5, .clausula-titulo { page-break-after: avoid !important; page-break-inside: avoid !important; }
          .page-break { page-break-before: always !important; }
          
          .header-doc { text-align: center; border-bottom: 2px solid #2C3E50; padding-bottom: 10px; margin-bottom: 20px; }
          .header-doc h1 { margin: 0; font-size: 18pt; color: #2C3E50; text-transform: uppercase; }
          .header-doc p { margin: 2px 0; font-size: 9pt; color: #666; }
          .center { text-align: center; }
          .justify { text-align: justify; }
          .clausula-titulo { font-weight: bold; font-size: 11pt; color: #2C3E50; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 3px;}
          .sub-item { margin-left: 20px; margin-top: 4px; }
          .box-destaque { background-color: #f4f6f8; border-left: 4px solid #2C3E50; padding: 10px 15px; margin-bottom: 15px; }
          .assinatura-box { margin-top: 40px; text-align: center; page-break-inside: avoid; }
          .linha-assinatura { border-top: 1px solid #000; width: 60%; margin: 0 auto 5px auto; padding-top: 5px; }
          .info-assinatura { font-size: 9pt; color: #555; }
        </style>

        <div class="header-doc">
          <h1>GRAZI TURISMO</h1>
          <p>CNPJ: 58.904.532/0001-33 | Cadastur: 58.904.532 LIVIA GRAZIELA DOS SANTOS</p>
          <p>Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – RJ, CEP 28737-488</p>
        </div>

        <h2 class="center" style="font-size: 14pt; margin-bottom: 20px;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TURÍSTICOS</h2>

        <div class="box-destaque justify">
          <b>A) CONTRATANTE:</b><br>
          O(a) Sr(a). <b>${lider.nome}</b>, portador(a) do RG ${lider.orgaoExpeditor || "_______________"}, inscrito no CPF sob o nº ${lider.cpf || "_______________"}, residente e domiciliado na ${lider.endereco || "_______________"} - ${lider.cidade || "_______________"}, celular: ${lider.celular || "_______________"}, de agora em diante denominado CONTRATANTE;${dependentesTexto}
        </div>
        
        <div class="box-destaque justify">
          <b>B) CONTRATADA:</b><br>
          58.904.532 LIVIA GRAZIELA DOS SANTOS, <b>GRAZI TURISMO</b>, inscrita no CNPJ/MF n.º 58.904.532/0001-33, sediada no município de Quissamã/RJ, na Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – RJ, CEP 28737-488, de agora em diante denominada CONTRATADA.
        </div>
        
        <p class="justify">Este Contrato é formulado à luz do Código de Defesa do Consumidor, da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de Turismo – BRAZTOA.</p>
        <p class="justify">As partes acima identificadas, entre si, justo e acertado o presente Contrato dos serviços de GRAZI TURISMO, declaram ciência e concordância com as cláusulas a seguir expostas.</p>

        <p class="clausula-titulo">CLÁUSULA 1 – DAS CONDIÇÕES E OBJETO DO PRESENTE CONTRATO</p>
        <p class="justify">O presente contrato tem como OBJETO a prestação, pela CONTRATADA, à CONTRATANTE, dos serviços na área de turismo.<br>
        Os pacotes inclusos na prestação dos serviços contratados incluem a reserva e pagamento de vagas em meios de hospedagem (quando houver), transporte, contratação de serviços de recepção, transferência e assistência, segundo as especificações do pacote adquirido.<br>
        A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços, isentando sua responsabilidade por todo e qualquer problema resultante de casos fortuitos ou de força maior, ou seja: greves, distúrbios, quarentenas, epidemias, guerras, fenômenos naturais tais como terremotos, furacões, enchentes, avalanches, mas não limitando-se a estes, modificações, atrasos e/ou cancelamento devido a motivos técnicos, mecânicos e/ou meteorológicos, sobre os quais a operadora não possui poder de previsão ou controle.</p>

        <p class="clausula-titulo">CLÁUSULA 2 – DA CONTRATAÇÃO</p>
        <p class="justify">Para aquisição dos serviços prestados pela GRAZI TURISMO, o contratante deverá escolher entre os valores constantes no ANEXO I do presente contrato.<br>
        É lícito ao Contratante exercer seu direito de arrependimento, desistindo da contratação dos serviços, desde que o faça em até 7 (sete) dias contados da contratação, nos moldes do artigo 49 do Código de Defesa do Consumidor (com exceção das taxas/multas impostas em virtude do cancelamento, as quais serão aplicadas).</p>

        <p class="clausula-titulo">CLÁUSULA 3 – DO FINANCIAMENTO</p>
        <p class="justify">O Contratante declara estar ciente de que, após sua solicitação e envio da documentação solicitada, será notificado. Em seguida, após a escolha do valor referente ao pacote selecionado, poderá efetuar o pagamento mediante pix, depósito, transferência bancária ou em dinheiro nos meses assim solicitado.<br>
        Não incidirá nenhum tipo de juros sobre o valor a ser pago para a obtenção dos créditos, independente do número de parcelas escolhidas pelo adquirente.</p>

        <p class="clausula-titulo">CLÁUSULA 4 – DO CANCELAMENTO, DA DESISTÊNCIA E DAS TAXAS</p>
        <p class="justify">É lícito ao CLIENTE requerer a desistência do contrato e solicitar o cancelamento em até 7 (sete) dias contados da contratação, nos moldes da cláusula anterior.</p>
        <p class="justify"><b>4.1 – Condições do Cancelamento</b></p>
        <ul class="sub-item" style="margin-top: 0; margin-bottom: 0;">
          <li>Em pedidos de RESCISÃO com mais de 30 (trinta) dias de antecedência da data do início da viagem, a multa aplicada será de 10% (dez por cento);</li>
          <li>Entre 30 (trinta) a 20 (vinte) dias de antecedência da data do início da viagem, a multa aplicada será de 20% (vinte por cento);</li>
          <li>Entre 19 (dezenove) a 15 (quinze) dias de antecedência da data do início da viagem, a multa aplicada será de 50% (cinquenta por cento);</li>
          <li>Entre 14 (quatorze) a 10 (dez) dias de antecedência da data do início da viagem, a multa aplicada será de 80% (oitenta por cento);</li>
          <li>Em caso de RESCISÃO em menos de 9 (nove) dias de antecedência da data do início da viagem, a multa aplicada será de 100% (cem por cento), e o CONTRATANTE não terá direito à restituição dos valores pagos no pacote.</li>
        </ul>
        <p class="justify"><b>4.2 – Reversão do valor em crédito</b><br>
        Com a migração para outro pacote em valor inferior, contratação futura de novo serviço ou contratação imediata de viagem disponível dentro do valor já pago.<br>
        Em caso de cancelamento com reversão do valor em créditos, o contratante terá o prazo de até 12 meses para utilizar o valor disponível.</p>
        <p class="justify"><b>4.3 – RESCISÃO pela parte contratada</b><br>
        Caso o pacote seja cancelado pela parte contratada por não atingir o número mínimo de participantes, por condições climáticas não favoráveis ou caso surjam motivos técnicos operacionais que impeçam o cumprimento total da atividade, o CONTRATANTE poderá optar por uma das três opções:<br>
        a) Agendar a mesma viagem em outra data;<br>
        b) Receber 100% do valor em créditos para serem usados em uma nova compra;<br>
        c) Receber 100% através de pix, depósito ou transferência bancária diretamente na conta-corrente do CONTRATANTE.</p>
        <p class="justify"><b>4.4 – Da inadimplência</b><br>
        Caso o contratante deixe de efetuar o pagamento de algum dos meses solicitado, e não o atualize dentro do prazo do vencimento, considerar-se-á CANCELADO o pacote contratado, incidindo a partir do cancelamento pela inadimplência as regras da cláusula 4.1 quanto ao período já pago.</p>
        <p class="justify"><b>4.5 – Das taxas</b><br>
        Todas as taxas do pacote contratado estão inclusas no valor final e serão inclusas no pacote contratado, ressalvadas:</p>
        <ul class="sub-item">
          <li>Entradas a atrações turísticas que não estiverem estritamente especificadas no pacote;</li>
          <li>As despesas de caráter pessoal;</li>
          <li>As refeições não mencionadas, gorjetas, serviços de maleteiros.</li>
        </ul>
        <p class="justify">Tais despesas serão de responsabilidade exclusiva do contratante.</p>

        <p class="clausula-titulo">CLÁUSULA 5 – DA UTILIZAÇÃO DO PACOTE ADQUIRIDO</p>
        <p class="justify">O contratante poderá utilizar o pacote adquirido SOMENTE após a quitação de todas as parcelas.</p>

        <p class="clausula-titulo">CLÁUSULA 6 – CONDIÇÕES ESPECÍFICAS E OBRIGAÇÕES DA OPERADORA</p>
        <p class="justify"><b>6.1</b> A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços, deste modo, a empresa contratada reserva-se do direito de promover as alterações que se fizerem necessárias quanto aos itinerários, hotéis, serviços, etc., sem prejuízo para o cliente.</p>
        <p class="justify"><b>6.2 – Obriga-se a OPERADORA a:</b><br>
        a) Prestar informações claras e precisas ao CLIENTE, sobre o produto adquirido, que serão documentadas no ANEXO I.<br>
        b) Comunicar com antecedência as eventuais alterações de dias ou horários de partida e chegada das viagens; modificações de categoria de apartamentos ou estabelecimentos afins.</p>
        <p class="justify"><b>6.3 – DA CIÊNCIA E ACEITAÇÃO DOS RISCOS</b><br>
        O CONTRATANTE declara estar ciente de que atividades turísticas envolvem riscos naturais e imprevisíveis, incluindo afogamentos, acidentes, mal súbito, lesões, etc. Declara ainda que participa por livre vontade, assumindo os riscos inerentes.</p>
        <p class="justify"><b>6.4 – DA RESPONSABILIDADE DO CONTRATANTE</b><br>
        É de inteira responsabilidade do CONTRATANTE: estar em boas condições de saúde; informar limitações físicas ou médicas; seguir orientações da equipe; zelar por sua segurança. A CONTRATADA não se responsabiliza por imprudência ou negligência do CONTRATANTE.</p>
        <p class="justify"><b>6.5 – DO COMPORTAMENTO DO PASSAGEIRO</b><br>
        A CONTRATADA poderá desligar da excursão, sem reembolso, o passageiro que colocar em risco a segurança do grupo, estiver sob efeito de substâncias ilícitas/álcool que comprometam a segurança, desrespeitar normas ou praticar atos que afetem o andamento da viagem.</p>
        <p class="justify"><b>6.6 – DAS BAGAGENS E OBJETOS PESSOAIS</b><br>
        A CONTRATADA não se responsabiliza por perda, extravio, dano ou roubo de bagagens, dinheiro ou objetos pessoais.</p>

        <p class="clausula-titulo">CLÁUSULA 7 – SEGURO VIAGEM</p>
        <p class="justify">A CONTRATADA informará se o pacote inclui ou não seguro viagem.<br>
        Quando não incluso, a CONTRATADA recomenda expressamente a contratação. O CONTRATANTE declara ciência, assumindo total responsabilidade pelas despesas em caso de não contratação.</p>

        <p class="clausula-titulo">CLÁUSULA 8 – DA OCORRÊNCIA DE CASOS FORTUITOS E FORÇA MAIOR</p>
        <p class="justify">Ocorrendo caso fortuito ou força maior que coloque em risco a segurança do contratante, poderá a OPERADORA cancelar a viagem, sem acréscimo de multas ou indenizações.</p>

        <p class="clausula-titulo">CLÁUSULA 9 – DOCUMENTAÇÃO DE VIAGEM E FORO</p>
        <p class="justify">É fundamental que os documentos estejam válidos e atualizados (RG, CNH, Passaporte, Certidão para menores). Não são aceitos prints ou fotos. É dever do contratante providenciar sua documentação.<br>
        Para dirimir dúvidas, as partes elegem o foro da comarca de Quissamã/Carapebus/RJ.</p>

        <div class="box-destaque justify" style="margin-top: 20px;">
          <b>O CONTRATANTE declara, para todos os fins legais, que:</b>
          <ul class="sub-item">
            <li>Leu integralmente o presente contrato e compreendeu todas as cláusulas;</li>
            <li>Está ciente dos riscos inerentes às atividades turísticas e assume a responsabilidade por sua participação;</li>
            <li>Compromete-se a cumprir todas as orientações da equipe e atesta estar em condições físicas e de saúde adequadas.</li>
          </ul>
        </div>

        <div class="html2pdf__page-break"></div>

        <div style="page-break-inside: avoid; padding-top: 20px;">
          <div class="header-doc">
            <h1>ANEXO I</h1>
            <p>DESCRIÇÃO DE PRESTAÇÃO DE SERVIÇO DA GRAZI TURISMO</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10pt; page-break-inside: avoid;">
            <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 10px;"><b>Destino da viagem:</b> ${ex.lugar}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px; width: 50%;"><b>Saída:</b> ${det.dataSaida || "__/__/____"} às ${det.horaSaida || "__:__"}</td>
                <td style="border: 1px solid #ddd; padding: 10px; width: 50%;"><b>Retorno:</b> ${det.dataRetorno || "__/__/____"} às ${det.horaRetorno || "__:__"}</td>
            </tr>
            <tr>
                <td colspan="2" style="border: 1px solid #ddd; padding: 10px;"><b>Transporte:</b> ${det.transporte || "_________________"} | <b>Empresa:</b> ${det.empresa || "_________________"}</td>
            </tr>
          </table>

          <p class="clausula-titulo">DADOS DO RECEPTIVO (ROTEIRO) E SERVIÇOS PRESTADOS</p>
          <p class="justify">${roteiroHTML || "________________________________________________"}</p>

          <p class="clausula-titulo">VALORES DO PACOTE</p>
          <p class="justify">${valoresHtml}</p>

          <p class="clausula-titulo">DADOS DOS PASSAGEIROS E PAGAMENTOS ACORDADOS</p>
          ${tabelaHTML}

          <div class="assinatura-box">
            <p style="margin-bottom: 40px;">Quissamã/RJ, ${isAssinado ? dataAssinaturaPassageiro.split(",")[0] : "____/____/____"}</p>
            
            <div class="linha-assinatura"></div>
            <p style="margin: 0;"><b>CONTRATANTE: ${lider.nome}</b></p>
            <p class="info-assinatura">Assinado digitalmente em: ${isAssinado ? dataAssinaturaPassageiro : "Pendente"}</p>
            
            <br><br>
            
            <div class="linha-assinatura"></div>
            <p style="margin: 0;"><b>58.904.532 LÍVIA GRAZIELA DOS SANTOS - GRAZI TURISMO</b></p>
            <p class="info-assinatura">Data de emissão: ${dataHoraAssinaturaContratada}</p>
          </div>
        </div>
      </div>
    `;

    if (!window.html2pdf) {
      await new Promise((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    const opt = {
      margin: 10,
      filename: `Contrato_${lider.nome.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(contratoHTML)
      .save()
      .then(() => {
        showToast("Contrato assinado baixado com sucesso!", "success");
      })
      .catch((err) => {
        console.error("Erro na geração do PDF:", err);
        showToast("Falha ao desenhar o PDF.", "danger");
      });
  } catch (e) {
    console.error("Erro ao gerar contrato assinado:", e);
    showToast("Erro ao gerar contrato assinado. Tente novamente.", "danger");
  }
};

export const exportarListaPDF = async (excursao, showToast) => {
  try {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Lista de Passageiros - ${excursao.nome}`, 14, 20);
    const head = [["Nº", "Nome Completo", "CPF", "Órgão"]];

    let todosUsuarios = [...(excursao.usuarios || [])];
    if (
      excursao.guia &&
      !todosUsuarios.some((u) => u.id === excursao.guia.id)
    ) {
      todosUsuarios.push(excursao.guia);
    }
    const listaCompleta = todosUsuarios.sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );

    const dados = listaCompleta.map((u, i) => {
      let nomeFormatado = u.nome;
      if (u.id === excursao.guiaId) {
        nomeFormatado += " (GUIA)";
      } else if (
        processarPagamento(excursao, u.id) ===
        "Criança de 0 a 1,9 meses - Isento"
      ) {
        nomeFormatado += " (Criança de colo)";
      }
      return [
        i + 1,
        nomeFormatado,
        formatarCPFLista(u.cpf),
        u.orgaoExpeditor || "-",
      ];
    });

    autoTable(doc, { startY: 30, head: head, body: dados });
    doc.save(`Lista_${excursao.nome.replace(/\s+/g, "_")}.pdf`);
    showToast("Lista PDF gerada!", "success");
  } catch (e) {
    console.error(e);
    showToast("Erro ao gerar PDF", "danger");
  }
};

export const exportarListaExcel = (excursao, showToast) => {
  let csv = "\uFEFFNº;Nome;CPF;Orgao\n";

  let todosUsuarios = [...(excursao.usuarios || [])];
  if (excursao.guia && !todosUsuarios.some((u) => u.id === excursao.guia.id)) {
    todosUsuarios.push(excursao.guia);
  }
  const listaCompleta = todosUsuarios.sort((a, b) =>
    a.nome.localeCompare(b.nome),
  );

  listaCompleta.forEach((u, i) => {
    let nomeFormatado = u.nome;
    if (u.id === excursao.guiaId) {
      nomeFormatado += " (GUIA)";
    } else if (
      processarPagamento(excursao, u.id) === "Criança de 0 a 1,9 meses - Isento"
    ) {
      nomeFormatado += " (Criança de colo)";
    }
    csv += `${i + 1};${nomeFormatado};${formatarCPFLista(u.cpf)};${u.orgaoExpeditor || "-"}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Lista_${excursao.nome}.csv`;
  link.click();
  showToast("Lista Excel exportada!", "success");
};

export const exportarSeedUsuarios = (usuarios, showToast) => {
  try {
    if (!usuarios || usuarios.length === 0) {
      showToast("Não há usuários para exportar.", "warning");
      return;
    }
    const dadosLimpos = usuarios.map(
      ({ createdAt, updatedAt, ...rest }) => rest,
    );
    const data = JSON.stringify(dadosLimpos, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seed_usuarios_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Arquivo de SEED gerado com sucesso!", "success");
  } catch (e) {
    console.error(e);
    showToast("Erro ao gerar arquivo de backup.", "danger");
  }
};
