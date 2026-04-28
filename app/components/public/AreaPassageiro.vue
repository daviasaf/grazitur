<template>
    <div>
        <div v-if="!usuarioLogado" class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white mt-5">
            <h3 class="fw-bold text-dark mb-2">Acessar Minha Viagem</h3>
            <p class="text-muted small mb-4">Digite seu CPF para ver seus contratos e pagamentos.</p>

            <input v-model="cpfLogin" type="text"
                class="form-control form-control-lg bg-light border-0 rounded-pill text-center mx-auto mb-4"
                style="max-width: 300px;" placeholder="Somente números" @keyup.enter="acessarArea">

            <button class="btn btn-brand fw-bold px-5 py-3 rounded-pill shadow-soft mx-auto" @click="acessarArea"
                :disabled="carregando">
                {{ carregando ? 'Buscando...' : 'Entrar na Área do Passageiro' }}
            </button>

            <p v-if="erroLogin" class="text-danger small fw-bold mt-3">{{ erroLogin }}</p>
        </div>

        <div v-else>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-dark mb-0">Olá, {{ primeiroNome }}!</h3>
                <button class="btn btn-sm btn-outline-danger rounded-pill fw-bold px-3" @click="sair">Sair</button>
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
                        <div class="col-12 col-md-6 border-end border-light">
                            <h6 class="fw-bold text-dark small text-uppercase mb-3">Informações da Viagem</h6>
                            <p class="small mb-1 text-muted"><strong>Saída:</strong> {{ ex.detalhes?.dataSaida || 'A definir' }} às {{ ex.detalhes?.horaSaida || 'A definir' }}</p>
                            <p class="small mb-1 text-muted"><strong>Transporte:</strong> {{ ex.detalhes?.transporte ||
                                'A definir' }}</p>
                        </div>
                        <div class="col-12 col-md-6">
                            <h6 class="fw-bold text-dark small text-uppercase mb-3">Seu Pagamento</h6>
                            <span
                                class="badge bg-success bg-opacity-10 text-success fs-6 rounded-pill px-3 py-2 border border-success border-opacity-25">{{
                                obterPagamento(ex, usuarioLogado.id) }}</span>
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
                        <h4 class="text-center fw-bold mb-4">CONTRATO DE PRESTAÇÃO DE SERVIÇOS E AQUISIÇÃO DE PACOTE
                            TURÍSTICO</h4>

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
                                    obterDependentes(excursaoSendoAssinada).map(d => d.nome).join(', ') }}.
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

                        <p class="fw-bold mb-1">CLÁUSULA 2 – DO OBJETO</p>
                        <p class="text-justify mb-4">O presente contrato tem como objeto a prestação, pela CONTRATADA, à
                            CONTRATANTE, de serviços de intermediação e organização turística, incluindo transporte,
                            reserva de vagas em hospedagem (quando houver), contratação de serviços de recepção,
                            transferência e assistência, segundo as especificações do pacote adquirido. A CONTRATADA
                            atua como intermediadora, não sendo responsável direta pela execução de serviços de
                            terceiros.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 3 – DA CIÊNCIA E ACEITAÇÃO DOS RISCOS</p>
                        <p class="text-justify mb-4">O CONTRATANTE declara estar ciente de que atividades turísticas
                            envolvem riscos naturais e inerentes, incluindo, mas não se limitando a: afogamento em
                            praias, rios e piscinas; acidentes durante passeios; mal súbito (infarto, AVC, etc.); quedas
                            ou lesões. Declara que participa da excursão por livre vontade, assumindo tais riscos.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 4 – DA RESPONSABILIDADE E SAÚDE</p>
                        <p class="text-justify mb-4">É responsabilidade do CONTRATANTE estar em boas condições de saúde,
                            informar previamente qualquer limitação ou doença crônica, seguir todas as orientações da
                            guia e equipe de apoio e zelar por sua segurança. A CONTRATADA não se responsabiliza por
                            ocorrências decorrentes de imprudência, negligência ou descumprimento de orientações de
                            segurança.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 5 – DO SEGURO VIAGEM</p>
                        <p class="text-justify mb-4">O CONTRATANTE declara ciência sobre a contratação ou não de seguro
                            viagem. Está ciente de que despesas médicas, hospitalares ou funerárias ocorridas durante a
                            viagem são de sua inteira responsabilidade, não cabendo à CONTRATADA arcar com tais custos.
                        </p>

                        <p class="fw-bold mb-1">CLÁUSULA 6 – ATENDIMENTO MÉDICO E EMERGÊNCIAS</p>
                        <p class="text-justify mb-4">Em caso de emergência, a CONTRATADA prestará apoio na busca de
                            socorro imediato, porém todas as despesas decorrentes do atendimento serão de
                            responsabilidade exclusiva do CONTRATANTE ou seus familiares.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 7 – DO TRANSPORTE E TERCEIROS</p>
                        <p class="text-justify mb-4">A responsabilidade civil e criminal pelo transporte é exclusiva da
                            empresa transportadora contratada. A CONTRATADA atua como intermediária, isentando-se de
                            responsabilidade por acidentes, atrasos ou falhas mecânicas, cabendo-lhe apenas a escolha de
                            prestadores legalmente habilitados.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 8 – CASO FORTUITO E FORÇA MAIOR</p>
                        <p class="text-justify mb-4">Ocorrendo fenômenos da natureza, calamidade pública, perturbação da
                            ordem, greves ou problemas técnicos que coloquem em risco a segurança, a CONTRATADA poderá
                            alterar itinerários ou cancelar a viagem sem acréscimo de multas ou indenizações.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 9 – CANCELAMENTO, DESISTÊNCIA E TAXAS (Pelo Contratante)</p>
                        <p class="text-justify mb-4">9.1 – Condições do Cancelamento: Rescisão com mais de 30 dias de
                            antecedência: multa de 10%; Entre 30 a 20 dias: multa de 20%; Entre 19 a 15 dias: multa de
                            50%; Entre 14 a 10 dias: multa de 80%; Menos de 9 dias: multa de 100% (sem direito a
                            restituição).<br>
                            9.2 – O contratante poderá optar pela reversão do valor pago em créditos para viagens
                            futuras (prazo de 12 meses).</p>

                        <p class="fw-bold mb-1">CLÁUSULA 10 – CANCELAMENTO PELA CONTRATADA</p>
                        <p class="text-justify mb-4">Caso o pacote seja cancelado pela CONTRATADA por não atingir o
                            quórum mínimo, condições climáticas ou motivos técnicos operacionais, o cliente poderá optar
                            por: reagendamento, crédito integral ou reembolso integral.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 11 – COMPORTAMENTO E BAGAGENS</p>
                        <p class="text-justify mb-4">A CONTRATADA poderá desligar da excursão, sem reembolso, o
                            passageiro que colocar em risco a segurança do grupo, desrespeitar normas ou estiver sob
                            efeito excessivo de álcool/drogas. A CONTRATADA não se responsabiliza por perda, roubo ou
                            extravio de objetos pessoais e bagagens.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 12 – DO FINANCIAMENTO E QUITAÇÃO</p>
                        <p class="text-justify mb-4">O serviço só será prestado após a quitação total das parcelas. Não
                            incidirá juros sobre o valor do pacote, independente do número de parcelas. Em caso de
                            inadimplência, o pacote será considerado cancelado.</p>

                        <p class="fw-bold mb-1">CLÁUSULA 13 – FORO</p>
                        <p class="text-justify mb-4">Para dirimir dúvidas deste contrato, as partes elegem o foro da
                            comarca de Quissamã/RJ.</p>

                        <h5 class="text-center fw-bold mt-5 mb-3">DESCRIÇÃO DA PRESTAÇÃO DE SERVIÇO</h5>
                        <p class="mb-4">
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

                        <p class="fw-bold mb-2">DADOS DO RECEPTIVO E SERVIÇOS PRESTADOS:</p>
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
                                        <td>{{ m.nascimento || "-" }}</td>
                                        <td>{{ m.cpf || "-" }}</td>
                                        <td>{{ excursaoSendoAssinada.aplicarParcelas ?
                                            obterPagamento(excursaoSendoAssinada, m.id) : "À combinar" }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p class="text-justify mb-5"><b>DECLARAÇÃO FINAL:</b> O CONTRATANTE declara que leu, compreendeu
                            e concorda com todas as cláusulas acima, especialmente quanto aos riscos envolvidos e
                            responsabilidades assumidas.</p>

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
                        <button
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

const cpfLogin = ref('')
const usuarioLogado = ref(null)
const erroLogin = ref('')
const erroForm = ref('')
const minhasExcursoes = ref([])
const carregando = ref(false)
const assinando = ref(false)

// Estados do Modal
const modalContratoAberto = ref(false)
const excursaoSendoAssinada = ref(null)

const primeiroNome = computed(() => {
    if (!usuarioLogado.value) return '';
    return usuarioLogado.value.nome.split(' ')[0];
})

onMounted(() => {
    if (import.meta.client) {
        const cpfSalvo = localStorage.getItem('graziTurPassageiroCPF')
        if (cpfSalvo) {
            cpfLogin.value = cpfSalvo
            acessarArea()
        }
    }
})

const acessarArea = async () => {
    erroLogin.value = ''
    if (!cpfLogin.value) { erroLogin.value = 'Por favor, digite seu CPF.'; return; }

    carregando.value = true
    try {
        const res = await $fetch(`/api/passageiro/viagens?cpf=${cpfLogin.value}`)
        usuarioLogado.value = res.user
        minhasExcursoes.value = res.excursoes

        if (import.meta.client) {
            localStorage.setItem('graziTurPassageiroCPF', cpfLogin.value)
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

// LÓGICAS PARA O CONTRATO (Dependentes e Líderes)
const obterDependentes = (ex) => {
    if (!ex || !usuarioLogado.value) return [];
    // Busca os IDs que estão atrelados ao usuário logado (ele sendo o Líder)
    const idsDependentes = ex.grupos?.[String(usuarioLogado.value.id)] || [];
    return ex.usuarios.filter(u => idsDependentes.includes(String(u.id)));
}

const obterLiderEDependentes = (ex) => {
    return [usuarioLogado.value, ...obterDependentes(ex)];
}

// ABRIR O MODAL
const abrirModalContrato = (excursao) => {
    excursaoSendoAssinada.value = excursao;
    modalContratoAberto.value = true;
}

// ASSINAR E FECHAR O MODAL
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

        // Atualiza na interface
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