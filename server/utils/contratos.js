// utils/contratos.js

export const gerarDocumentoContrato = async (
  ex,
  tipo,
  obterPagamento,
  showToast,
) => {
  let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Contratos - ${ex.nome}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
        .page-break { page-break-before: always; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;}
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .justify { text-align: justify; }
    </style></head><body>`;

  const det = ex.detalhes || {};
  const grupos = ex.grupos || {};

  const dependentesIdsSet = new Set();
  Object.values(grupos).forEach((arr) =>
    arr.forEach((id) => dependentesIdsSet.add(String(id))),
  );

  const lideres = ex.usuarios.filter(
    (u) => u.id !== ex.guiaId && !dependentesIdsSet.has(String(u.id)),
  );

  if (lideres.length === 0) {
    if (showToast)
      showToast("Nenhum passageiro válido para gerar contrato.", "warning");
    return;
  }

  if (showToast) showToast("Gerando documento... Aguarde.", "warning");

  lideres.forEach((lider, index) => {
    const idsDependentes = (grupos[lider.id] || []).map(String);
    const dependentesObjs = ex.usuarios.filter((u) =>
      idsDependentes.includes(String(u.id)),
    );
    const grupoFamiliar = [lider, ...dependentesObjs];

    let tabelaHTML = `<table><tr><th>Nome Completo</th><th>Nascimento</th><th>CPF</th><th>Pagamento</th></tr>`;
    grupoFamiliar.forEach((m) => {
      const pagamentoStr = ex.aplicarParcelas
        ? obterPagamento(ex, m.id)
        : "À combinar";
      tabelaHTML += `<tr><td>${m.nome}</td><td>${m.nascimento || "-"}</td><td>${m.cpf || "-"}</td><td>${pagamentoStr}</td></tr>`;
    });
    tabelaHTML += `</table>`;

    const roteiroFormatado = det.roteiro
      ? det.roteiro.replace(/\n/g, "<br>")
      : "";
    const dependentesTexto =
      dependentesObjs.length > 0
        ? `<br><br><b>ACOMPANHANTES (DEPENDENTES):</b> ${dependentesObjs.map((d) => d.nome).join(", ")}.`
        : "";

    html += `
        <h3 class="center">CONTRATO DE AQUISIÇÃO DE PACOTE DE TURISMO</h3>
        <p class="bold">CLÁUSULA 1 – DAS PARTES:</p>
        <p class="justify"><b>A) CONTRATANTE:</b><br>
        O(a)Sr(a). ${lider.nome}, portador(a) do RG ${lider.orgaoExpeditor || "_______________"}, inscrito no CPF/MF sob o nº ${lider.cpf || "_______________"} residente e domiciliado na ${lider.endereco || "_______________"} - ${lider.cidade || "_______________"}, celular: ${lider.celular || "_______________"}, de agora em diante denominado CONTRATANTE;${dependentesTexto}</p>
        
        <p class="justify"><b>B) CONTRATADA:</b><br>
        58.904.532 LIVIA GRAZIELA DOS SANTOS, GRAZI TURISMO, inscrita no CNPJ/MF n.º 58.904.532/0001-33, empresa Home office sediada no município de Quissamã/RJ, na Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – Rj, cep 28737-488 de agora em diante denominada CONTRATADA.</p>
        
        <p class="justify">Este Contrato é formulado à luz do Código de Defesa do Consumidor, da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de Turismo – BRAZTOA. As partes acima identificadas, entre si, justo e acertado o presente Contrato dos serviços de GRAZI TURISMO deverá ler e aceitar este Termo de Uso, todas as demais políticas e princípios que o regem, declarando ciência e concordância com as cláusulas a seguir expostas:</p>

        <p class="justify"><b>CLÁUSULA 2 – DAS CONDIÇÕES E OBJETO DO PRESENTE CONTRATO</b><br>
        O presente contrato tem como OBJETO, a prestação, pela CONTRATADA, à CONTRATANTE, dos serviços na área de turismo. Os pacotes inclusos na prestação dos serviços contratados incluem a reserva e pagamento de vagas em meios de hospedagem (quando houver), transporte, contratação de serviços de recepção, transferência e assistência, segundo as especificações do pacote adquirido.<br>
        A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços, isentando sua responsabilidade por todo e qualquer problema, resultantes de casos fortuitos ou de força maior, ou seja: greves, distúrbios, quarentenas, epidemias, guerras, fenômenos naturais tais como terremotos, furacões, enchentes, avalanches, mas não limitando-se a estes, modificações, atrasos e/ou cancelamento devido a motivos técnicos, mecânicos e/ou meteorológicos, sobre os quais a operadora não possui poder de previsão ou controle.</p>
        
        <p class="justify"><b>CLÁUSULA 3 – DA CONTRATAÇÃO</b><br>
        Para aquisição dos serviços prestados pela GRAZI TURISMO, o contratante deverá escolher entre os valores constantes no ANEXO I do presente contrato.<br>
        É lícito ao Contratante, exercer seu direito de arrependimento, desistindo da contratação dos serviços, desde que o faça em até 7 (sete) dias contados da contratação, nos moldes do artigo 49 do Código de Defesa do Consumidor (com exceção das taxas/multas impostas em virtude do cancelamento, as quais serão aplicadas).</p>
        
        <p class="justify"><b>CLÁUSULA 4 – DO FINANCIAMENTO</b><br>
        O Contratante declara estar ciente de que após sua solicitação.<br>
        Após o envio da documentação solicitada, o contratante será notificado, em seguida, após a escolha do valor referente ao pacote selecionado, poderá efetuar o pagamento mediante pix, depósito ou transferência bancária e em dinheiro nos meses assim solicitado.<br>
        Não incidirá nenhum tipo de juros sobre o valor a ser pago para a obtenção dos créditos, independente do número de parcelas escolhidas pelo adquirente.</p>
        
        <p class="justify"><b>CLÁUSULA 5 – DO CANCELAMENTO, DA DESISTÊNCIA E DAS TAXAS</b><br>
        É lícito ao CLIENTE, requerer a desistência do contrato e solicitar o cancelamento em até 7 (sete) dias contados da contratação, nos moldes da cláusula 3, anteriormente descrita.<br>
        <b>5.1 – Condições do Cancelamento:</b><br>
        - Em pedidos de RESCISÃO com mais de 30 (trinta) dias de antecedência da data do início da viagem, a multa aplicada será de 10% (dez por cento);<br>
        - Entre 30 (trinta) a 20 (vinte) dias de antecedência da data do início da viagem, a multa aplicada será de 20% (vinte por cento);<br>
        - Entre 19 (dezenove) a 15 (quinze) dias de antecedência da data do início da viagem, a multa aplicada será de 50% (cinquenta por cento).<br>
        - Entre 14 (quatorze) a 10 (dez) dias de antecedência da data do início da viagem, a multa aplicada será de 80% (oitenta por cento).<br>
        - Em caso de RESCISÃO em menos de 9 (nove) dias de antecedência da data do início da viagem, a multa aplicada será de 100% (cem por cento), isto é, o CONTRATANTE não tem direito à restituição dos valores pagos no pacote.<br>
        <b>5.2 – Reversão do valor em crédito:</b><br>
        Com a migração para outro pacote em valor inferior, contratação futura de novo serviço ou contratação imediata de viagem disponível dentro do valor já pago. Em caso de cancelamento com reversão do valor em créditos, o contratante terá o prazo de até 12 meses para utilizar o valor disponível.<br>
        <b>5.3 – RESCISÃO da parte contratada:</b><br>
        Caso o pacote seja cancelado pela parte contratada por não atingir o número mínimo de participantes, por condições climáticas não favoráveis ou caso surjam motivos técnicos operacionais que impeçam o cumprimento total da atividade, você poderá optar por uma das três opções: Agendar a mesma viagem em outra data; Receber 100% do valor em créditos para serem usados em uma nova compra; Receber 100% através de pix, depósito ou transferência bancária.<br>
        <b>5.4 – Da inadimplência:</b><br>
        Caso o contratante deixe de efetuar o pagamento de algum dos meses solicitado, e não os atualize efetuando o pagamento do valor dentro do prazo do vencimento, considerar-se-á CANCELADO o pacote contratado.<br>
        <b>5.5 – Das taxas:</b><br>
        Todas as taxas do pacote contratado estão inclusas no valor final. Ressalvadas: Entradas a atrações turísticas que não estiverem estritamente especificadas no pacote; As despesas de caráter pessoal; As refeições não mencionadas, gorjetas, serviços de maleteiros.</p>

        <p class="justify"><b>CLÁUSULA 6 – DA UTILIZAÇÃO DO PACOTE ADQUIRIDO</b><br>
        O contratante poderá utilizar o pacote adquirido SOMENTE após a quitação de todas as parcelas.</p>
        
        <p class="justify"><b>CLÁUSULA 7 – CONDIÇÕES ESPECÍFICAS E OBRIGAÇÕES DA OPERADORA</b><br>
        7.1. A empresa contratada reserva-se do direito de promover as alterações que se fizerem necessárias quanto aos itinerários, hotéis, serviços, etc, sem prejuízo para o cliente.<br>
        7.2. Obriga-se a OPERADORA a: Prestar informações claras e precisas ao CLIENTE, sobre o produto adquirido e comunicar com antecedência as eventuais alterações de dias ou horários.</p>

        <p class="justify"><b>CLÁUSULA 8 – DA OCORRÊNCIA DE CASOS FORTUITOS E FORÇA MAIOR</b><br>
        Ocorrendo caso fortuito (fenômenos da natureza, calamidade pública, perturbação da ordem), que coloquem em risco a vida e a segurança do contratante, poderá a OPERADORA cancelar a viagem, sem acréscimo de multa, juros ou pagamento de indenização a qualquer título.</p>

        <p class="justify"><b>CLÁUSULA 9 – MEIOS DE TRANSPORTE</b><br>
        O contratante declara-se ciente de que a responsabilidade civil e criminal que decorra do contrato de transporte é da empresa de transporte. A OPERADORA limita-se a contratar empresas idôneas.</p>

        <p class="justify"><b>CLÁUSULA 10 – DOCUMENTAÇÃO DE VIAGEM</b><br>
        Adultos: Carteira de Identidade (RG), CNH, Passaporte. Crianças e Adolescentes: Certidão de Nascimento (original/autenticada), RG. É fundamental que os documentos estejam válidos e atualizados. Não são aceitos prints ou fotos.</p>

        <p class="justify"><b>CLÁUSULA 11 – SEGUROS DE VIAGENS NÃO INCLUSOS NO PACOTE</b><br>
        Caso o CLIENTE necessite de assistência médica ambulatorial ou hospitalar ou da ministração de remédios durante a viagem, deverá suportar as despesas deles decorrentes às suas próprias expensas.</p>

        <p class="justify"><b>CLÁUSULA 12 – ELEIÇÃO DE FORO</b><br>
        Para dirimir toda e qualquer dúvida decorrente do presente contrato, por eleição, os clientes elegem o foro da comarca de Quissamã/Carapebus/RJ.</p>

        <br><br>
        <p class="center">_________________________, ______/______/______</p>
        <p class="center">LOCAL E DATA</p>
        <br>
        <p class="center">_____________________________________________</p>
        <p class="center">CLIENTE CONTRATANTE</p>
        <br>
        <p class="center">58.904532.00-0 Livia Graziela dos Santos - GRAZI TURISMO</p>
        
        <div class="page-break"></div>

        <h3 class="center">ANEXO I</h3>
        <h4 class="center">DESCRIÇÃO DE PRESTAÇÃO DE SERVIÇO DA GRAZI TURISMO</h4>
        
        <p><b>Destino da viagem:</b> ${ex.lugar}<br>
        <b>Data de saída:</b> ${det.dataSaida || "__/__/____"} &nbsp;&nbsp;&nbsp;<b>Horário:</b> ${det.horaSaida || "__:__"}<br>
        <b>Data de retorno:</b> ${det.dataRetorno || "__/__/____"} &nbsp;&nbsp;&nbsp;<b>Horário:</b> ${det.horaRetorno || "__:__"}<br>
        <b>Transporte:</b> ${det.transporte || "_________________"} &nbsp;&nbsp;&nbsp;<b>Empresa:</b> ${det.empresa || "_________________"}</p>

        <p><b>DADOS DO RECEPTIVO (ROTEIRO) E SERVIÇOS PRESTADOS:</b><br>
        ${roteiroFormatado || "________________________________________________"}</p>

        <p><b>DADOS DOS PASSAGEIROS / GRUPOS:</b><br>
        ${tabelaHTML}
        </p>
        `;

    if (index < lideres.length - 1) html += `<div class="page-break"></div>`;
  });

  html += `</body></html>`;

  if (tipo === "doc") {
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Contratos_${ex.nome.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast("Contrato DOC baixado!", "success");
  } else if (tipo === "pdf") {
    const div = document.createElement("div");
    div.innerHTML = html;
    div.style.position = "absolute";
    div.style.left = "-9999px";
    div.style.top = "0";
    document.body.appendChild(div);

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
      margin: 15,
      filename: `Contratos_${ex.nome.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(div)
      .save()
      .then(() => {
        document.body.removeChild(div);
        if (showToast) showToast("Contrato PDF baixado!", "success");
      });
  }
};
