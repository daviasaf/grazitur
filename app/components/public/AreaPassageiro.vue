<template>
    <div>
        <!-- ESTADO NÃO LOGADO (LOGIN DO PASSAGEIRO) -->
        <div v-if="!usuarioLogado" class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white mt-5">
            <!-- Ícone Adicionado Aqui -->
            <div class="mb-4 text-brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="currentColor" class="mb-2"
                    viewBox="0 0 16 16">
                    <path
                        d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.496 2.496 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A43.608 43.608 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43.306 43.306 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44.304 44.304 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994ZM8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.304 44.304 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1" />
                </svg>
            </div>

            <h3 class="fw-bold text-dark mb-2">Acessar Minha Viagem</h3>
            <p class="text-muted small mb-4">Digite seu CPF para ver seus contratos e pagamentos.</p>

            <input v-model="cpfLogin" @input="e => cpfLogin = mascaraCPF(e.target.value)" type="text"
                class="form-control form-control-lg bg-light border-0 rounded-pill text-center mx-auto mb-4"
                style="max-width: 300px;" placeholder="000.000.000-00" maxlength="14" @keyup.enter="acessarArea">

            <button class="btn btn-brand fw-bold px-5 py-3 rounded-pill shadow-soft mx-auto" @click="acessarArea"
                :disabled="carregando">
                {{ carregando ? 'Buscando...' : 'Entrar na Área do Passageiro' }}
            </button>

            <p v-if="erroLogin" class="text-danger small fw-bold mt-3">{{ erroLogin }}</p>
        </div>

        <!-- ESTADO LOGADO (ÁREA DO PASSAGEIRO) -->
        <div v-else>
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <!-- Ícone Adicionado Aqui Tbm -->
                <h3 class="fw-bold text-brand mb-0 d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path
                            d="M16 7a1 1 0 0 1-1 1v3.5c0 .818-.393 1.544-1 2v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V14H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2a2.496 2.496 0 0 1-1-2V8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1V2.64C1 1.452 1.845.408 3.064.268A43.608 43.608 0 0 1 8 0c2.1 0 3.792.136 4.936.268C14.155.408 15 1.452 15 2.64V4a1 1 0 0 1 1 1zM3.552 3.22A43.306 43.306 0 0 1 8 3c1.837 0 3.353.107 4.448.22a.5.5 0 0 0 .104-.994A44.304 44.304 0 0 0 8 2c-1.876 0-3.426.109-4.552.226a.5.5 0 1 0 .104.994ZM8 4c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.304 44.304 0 0 0 8 4m-3 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0m8 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m-7 0a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H7a1 1 0 0 0-1 1" />
                    </svg>
                    <span class="text-dark">Olá, {{ primeiroNome }}!</span>
                </h3>

                <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-end">
                    <button class="btn btn-sm btn-success rounded-pill fw-bold px-3 shadow-sm"
                        @click="$emit('cadastrarFamiliar', usuarioLogado)">+ Cadastrar Familiar</button>
                    <button class="btn btn-sm btn-outline-primary rounded-pill fw-bold px-3"
                        @click="$emit('editarDados', usuarioLogado)">Editar Meus Dados</button>
                    <button class="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3" @click="sair">Sair</button>
                </div>
            </div>

            <div v-if="minhasExcursoes.length === 0" class="alert alert-info rounded-4 border-0 shadow-sm">
                Você não está vinculado a nenhuma viagem ativa no momento.
            </div>

            <div v-for="ex in minhasExcursoes" :key="ex.id"
                class="card border border-light shadow-sm rounded-4 mb-4 bg-white overflow-hidden">
                <div
                    class="card-header bg-brand-light p-4 border-bottom border-light d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="fw-bold text-brand mb-1">{{ ex.nome }}</h5>
                        <p class="text-muted small fw-semibold mb-0">Destino: {{ ex.lugar }}</p>
                    </div>
                </div>
                <div class="card-body p-4">
                    <div class="row g-4">
                        <div class="col-12 col-md-5 border-end border-light">
                            <h6 class="fw-bold text-dark small text-uppercase mb-3">Informações da Viagem</h6>
                            <p class="small mb-1 text-muted"><strong>Saída:</strong> {{ ex.detalhes?.dataSaida || 'A definir' }} às {{ ex.detalhes?.horaSaida || 'A definir' }}</p>
                            <p class="small mb-1 text-muted"><strong>Retorno:</strong> {{ ex.detalhes?.dataRetorno || 'A definir' }} às {{ ex.detalhes?.horaRetorno || 'A definir' }}</p>
                            <p class="small mb-1 text-muted"><strong>Transporte:</strong> {{ ex.detalhes?.transporte ||
                                'A definir' }}</p>
                        </div>

                        <div class="col-12 col-md-7">
                            <h6 class="fw-bold text-dark small text-uppercase mb-3">Passageiros e Pagamentos</h6>
                            <div class="table-responsive">
                                <table class="table table-borderless align-middle mb-0">
                                    <tbody>
                                        <tr v-for="m in obterLiderEDependentes(ex)" :key="m.id"
                                            class="border-bottom border-light">
                                            <td class="ps-0 py-3"><strong class="small text-dark">{{ m.nome }}</strong>
                                            </td>
                                            <td class="py-3">
                                                <span
                                                    class="badge bg-success bg-opacity-10 text-success fs-6 rounded-pill px-3 py-2 border border-success border-opacity-25 text-nowrap">
                                                    {{ obterPagamento(ex, m.id) }}
                                                </span>
                                            </td>
                                            <td class="text-end pe-0 py-3">
                                                <button
                                                    v-if="obterPagamento(ex, m.id) !== 'Pendente / À combinar' && obterPagamento(ex, m.id) !== 'Criança de 0 a 1,9 meses - Isento'"
                                                    class="btn btn-sm btn-brand rounded-pill fw-bold px-3 shadow-sm text-nowrap"
                                                    @click="abrirModalPix(ex, m)">
                                                    Pagar com Pix
                                                </button>
                                                <span
                                                    v-else-if="obterPagamento(ex, m.id) === 'Criança de 0 a 1,9 meses - Isento'"
                                                    class="text-success small fw-bold text-nowrap">✔ Não Paga</span>
                                                <span v-else
                                                    class="text-muted small fst-italic text-nowrap">Indefinido</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="temCriancaIsenta(ex)"
                                class="alert alert-warning py-2 px-3 small fw-bold mt-3 mb-0 border-0 rounded-3 d-flex align-items-center gap-2 bg-warning bg-opacity-10 text-dark">
                                👶 <span>Passageiros marcados como <strong>"Criança de 0 a 1,9 meses"</strong> são
                                    isentos e não pagam o valor da viagem.</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="ex.liberarContratos" class="mt-4 pt-4 border-top border-light">
                        <h6 class="fw-bold text-dark small text-uppercase mb-3">Contrato Digital</h6>

                        <div v-if="verificarAssinatura(ex)"
                            class="alert alert-success border-0 rounded-3 d-flex align-items-center justify-content-between gap-2 shadow-sm">
                            <div class="d-flex align-items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                </svg>
                                <div>
                                    <strong class="d-block">Contrato Assinado Digitalmente!</strong>
                                    <small>Sua assinatura foi registrada em {{
                                        formatarData(ex.assinaturas[usuarioLogado.id]) }}.</small>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="verificarSeEhDependente(ex)">
                            <p class="small text-danger fw-bold mb-3 fst-italic">Você é um dependente nesta viagem. O
                                contrato deve ser assinado pelo titular (líder) do seu grupo familiar.</p>
                        </div>

                        <div v-else>
                            <p class="small text-muted mb-3">Para confirmar sua vaga, é obrigatório ler e assinar o
                                contrato de prestação de serviços turísticos.</p>
                            <button
                                class="btn btn-brand w-100 py-3 fw-bold rounded-pill shadow-soft d-flex justify-content-center align-items-center gap-2"
                                @click="abrirModalContrato(ex)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                </svg>
                                Visualizar e Assinar Contrato
                            </button>
                        </div>
                    </div>
                    <div v-else class="mt-4 pt-4 border-top border-light text-muted small fst-italic">
                        O contrato para esta viagem ainda não foi liberado para assinatura.
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= MODAIS DE PIX E AVISO ================= -->
        <div v-if="modalPixAberto" class="modal fade show d-block" style="background: rgba(0,0,0,0.7); z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered px-3">
                <div class="modal-content border-0 shadow-lg rounded-5 bg-white">
                    <div class="modal-header border-0 pb-0">
                        <button type="button" class="btn-close" @click="modalPixAberto = false"></button>
                    </div>
                    <div class="modal-body text-center px-4 px-md-5 pb-5 pt-0">
                        <div class="mb-3 text-brand">
                            <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                            </svg>
                        </div>
                        <h5 class="fw-bold text-dark mb-1">Pagamento via Pix</h5>
                        <p class="small text-muted mb-4">
                            Passageiro: <strong class="text-dark">{{ pixData.nome }}</strong><br>
                            Parcelo: <strong class="text-success">{{ pixData.valor }}</strong>
                        </p>

                        <div class="p-3 bg-light rounded-4 mb-4 text-break small text-muted border border-light user-select-all"
                            style="max-height: 120px; overflow-y: auto;">
                            {{ pixData.codigo }}
                        </div>

                        <button class="btn btn-brand w-100 py-3 fw-bold rounded-pill shadow-soft fs-5"
                            @click="copiarPixEAvise">
                            Copiar Pix Copia e Cola
                        </button>
                        <p class="mt-3 mb-0 small text-muted fst-italic">Após copiar, abra o aplicativo do seu banco
                            para colar.</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalAvisoAberto" class="modal fade show d-block"
            style="background: rgba(0,0,0,0.7); z-index: 1070;">
            <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 400px;">
                <div
                    class="modal-content border-0 shadow-lg rounded-5 bg-white text-center p-4 p-md-5 position-relative">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3 shadow-none"
                        style="font-size: 0.6rem;" @click="modalAvisoAberto = false"></button>

                    <div class="text-success mb-3 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                    </div>

                    <h5 class="fw-bold text-dark mb-2">Código Copiado!</h5>
                    <p class="text-muted small fw-semibold mb-4 lh-base">
                        Avise a Grazi tur que voce pagou a parcela de <br><strong class="text-brand fs-6">{{
                            passageiroAviso }}</strong>
                    </p>

                    <a :href="linkWhatsApp" target="_blank"
                        class="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm"
                        @click="modalAvisoAberto = false">
                        Avisar pelo WhatsApp
                    </a>
                </div>
            </div>
        </div>
        <!-- ========================================================= -->

        <div v-if="modalContratoAberto && excursaoSendoAssinada" class="modal fade show d-block"
            style="background: rgba(0,0,0,0.8); z-index: 1050;">
            <div class="modal-dialog modal-xl modal-dialog-scrollable px-2">
                <div class="modal-content border-0 shadow-lg rounded-5 bg-white">
                    <div
                        class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="modal-title fw-bold text-dark fs-5 m-0">Contrato de Aquisição de Pacote de
                                Turismo</h5>
                            <p class="text-muted small mb-0 mt-1">Por favor, leia atentamente todas as cláusulas antes
                                de assinar.</p>
                        </div>
                        <button class="btn-close m-0" @click="modalContratoAberto = false"></button>
                    </div>

                    <div class="modal-body p-4 p-md-5"
                        style="font-family: Arial, sans-serif; font-size: 0.95rem; line-height: 1.6; color: #333;">
                        <h4 class="text-center fw-bold mb-4">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TURÍSTICOS</h4>

                        <p class="fw-bold mb-1">CLÁUSULA 1 – DAS PARTES</p>
                        <p class="text-justify mb-3">
                            <b>A) CONTRATANTE:</b><br>
                            O(a) Sr(a). {{ usuarioLogado.nome }}, portador(a) do RG {{ usuarioLogado.orgaoExpeditor ||
                                "_______________" }}, inscrito no CPF sob o nº {{ usuarioLogado.cpf || "_______________" }},
                            residente e domiciliado na {{ usuarioLogado.endereco || "_______________" }} - {{
                                usuarioLogado.cidade || "_______________" }}, celular: {{ usuarioLogado.celular ||
                                "_______________" }}.
                            <span v-if="obterDependentes(excursaoSendoAssinada).length > 0">
                                <br><br><b>ACOMPANHANTES (DEPENDENTES):</b> {{
                                    obterDependentes(excursaoSendoAssinada).map(d => d.nome).join(', ')}}.
                            </span>
                        </p>
                        <p class="text-justify mb-3">
                            <b>B) CONTRATADA:</b><br>
                            58.904.532 LÍVIA GRAZIELA DOS SANTOS – GRAZI TURISMO, inscrita no CNPJ nº
                            58.904.532/0001-33, com sede na Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – RJ,
                            CEP 28737-488.
                        </p>
                        <p class="text-justify mb-4">Este Contrato é formulado à luz do Código de Defesa do Consumidor,
                            da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de
                            Turismo – BRAZTOA.</p>
                        <p class="text-justify mb-4">As partes acima identificadas, entre si, justo e acertado o
                            presente Contrato dos serviços de GRAZI TURISMO, declaram ciência e concordância com as
                            cláusulas a seguir expostas.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 2 – DAS CONDIÇÕES E OBJETO DO PRESENTE CONTRATO</p>
                        <p class="text-justify mb-4">O presente contrato tem como OBJETO a prestação, pela CONTRATADA, à
                            CONTRATANTE, dos serviços na área de turismo.<br>
                            Os pacotes inclusos na prestação dos serviços contratados incluem a reserva e pagamento de
                            vagas em meios de hospedagem (quando houver), transporte, contratação de serviços de
                            recepção, transferência e assistência, segundo as especificações do pacote adquirido.<br>
                            A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços,
                            isentando sua responsabilidade por todo e qualquer problema resultante de casos fortuitos ou
                            de força maior, ou seja: greves, distúrbios, quarentenas, epidemias, guerras, fenômenos
                            naturais tais como terremotos, furacões, enchentes, avalanches, mas não limitando-se a
                            estes, modificações, atrasos e/ou cancelamento devido a motivos técnicos, mecânicos e/ou
                            meteorológicos, sobre os quais a operadora não possui poder de previsão ou controle.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 3 – DA CONTRATAÇÃO</p>
                        <p class="text-justify mb-4">Para aquisição dos serviços prestados pela GRAZI TURISMO, o
                            contratante deverá escolher entre os valores constantes no ANEXO I do presente contrato.<br>
                            É lícito ao Contratante exercer seu direito de arrependimento, desistindo da contratação dos
                            servços, desde que o faça em até 7 (sete) dias contados da contratação, nos moldes do
                            artigo 49 do Código de Defesa do Consumidor (com exceção das taxas/multas impostas em
                            virtude do cancelamento, as quais serão aplicadas).</p>

                        <p class="fw-bold mb-1">CLÁUSULA 4 – DO FINANCIAMENTO</p>
                        <p class="text-justify mb-4">O Contratante declara estar ciente de que, após sua solicitação e
                            envio da documentação solicitada, será notificado. Em seguida, após a escolha do valor
                            referente ao pacote selecionado, poderá efetuar o pagamento mediante pix, depósito,
                            transferência bancária ou em dinheiro nos meses assim solicitado.<br>
                            Não incidirá nenhum tipo de juros sobre o valor a ser pago para a obtenção dos créditos,
                            independente do número de parcelas escolhidas pelo adquirente.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 5 – DO CANCELAMENTO, DA DESISTÊNCIA E DAS TAXAS</p>
                        <p class="text-justify mb-2">É lícito ao CLIENTE requerer a desistência do contrato e solicitar
                            o cancelamento em até 7 (sete) dias contados da contratação, nos moldes da cláusula 3
                            anteriormente descrita.</p>
                        <p class="fw-bold mb-1">5.1 – Condições do Cancelamento</p>
                        <ul class="mb-3">
                            <li>Em pedidos de RESCISÃO com mais de 30 (trinta) dias de antecedência da data do início da
                                viagem, a multa aplicada será de 10% (dez por cento);</li>
                            <li>Entre 30 (trinta) a 20 (vinte) dias de antecedência da data do início da viagem, a multa
                                aplicada será de 20% (vinte por cento);</li>
                            <li>Entre 19 (dezenove) a 15 (quinze) dias de antecedência da data do início da viagem, a
                                multa aplicada será de 50% (cinquenta por cento);</li>
                            <li>Entre 14 (quatorze) a 10 (dez) dias de antecedência da data do início da viagem, a multa
                                aplicada será de 80% (oitenta por cento);</li>
                            <li>Em caso de RESCISÃO em menos de 9 (nove) dias de antecedência da data do início da
                                viagem, a multa aplicada será de 100% (cem por cento), e o CONTRATANTE não terá direito
                                à restituição dos valores pagos no pacote.</li>
                        </ul>
                        <p class="fw-bold mb-1">5.2 – Reversão do valor em crédito</p>
                        <p class="text-justify mb-2">Com a migração para outro pacote em valor inferior, contratação
                            futura de novo serviço ou contratação imediata de viagem disponível dentro do valor já
                            pago.<br>
                            Em caso de cancelamento com reversão do valor em créditos, o contratante terá o prazo de até
                            12 meses para utilizar o valor disponível.</p>
                        <p class="fw-bold mb-1">5.3 – RESCISÃO pela parte contratada</p>
                        <p class="text-justify mb-2">Caso o pacote seja cancelado pela parte contratada por não atingir
                            o número mínimo de participantes, por condições climáticas não favoráveis ou caso surjam
                            motivos técnicos operacionais que impeçam o cumprimento total da atividade, o CONTRATANTE
                            poderá optar por uma das três opções:<br>
                            a) Agendar a mesma viagem em outra data;<br>
                            b) Receber 100% do valor em créditos para serem usados em uma nova compra;<br>
                            c) Receber 100% através de pix, depósito ou transferência bancária diretamente na
                            conta-corrente do CONTRATANTE.</p>
                        <p class="fw-bold mb-1">5.4 – Da inadimplência</p>
                        <p class="text-justify mb-2">Caso o contratante deixe de efetuar o pagamento de algum dos meses
                            solicitado, e não o atualize dentro do prazo do vencimento, considerar-se-á CANCELADO o
                            pacote contratado, incidindo a partir do cancelamento pela inadimplência as regras da
                            cláusula 5.1 quanto ao período já pago.</p>
                        <p class="fw-bold mb-1">5.5 – Das taxas</p>
                        <p class="text-justify mb-1">Todas as taxas do pacote contratado estão inclusas no valor final e
                            serão inclusas no pacote contratado, ressalvadas:</p>
                        <ul class="mb-3">
                            <li>Entradas a atrações turísticas que não estiverem estritamente especificadas no pacote;
                            </li>
                            <li>As despesas de caráter pessoal;</li>
                            <li>As refeições não mencionadas, gorjetas, serviços de maleteiros.</li>
                        </ul>
                        <p class="text-justify mb-4">Tais despesas serão de responsabilidade exclusiva do contratante.
                        </p>

                        <p class="fw-bold mb-1">CLÁUSULA 6 – DA UTILIZAÇÃO DO PACOTE ADQUIRIDO</p>
                        <p class="text-justify mb-4">O contratante poderá utilizar o pacote adquirido SOMENTE após a
                            quitação de todas as parcelas.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 7 – CONDIÇÕES ESPECÍFICAS E OBRIGAÇÕES DA OPERADORA</p>
                        <p class="text-justify mb-2"><b>7.1</b> A GRAZI TURISMO atua como intermediária entre seus
                            clientes e prestadores de serviços, conforme descrito na cláusula segunda, deste modo, a
                            empresa contratada reserva-se do direito de promover as alterações que se fizerem
                            necessárias quanto aos itinerários, hotéis, serviços, etc., sem prejuízo para o cliente.</p>
                        <p class="text-justify mb-2"><b>7.2 – Obriga-se a OPERADORA a:</b><br>
                            a) Prestar informações claras e precisas ao CLIENTE, sobre o produto adquirido (dados do
                            local de destino, hospedagens, refeições, traslados, preços, taxas e custos adicionais,
                            dentre outros), que serão documentadas no ANEXO I.<br>
                            b) Comunicar com antecedência de até dois dias do início dos serviços ao CLIENTE, as
                            eventuais alterações de dias ou horários de partida e chegada das viagens; modificações de
                            categoria de apartamentos, acomodações, quartos, cabines ou assemelhados, hotéis, pousadas e
                            estabelecimentos afins e de quaisquer outras informações constantes.</p>
                        <p class="text-justify mb-2"><b>7.3 – DA CIÊNCIA E ACEITAÇÃO DOS RISCOS</b><br>
                            O CONTRATANTE declara estar ciente de que atividades turísticas envolvem riscos naturais e
                            imprevisíveis, incluindo, mas não se limitando a:</p>
                        <ul class="mb-2">
                            <li>Afogamento em praias, rios, cachoeiras e piscinas;</li>
                            <li>Acidentes durante passeios turísticos;</li>
                            <li>Mal súbito, incluindo infarto, AVC ou outras condições médicas inesperadas;</li>
                            <li>Quedas, lesões ou qualquer outro evento decorrente da atividade turística.</li>
                        </ul>
                        <p class="text-justify mb-2">Declara ainda que participa das atividades por livre e espontânea
                            vontade, assumindo os riscos inerentes às atividades realizadas durante a viagem.</p>
                        <p class="text-justify mb-2"><b>7.4 – DA RESPONSABILIDADE DO CONTRATANTE</b><br>
                            É de inteira responsabilidade do CONTRATANTE:</p>
                        <ul class="mb-2">
                            <li>Estar em boas condições de saúde para participação nas atividades;</li>
                            <li>Informar previamente qualquer limitação física, doença ou condição médica relevante;
                            </li>
                            <li>Seguir todas as orientações da guia, motorista e equipe responsável;</li>
                            <li>Zelar por sua segurança pessoal e pelos demais integrantes do grupo.</li>
                        </ul>
                        <p class="text-justify mb-2">A CONTRATADA não se responsabiliza por ocorrências decorrentes de
                            imprudência, negligência ou descumprimento de orientações por parte do CONTRATANTE.</p>
                        <p class="text-justify mb-2"><b>7.5 – DO COMPORTAMENTO DO PASSAGEIRO</b><br>
                            A CONTRATADA poderá desligar da excursão, sem direito a reembolso, o passageiro que:</p>
                        <ul class="mb-2">
                            <li>Colocar em risco a segurança do grupo;</li>
                            <li>Estiver sob efeito de álcool ou substâncias que comprometam a segurança coletiva;</li>
                            <li>Desrespeitar normas de convivência, legislação vigente ou orientações da equipe
                                responsável;</li>
                            <li>Praticar atos que comprometam o bom andamento da viagem ou a integridade física de
                                terceiros.</li>
                        </ul>
                        <p class="text-justify mb-2">Neste caso, todas as despesas decorrentes do desligamento serão de
                            responsabilidade exclusiva do CONTRATANTE.</p>
                        <p class="text-justify mb-4"><b>7.6 – DAS BAGAGENS E OBJETOS PESSOAIS</b><br>
                            A CONTRATADA não se responsabiliza por perda, extravio, dano ou roubo de bagagens, dinheiro,
                            documentos ou objetos pessoais durante a viagem.<br>
                            Recomenda-se que o CONTRATANTE mantenha seus objetos pessoais sempre sob sua guarda e
                            responsabilidade.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 8 – SEGURO VIAGEM</p>
                        <p class="text-justify mb-2">A CONTRATADA informará previamente, por meio de anúncio, material
                            informativo ou comunicação oficial, se o pacote contratado inclui ou não seguro viagem.</p>
                        <p class="text-justify mb-2"><b>§1º – Quando o seguro viagem estiver incluído no pacote:</b><br>
                            A CONTRATADA responsabiliza-se pela contratação do seguro conforme as condições divulgadas,
                            devendo fornecer ao CONTRATANTE as informações essenciais da apólice, coberturas e
                            procedimentos de acionamento.</p>
                        <p class="text-justify mb-2"><b>§2º – Quando o seguro viagem NÃO estiver incluído no
                                pacote:</b><br>
                            A CONTRATADA recomenda expressamente a contratação de seguro viagem (assistência médica,
                            hospitalar, odontológica, traslado médico, traslado de corpo, invalidez, morte, entre
                            outros).<br>
                            O CONTRATANTE declara estar ciente de que o seguro viagem não está incluso, assumindo total
                            responsabilidade pela sua contratação ou não, sendo de sua exclusiva responsabilidade todas
                            as despesas decorrentes de atendimentos médicos, hospitalares, remoções, traslados,
                            inclusive em caso de óbito, bem como quaisquer outros custos relacionados a acidentes,
                            doenças ou eventos ocorridos durante a viagem.</p>
                        <p class="text-justify mb-2"><b>§3º – Ciência e responsabilidade do CONTRATANTE:</b><br>
                            O CONTRATANTE declara que recebeu orientação prévia quanto à importância do seguro viagem,
                            optando, por livre decisão, por sua contratação ou não.</p>
                        <p class="text-justify mb-4"><b>§4º – Limitação de responsabilidade:</b><br>
                            A CONTRATADA não se responsabiliza por custos decorrentes da ausência de contratação do
                            seguro viagem pelo CONTRATANTE, ressalvadas as hipóteses de responsabilidade previstas na
                            legislação vigente.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 9 – DA OCORRÊNCIA DE CASOS FORTUITOS E FORÇA MAIOR</p>
                        <p class="text-justify mb-4">Ocorrendo caso fortuito, assim entendidos aqueles não previstos e
                            não possíveis de serem evitados pela OPERADORA ou eventos de força maior (fenômenos da
                            natureza, como tempestades, tufões, ciclones, enchentes, entre outros), que coloquem em
                            risco a vida e a segurança do contratante, ou ainda situação de calamidade pública,
                            perturbação da ordem, acidentes ou greves prejudiciais aos serviços de viagem, poderá a
                            OPERADORA cancelar a viagem, antes do seu início ou em seu curso, sem acréscimo de multa,
                            juros, correção ou pagamento de indenização a qualquer título.<br>
                            Os atrasos e os cancelamentos de trajetos motivados por razões técnicas, operacionais,
                            mecânicas ou meteorológicas, sobre os quais a OPERADORA não possua poder de previsão ou
                            controle, estão incluídos nos casos fortuitos ou de força maior, que a isentam de
                            responsabilidade civil ou criminal, na forma prevista no item anterior.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 10 – MEIOS DE TRANSPORTE</p>
                        <p class="text-justify mb-4">Os meios de transporte específicos que serão utilizados pelo
                            CLIENTE, na viagem ou produto que está adquirindo através deste contrato, encontram-se
                            devida e claramente definidos e especificados no ANEXO I.<br>
                            O contratante declara-se ciente, por este contrato, de que a responsabilidade civil e
                            criminal que decorra do contrato de transporte é exclusiva da empresa de transporte
                            contratada, nos termos da legislação vigente.<br>
                            A OPERADORA limita-se a contratar empresas idôneas para que prestem ao(s) seu(s) CLIENTE(S)
                            transportes rodoviário, ferroviário, marítimo, pluvial ou lacustre, na categoria turística,
                            com o emprego de ônibus, navios, veículos, vagões, barcos etc., que devem estar em boas
                            condições de funcionamento.<br>
                            Essas empresas têm responsabilidade objetiva pela segurança dos passageiros e de suas
                            bagagens, nos termos das leis e normas específicas, obrigando-se a dispor de apólice de
                            seguro obrigatório para o eventual ressarcimento de danos materiais e físicos.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 11 – DOCUMENTAÇÃO DE VIAGEM</p>
                        <p class="text-justify mb-4"><b>Adultos:</b> Carteira de Identidade (RG); Carteira Nacional de
                            Habilitação (CNH); Passaporte; Carteira de Identidade Profissional (com foto e fé
                            pública).<br>
                            <b>Crianças e Adolescentes (até 18 anos):</b> Certidão de Nascimento (original ou cópia
                            autenticada); Carteira de Identidade (RG); Passaporte.<br>
                            <b>Outros documentos:</b> Boletim de Ocorrência (em caso de extravio ou roubo do documento);
                            Cópia autenticada do documento de identidade; Autorização de viagem assinada pelos pais
                            (para menores de 16 anos, caso não estejam acompanhados dos pais).<br>
                            <b>Observações:</b> É fundamental que os documentos estejam válidos e atualizados. Não são
                            aceitos prints ou fotos dos documentos como prova de identificação. Em caso de dúvidas ou
                            situações específicas, é sempre recomendado consultar a empresa de transporte ou a ANTT
                            (Agência Nacional de Transportes Terrestres). É de responsabilidade do contratante o dever
                            de providenciar toda sua documentação de viagem.
                        </p>

                        <p class="fw-bold mb-1">CLÁUSULA 12 – ELEIÇÃO DE FORO</p>
                        <p class="text-justify mb-4">Para dirimir toda e qualquer dúvida decorrente do presente
                            contrato, por eleição, os clientes elegem o foro da comarca de Quissamã/Carapebus/RJ, com a
                            exclusão de qualquer outro, por mais privilegiado que o seja.</p>

                        <p class="text-justify mb-2">O CONTRATANTE declara neste momento, ao assinar o presente
                            contrato, ter lido e, por isso, conhecer e aceitar integralmente todas as suas cláusulas
                            específificas e gerais, declarando, ainda, serem verdadeiras todas as informações prestadas
                            à
                            CONTRATADA, assumindo, de livre e espontânea vontade, todas as responsabilidades previstas
                            neste Contrato.<br>
                            O presente contrato é passível de modificações antes de sua assinatura, sempre que
                            solicitado pelo contratante, em grande e visível ambiente virtual disponível ao lado do
                            ícone de envio do contrato.</p>

                        <p class="fw-bold mb-1">O CONTRATANTE declara, para todos os fins legais, que:</p>
                        <ul class="mb-4">
                            <li>Leu integralmente o presente contrato;</li>
                            <li>Compreendeu todas as cláusulas nele contidas;</li>
                            <li>Está ciente dos riscos inerentes às atividades turísticas;</li>
                            <li>Assume voluntariamente a responsabilidade por sua participation nas atividades incluídas
                                no pacote contratado;</li>
                            <li>Compromete-se a cumprir todas as orientações fornecidas pela equipe responsável pela
                                excursão;</li>
                            <li>Declara estar em condições físicas e de saúde adequadas para participação nas atividades
                                propostas;</li>
                            <li>Declara estar ciente de que a CONTRATADA atua como intermediadora de serviços turísticos
                                e não executora direta dos serviços prestados por terceiros.</li>
                        </ul>

                        <h5 class="text-center fw-bold mt-5 mb-3">ANEXO I – DESCRIÇÃO DA PRESTAÇÃO DE SERVIÇOS</h5>
                        <p class="mb-3">
                            <b>Destino da viagem:</b> {{ excursaoSendoAssinada.lugar }}<br>
                            <b>Data de saída:</b> {{ excursaoSendoAssinada.detalhes?.dataSaida || "__/__/____" }}
                            &nbsp;&nbsp;&nbsp;<b>Horário:</b> {{ excursaoSendoAssinada.detalhes?.horaSaida || "__:__"
                            }}<br>
                            <b>Data de retorno:</b> {{ excursaoSendoAssinada.detalhes?.dataRetorno || "__/__/____" }}
                            &nbsp;&nbsp;&nbsp;<b>Horário:</b> {{ excursaoSendoAssinada.detalhes?.horaRetorno || "__:__"
                            }}<br>
                            <b>Transporte:</b> {{ excursaoSendoAssinada.detalhes?.transporte || "_________________" }}
                            &nbsp;&nbsp;&nbsp;<b>Empresa:</b> {{ excursaoSendoAssinada.detalhes?.empresa ||
                                "_________________" }}
                        </p>

                        <p class="fw-bold mb-1">DADOS DO RECEPTIVO E SERVIÇOS PRESTADOS:</p>
                        <p class="mb-4 text-muted" style="white-space: pre-wrap;">{{
                            excursaoSendoAssinada.detalhes?.roteiro ||
                            "________________________________________________" }}</p>

                        <p class="fw-bold mb-2">DADOS DOS PASSAGEIROS E PAGAMENTOS:</p>
                        <div class="table-responsive mb-4">
                            <table class="table table-bordered border-dark align-middle">
                                <thead class="table-light border-dark">
                                    <tr>
                                        <th>Nome Completo</th>
                                        <th>Nascimento</th>
                                        <th>CPF</th>
                                        <th>Pagamento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="m in obterLiderEDependentes(excursaoSendoAssinada)" :key="m.id">
                                        <td>{{ m.nome }}</td>
                                        <td class="center">{{ m.nascimento || "-" }}</td>
                                        <td class="center">{{ m.cpf || "-" }}</td>
                                        <td class="center">{{ excursaoSendoAssinada.aplicarParcelas ?
                                            obterPagamento(excursaoSendoAssinada, m.id) : "À combinar" }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p class="text-justify mb-4"><b>DECLARAÇÃO FINAL:</b> O CONTRATANTE declara que leu, compreendeu
                            e concorda com todas as cláusulas acima, especialmente quanto aos riscos envolvidos e
                            responsabilidades assumidas.</p>

                        <div
                            class="bg-brand-light p-4 rounded-4 border border-brand border-opacity-25 mb-5 d-flex justify-content-center">
                            <div class="form-check d-flex align-items-center gap-3 m-0">
                                <input class="form-check-input border-brand shadow-sm m-0" type="checkbox"
                                    id="checkHabilitarContrato" v-model="contratoHabilitado"
                                    style="width: 1.5em; height: 1.5em; cursor: pointer;">
                                <label class="form-check-label fw-bold text-dark user-select-none"
                                    for="checkHabilitarContrato" style="cursor: pointer; padding-top: 2px;">
                                    Habilitar contratos oficiais
                                </label>
                            </div>
                        </div>

                        <div class="text-center mt-4">
                            <p class="mb-5">Quissamã/RJ, {{ dataAtualFormatada() }}</p>
                            <p class="mb-0">_____________________________________________</p>
                            <p class="mb-5 fw-bold">CONTRATANTE: {{ usuarioLogado.nome }}</p>
                            <p class="mb-0">_____________________________________________</p>
                            <p class="fw-bold">58.904.532 LÍVIA GRAZIELA DOS SANTOS - GRAZI TURISMO</p>
                        </div>
                    </div>

                    <div
                        class="modal-footer bg-light p-4 border-top border-light d-flex flex-column flex-sm-row gap-2 rounded-bottom-5">
                        <button
                            class="btn btn-outline-secondary fw-bold w-100 w-sm-auto px-4 me-auto rounded-pill py-3 bg-white"
                            @click="modalContratoAberto = false" :disabled="assinando">Li e não concordo
                            (Cancelar)</button>

                        <button v-if="contratoHabilitado"
                            class="btn btn-brand fw-bold px-5 py-3 w-100 w-sm-auto rounded-pill shadow-soft d-flex align-items-center justify-content-center gap-2"
                            @click="assinarContrato" :disabled="assinando">
                            <svg v-if="!assinando" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                            </svg>
                            <span v-if="assinando" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true"></span>
                            {{ assinando ? 'Registrando Assinatura...' : 'ASSINAR CONTRATO DIGITALMENTE' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mascaraCPF } from '~/utils/formatadores'

defineEmits(['editarDados', 'cadastrarFamiliar'])

const cpfLogin = ref('')
const usuarioLogado = ref(null)
const erroLogin = ref('')
const erroForm = ref('')
const minhasExcursoes = ref([])
const carregando = ref(false)
const assinando = ref(false)

const contratoHabilitado = ref(false)

const modalContratoAberto = ref(false)
const excursaoSendoAssinada = ref(null)

const modalPixAberto = ref(false)
const modalAvisoAberto = ref(false)
const pixData = ref({ exId: null, userId: null, nome: '', valor: '', codigo: '', nomeViagem: '' })
const passageiroAviso = ref('')

const primeiroNome = computed(() => {
    if (!usuarioLogado.value) return '';
    return usuarioLogado.value.nome.split(' ')[0];
})

const linkWhatsApp = computed(() => {
    const nomeViagem = pixData.value.nomeViagem || 'a excursão';
    const msg = `Olá, acabei de pagar a taxa da viagem ${nomeViagem} no valor de ${pixData.value.valor}, pelo passageiro ${pixData.value.nome}`;
    return `https://wa.me/5522999454860?text=${encodeURIComponent(msg)}`;
});

onMounted(() => {
    if (import.meta.client) {
        const cpfSalvo = localStorage.getItem('graziTurPassageiroCPF')
        if (cpfSalvo) {
            cpfLogin.value = mascaraCPF(cpfSalvo)
            acessarArea()
        }
    }
})

const acessarArea = async () => {
    erroLogin.value = ''
    if (!cpfLogin.value) { erroLogin.value = 'Por favor, digite seu CPF.'; return; }

    carregando.value = true
    try {
        const cpfLimpo = cpfLogin.value.replace(/\D/g, '')
        const res = await $fetch(`/api/passageiro/viagens?cpf=${cpfLimpo}`)
        usuarioLogado.value = res.user
        minhasExcursoes.value = res.excursoes

        if (import.meta.client) {
            localStorage.setItem('graziTurPassageiroCPF', cpfLimpo)
        }
    } catch (e) {
        erroLogin.value = e.data?.statusMessage || 'Passageiro não encontrado. Verifique seu CPF.'
        if (import.meta.client) localStorage.removeItem('graziTurPassageiroCPF')
    } finally {
        carregando.value = false
    }
}

const sair = () => {
    usuarioLogado.value = null
    minhasExcursoes.value = []
    cpfLogin.value = ''
    if (import.meta.client) {
        localStorage.removeItem('graziTurPassageiroCPF')
    }
}

const obterPagamento = (ex, pId) => {
    return ex.pagamentos?.[pId] || 'Pendente / À combinar';
}

const temCriancaIsenta = (ex) => {
    const familia = obterLiderEDependentes(ex);
    return familia.some(m => obterPagamento(ex, m.id) === 'Criança de 0 a 1,9 meses - Isento');
}

const obterValorParcela = (pagamentoStr) => {
    if (!pagamentoStr || pagamentoStr === 'Pendente / À combinar') return '';
    const match = pagamentoStr.match(/R\$\s*([\d,.]+)/);
    return match ? `R$ ${match[1]}` : pagamentoStr;
}

const gerarPixCopiaECola = (ex, userId) => {
    const chavePix = "58904532000133";
    const valorStr = obterValorParcela(obterPagamento(ex, userId)).replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const valor = parseFloat(valorStr) || 0;
    const valorFormatado = valor.toFixed(2);
    const tamanhoValor = valorFormatado.length.toString().padStart(2, '0');

    const payload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}52040000530398654${tamanhoValor}${valorFormatado}5802BR5901N6001C62160512GraziTurismo6304`;

    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) > 0) crc = (crc << 1) ^ 0x1021;
            else crc = crc << 1;
        }
    }
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    return payload + crcHex;
}

const abrirModalPix = (ex, user) => {
    const valor = obterValorParcela(obterPagamento(ex, user.id));
    const codigo = gerarPixCopiaECola(ex, user.id);
    pixData.value = { exId: ex.id, userId: user.id, nome: user.nome, valor, codigo, nomeViagem: ex.nome };
    modalPixAberto.value = true;
}

const copiarPixEAvise = async () => {
    try {
        await navigator.clipboard.writeText(pixData.value.codigo);
    } catch (err) {
        console.error('Falha ao copiar PIX:', err);
    }

    passageiroAviso.value = pixData.value.nome;
    modalPixAberto.value = false;
    modalAvisoAberto.value = true;
}

const verificarAssinatura = (ex) => {
    if (!ex.assinaturas) return false;
    return !!ex.assinaturas[usuarioLogado.value?.id];
}

const formatarData = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR');
}

const dataAtualFormatada = () => {
    return new Date().toLocaleDateString('pt-BR');
}

const obterDependentes = (ex) => {
    if (!ex || !usuarioLogado.value) return [];
    const idsDependentes = ex.grupos?.[String(usuarioLogado.value.id)] || [];
    return ex.usuarios.filter(u => idsDependentes.includes(String(u.id)));
}

const obterLiderEDependentes = (ex) => {
    return [usuarioLogado.value, ...obterDependentes(ex)];
}

const verificarSeEhDependente = (ex) => {
    if (!ex || !ex.grupos || !usuarioLogado.value) return false;
    return Object.values(ex.grupos).some(dependentesArray =>
        dependentesArray.map(String).includes(String(usuarioLogado.value.id))
    );
}

const abrirModalContrato = (excursao) => {
    excursaoSendoAssinada.value = excursao;
    contratoHabilitado.value = false;
    modalContratoAberto.value = true;
}

const assinarContrato = async () => {
    assinando.value = true
    try {
        await $fetch('/api/passageiro/assinar', {
            method: 'POST',
            body: {
                userId: usuarioLogado.value.id,
                excursaoId: excursaoSendoAssinada.value.id
            }
        })

        const ex = minhasExcursoes.value.find(e => e.id === excursaoSendoAssinada.value.id)
        if (!ex.assinaturas) ex.assinaturas = {}
        ex.assinaturas[usuarioLogado.value.id] = new Date().toISOString()

        modalContratoAberto.value = false;

    } catch (e) {
        alert("Ocorreu um erro ao assinar. Tente novamente.")
    } finally {
        assinando.value = false
    }
}
</script>

<style scoped>
.scrollable-table-container {
    overflow-y: auto;
    scrollbar-width: thin;
}

.text-brand {
    color: #2563eb !important;
}

.bg-brand {
    background-color: #2563eb !important;
    color: white;
    border: none;
    transition: background-color 0.2s;
}

.bg-brand-light {
    background-color: #eff6ff !important;
}

.btn-brand {
    background-color: #2563eb;
    color: white;
    border: none;
    transition: background-color 0.2s;
}

.btn-brand:hover {
    background-color: #1d4ed8;
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
}

.text-justify {
    text-align: justify;
}
</style>