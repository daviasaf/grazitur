<template>
    <div>
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); overflow-y: auto; z-index: 1040;">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable px-2 desktop-compact">
                <div class="modal-content border-0 shadow-lg rounded-5 bg-light">
                    <div
                        class="modal-header bg-white p-4 p-md-5 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="modal-title fw-bold fs-4 text-dark mb-1 tracking-tight">{{ excursao.nome }}</h5>
                            <p class="text-brand mb-0 small fw-semibold">{{ excursao.lugar }}</p>
                        </div>
                        <button class="btn-close m-0" @click="$emit('close')"></button>
                    </div>
                    <div class="modal-body p-4 p-md-5 bg-surface">
                        <div class="row g-4 mb-4">
                            <div class="col-lg-12">
                                <div
                                    class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 d-flex flex-column justify-content-center card-ocupacao-wrapper">
                                    <h6 class="small fw-bold text-muted text-uppercase mb-3">Ocupação: {{
                                        excursao.usuarios.length }} / {{ excursao.vagas }}</h6>
                                    <div class="d-flex flex-wrap gap-2">
                                        <button v-if="excursao.ativarContrato"
                                            class="btn btn-outline-primary fw-bold rounded-pill px-4 py-2 shadow-sm"
                                            @click="modalGrupos = true">Gerenciar Grupos / Famílias</button>

                                        <button
                                            class="btn btn-pdf-custom fw-bold rounded-pill px-4 py-2 shadow-sm ms-auto"
                                            @click="acaoBaixarListaPDF"
                                            :disabled="excursao.usuarios.length === 0 || !excursao.guiaId">PDF Lista de
                                            Chamada</button>
                                        <button class="btn btn-excel-custom fw-bold rounded-pill px-4 py-2 shadow-sm"
                                            @click="acaoBaixarListaExcel"
                                            :disabled="excursao.usuarios.length === 0 || !excursao.guiaId">Excel Lista
                                            de Chamada</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="!excursao.guiaId"
                            class="alert alert-danger bg-danger bg-opacity-10 text-danger border-0 small fw-bold py-3 px-4 text-center mb-4 rounded-4 shadow-sm">
                            Vincule um Guia para liberar os downloads de Lista de Chamada.
                        </div>

                        <div class="border border-light rounded-4 overflow-hidden bg-white shadow-sm">
                            <div class="scrollable-table-container">
                                <table class="table table-hover align-middle mb-0 table-fixed-header">
                                    <thead class="text-muted small text-uppercase bg-light">
                                        <tr>
                                            <th class="ps-4 py-3 border-0 text-start fw-bold align-middle">Passageiro &
                                                Contato</th>
                                            <th v-if="excursao.aplicarParcelas"
                                                class="py-3 border-0 text-center fw-bold text-brand align-middle">
                                                Pagamento</th>
                                            <th v-if="excursao.liberarContratos"
                                                class="py-3 border-0 text-center fw-bold text-success align-middle">
                                                Contrato</th>
                                            <th class="pe-4 py-3 border-0 text-center fw-bold align-middle">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in usuariosOrdenados" :key="p.id"
                                            :class="getVinculo(p.id).isDependente ? 'bg-light' : ''">
                                            <td class="ps-4 py-3 text-start align-middle">
                                                <div class="d-flex align-items-center gap-2">
                                                    <span v-if="getVinculo(p.id).isDependente"
                                                        class="text-muted fw-bold mb-1">↳</span>
                                                    <div class="d-flex flex-column justify-content-center">
                                                        <div class="fw-bold d-flex align-items-center gap-2 passageiro-nome"
                                                            :class="getVinculo(p.id).isDependente ? 'text-secondary' : 'text-dark'"
                                                            style="font-size: 0.95rem;">
                                                            {{ p.nome }}
                                                            <span v-if="p.id === excursao.guiaId"
                                                                class="badge bg-warning text-dark py-0 px-2 rounded-pill shadow-sm"
                                                                style="font-size: 0.65rem;">GUIA</span>
                                                        </div>
                                                        <div
                                                            class="text-muted small fw-semibold d-flex align-items-center gap-2 mt-1">
                                                            <span title="CPF">{{ mascaraCPF(p.cpf) || '-' }}</span>
                                                            <span class="text-light opacity-50">|</span>
                                                            <a v-if="p.celular" href="#"
                                                                @click.prevent="abrirModalWhatsApp(p)"
                                                                class="text-success text-decoration-none d-flex align-items-center gap-1 hover-whatsapp cursor-pointer"
                                                                title="Opções do WhatsApp">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12"
                                                                    height="12" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path
                                                                        d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                                                </svg>
                                                                {{ p.celular }}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td v-if="excursao.aplicarParcelas" class="py-3 text-center align-middle">
                                                <div class="cursor-pointer d-inline-block px-3 py-1 rounded-pill fw-bold border transition-hover"
                                                    :class="obterPagamento(p.id) === 'Pendente' ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 'bg-primary bg-opacity-10 text-brand border-primary border-opacity-25'"
                                                    style="font-size: 0.75rem;"
                                                    @click="$emit('alterarPagamento', p, excursao)"
                                                    title="Clique para Alterar Pagamento">
                                                    {{ obterPagamento(p.id) }} ✎
                                                </div>
                                            </td>

                                            <td v-if="excursao.liberarContratos" class="text-center align-middle">
                                                <template v-if="p.id === excursao.guiaId">
                                                    <span
                                                        class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-1">✔
                                                        Guia</span>
                                                </template>
                                                <template v-else-if="verificarSeEhDependente(p.id)">
                                                    <span
                                                        class="text-muted small fw-semibold fst-italic">Dependente</span>
                                                </template>
                                                <template v-else>
                                                    <button v-if="verificarAssinatura(p.id)"
                                                        class="btn btn-sm btn-dark-custom rounded-pill fw-bold px-3 shadow-sm"
                                                        @click="baixarContratoAssinado(p.id)">
                                                        Baixar Assinado
                                                    </button>
                                                    <span v-else
                                                        class="text-danger small fw-bold fst-italic">Pendente</span>
                                                </template>
                                            </td>

                                            <td class="pe-4 py-3 align-middle text-center">
                                                <div
                                                    class="d-flex justify-content-center align-items-center w-100 h-100">
                                                    <button
                                                        class="btn btn-sm bg-danger bg-opacity-10 text-danger border-0 rounded-circle action-btn d-flex align-items-center justify-content-center p-0 m-0"
                                                        style="width: 32px; height: 32px; line-height: 1;"
                                                        title="Remover Passageiro" @click="removerUserDaEx(p.id)">
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="excursao.usuarios.length === 0">
                                            <td colspan="5" class="text-center text-muted py-5 fw-semibold">Nenhum
                                                passageiro vinculado.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer p-4 bg-white border-top border-light d-flex gap-2 rounded-bottom-5">
                        <button class="btn btn-outline-brand-custom fw-bold w-100 py-3 rounded-pill"
                            @click="$emit('editarParametros', excursao)">Editar Parâmetros da Viagem</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalGrupos" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1055;">
            <div class="modal-dialog modal-lg modal-dialog-scrollable px-2">
                <div class="modal-content shadow-lg border-0 rounded-5 bg-light">
                    <div
                        class="modal-header bg-white p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                        <h5 class="modal-title fw-bold text-dark fs-4">Gerenciar Grupos</h5>
                        <button class="btn-close m-0" @click="modalGrupos = false"></button>
                    </div>
                    <div class="modal-body p-4 bg-surface">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <p class="small text-muted mb-0 fw-semibold">Líderes e seus dependentes vinculados.</p>
                            <button class="btn btn-primary-custom fw-bold rounded-pill px-4 py-2 shadow-soft"
                                @click="abrirAgrupar">Novo Grupo</button>
                        </div>
                        <div class="d-flex flex-column gap-3">
                            <div v-if="Object.keys(excursao.grupos || {}).length === 0"
                                class="text-center p-5 bg-white rounded-4 border border-light">
                                <p class="text-muted mb-0 fw-bold">Nenhum grupo familiar configurado ainda.</p>
                            </div>

                            <div v-for="(dependentes, liderId) in (excursao.grupos || {})" :key="liderId"
                                class="p-4 bg-brand-light border border-light rounded-4 shadow-sm mt-3">

                                <div
                                    class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3 border-bottom border-light pb-3">
                                    <div class="fw-bold text-brand fs-6 lh-sm mb-0">
                                        Líder: <span class="text-dark">{{ getNomeUser(liderId) }}</span>
                                    </div>
                                    <div class="d-flex gap-2 w-100 w-sm-auto justify-content-end">
                                        <button
                                            class="btn btn-sm btn-primary shadow-sm fw-bold px-4 py-2 rounded-pill flex-fill flex-sm-grow-0"
                                            @click="editarGrupo(liderId)" title="Editar Grupo">✎ Editar</button>
                                        <button
                                            class="btn btn-sm btn-danger shadow-sm fw-bold px-4 py-2 rounded-pill flex-fill flex-sm-grow-0"
                                            @click="removerGrupo(liderId)" title="Desfazer Grupo">✕ Apagar</button>
                                    </div>
                                </div>

                                <div class="small text-dark fw-bold mb-2 ps-2">Acompanhantes (Dependentes):</div>
                                <ul class="mb-0 ps-4 small text-muted fw-semibold lh-lg">
                                    <li v-for="depId in dependentes" :key="depId">{{ getNomeUser(depId) }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalAgrupar" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1070;">
            <div class="modal-dialog modal-dialog-centered px-2">
                <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                    <div
                        class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                        <h5 class="modal-title fw-bold fs-5 text-dark m-0">{{ formGrupo.originalLiderId ? 'Editar Grupo'
                            :
                            'Criar Grupo Familiar' }}</h5>
                        <button class="btn-close m-0" @click="modalAgrupar = false"></button>
                    </div>
                    <div class="modal-body p-4 p-md-5">
                        <label class="form-label small fw-bold text-brand mb-2">1. Escolha o Líder</label>
                        <select v-model="formGrupo.liderId"
                            class="form-select form-select-lg bg-light border-0 fw-bold text-dark mb-4 py-2"
                            @change="buscaDependente = ''">
                            <option :value="null">-- Selecione --</option>
                            <option v-for="u in usuariosParaLider" :key="u.id" :value="u.id">{{ u.nome }}</option>
                        </select>

                        <label v-if="formGrupo.liderId" class="form-label small fw-bold text-success mb-2">2. Escolha os
                            Dependentes</label>
                        <div v-if="formGrupo.liderId">
                            <input v-model="buscaDependente" type="text"
                                class="form-control bg-light border-0 rounded-pill px-4 py-2 mb-3 fw-semibold"
                                placeholder="Buscar por nome...">
                            <div class="border border-light rounded-4 p-3 bg-white shadow-sm scrollable-table-container"
                                style="min-height: 150px; max-height: 250px;">
                                <div v-for="u in usuariosPossiveisDependentes" :key="u.id" class="form-check mb-3">
                                    <input class="form-check-input shadow-none fs-5" type="checkbox" :value="u.id"
                                        :id="'dep_' + u.id" v-model="formGrupo.dependentes">
                                    <label class="form-check-label fw-bold text-dark mt-1 ms-2 cursor-pointer"
                                        :for="'dep_' + u.id">{{ u.nome }}</label>
                                </div>
                                <div v-if="usuariosPossiveisDependentes.length === 0"
                                    class="small text-muted text-center py-4 fw-semibold">Nenhum passageiro disponível.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer bg-light p-3 border-top border-light rounded-bottom-5">
                        <button class="btn btn-primary-custom w-100 py-3 rounded-pill fw-bold shadow-soft"
                            @click="salvarGrupo">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </div>

        <UiModalConfirm v-if="modalConfirmRemover" title="Remover Passageiro"
            text="Tem certeza que deseja remover este passageiro da excursão?" @confirm="confirmarRemocao"
            @cancel="modalConfirmRemover = false" />

        <div v-if="modalWhatsAppAberto" class="modal fade show d-block"
            style="background: rgba(0,0,0,0.6); z-index: 1080;">
            <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 400px;">
                <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                    <div
                        class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                        <h5 class="modal-title fw-bold fs-5 text-dark m-0">Contato WhatsApp</h5>
                        <button class="btn-close m-0" @click="modalWhatsAppAberto = false"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <p class="text-muted small fw-semibold mb-4">Como deseja falar com <strong class="text-dark">{{
                                passageiroWhatsApp?.nome }}</strong>?</p>

                        <div class="d-flex flex-column gap-3">
                            <button class="btn btn-outline-success fw-bold py-3 rounded-pill shadow-sm"
                                @click="enviarMensagemNormal">
                                Mandar Mensagem
                            </button>
                            <button class="btn btn-success fw-bold py-3 rounded-pill shadow-soft"
                                @click="enviarMensagemAssinatura">
                                Pedir para Assinar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mascaraCPF } from '~/utils/formatadores'
import { exportarListaPDF, exportarListaExcel, gerarContratoAssinadoPDF } from '~/utils/exportacoes'

const props = defineProps({ excursao: { type: Object, required: true } })
const emit = defineEmits(['close', 'atualizado', 'editarParametros', 'alterarPagamento'])
const { showToast } = useToasts()

const modalGrupos = ref(false)
const modalAgrupar = ref(false)
const modalConfirmRemover = ref(false)
const modalWhatsAppAberto = ref(false)
const passageiroWhatsApp = ref(null)
const passageiroParaRemover = ref(null)
const formGrupo = ref({ liderId: null, dependentes: [], originalLiderId: null })
const buscaDependente = ref('')

const usuariosOrdenados = computed(() => {
    if (!props.excursao || !props.excursao.usuarios) return [];

    const ordered = [];
    const processedIds = new Set();

    const usuariosMap = new Map(props.excursao.usuarios.map(u => [String(u.id), u]));
    const grupos = props.excursao.grupos || {};

    for (const [liderId, dependentes] of Object.entries(grupos)) {
        if (usuariosMap.has(liderId)) {
            ordered.push(usuariosMap.get(liderId));
            processedIds.add(liderId);

            dependentes.forEach(depId => {
                if (usuariosMap.has(String(depId)) && !processedIds.has(String(depId))) {
                    ordered.push(usuariosMap.get(String(depId)));
                    processedIds.add(String(depId));
                }
            });
        }
    }

    props.excursao.usuarios.forEach(u => {
        if (!processedIds.has(String(u.id))) {
            ordered.push(u);
        }
    });

    return ordered;
});

const formatarWhatsApp = (celular) => {
    if (!celular) return '#';
    const num = celular.replace(/\D/g, '');
    return `https://wa.me/55${num}`;
}

const abrirModalWhatsApp = (p) => {
    passageiroWhatsApp.value = p;
    modalWhatsAppAberto.value = true;
}

const enviarMensagemNormal = () => {
    if (!passageiroWhatsApp.value) return;
    const link = formatarWhatsApp(passageiroWhatsApp.value.celular);
    window.open(link, '_blank');
    modalWhatsAppAberto.value = false;
}

const enviarMensagemAssinatura = () => {
    if (!passageiroWhatsApp.value) return;
    const p = passageiroWhatsApp.value;
    const primeiroNome = p.nome.split(' ')[0];

    let msg = `Olá, ${primeiroNome}! Tudo bem?\n\n`;
    msg += `Para você garantir sua vaga na viagem *${props.excursao.nome}*, preciso que você assine o contrato no link abaixo.\n\n`;
    msg += `O seu plano está com o valor de *${obterPagamento(p.id)}*.\n`;

    const dependentesIds = props.excursao.grupos?.[String(p.id)] || [];
    if (dependentesIds.length > 0) {
        msg += `\nComo você tem dependentes, você também deve assinar por eles. Os dependentes são:\n`;
        dependentesIds.forEach((depId, i) => {
            const depNome = getNomeUser(depId);
            const depPag = obterPagamento(depId);
            msg += `${i + 1}. ${depNome} no valor de *${depPag}*\n`;
        });
    }

    const linkSite = "https://painel-grazi-tur.onrender.com/";
    msg += `\n*Para assinar:*\n`;
    msg += `Entre no link abaixo, clique em *Acessar Minha Viagem*, digite o seu CPF e leia o contrato atentamente antes de assinar!\n\n`;
    msg += `${linkSite}`;

    const num = p.celular.replace(/\D/g, '');
    const url = `https://wa.me/55${num}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    modalWhatsAppAberto.value = false;
}

const getVinculo = (userId) => {
    if (props.excursao.grupos) {
        for (const dependentes of Object.values(props.excursao.grupos)) {
            if (dependentes.includes(String(userId))) {
                return { isDependente: true };
            }
        }
    }
    return { isDependente: false };
}

const verificarAssinatura = (userId) => {
    if (!props.excursao.assinaturas) return false;
    return !!props.excursao.assinaturas[String(userId)];
}

const verificarSeEhDependente = (userId) => {
    return getVinculo(userId).isDependente;
};

const baixarContratoAssinado = (userId) => {
    gerarContratoAssinadoPDF(props.excursao, userId, showToast);
}

const obterPagamento = (pId) => { return props.excursao.pagamentos?.[pId] || 'Pendente'; }

const getNomeUser = (id) => { const u = props.excursao.usuarios.find(x => String(x.id) === String(id)); return u ? u.nome : 'Desconhecido'; }

const removerUserDaEx = (userId) => {
    passageiroParaRemover.value = userId;
    modalConfirmRemover.value = true;
}

const confirmarRemocao = async () => {
    modalConfirmRemover.value = false;
    try {
        await $fetch('/api/desvincular', { method: 'POST', body: { userId: passageiroParaRemover.value, excursaoId: props.excursao.id } });
        emit('atualizado');
        showToast('Passageiro Removido!', 'success')
    } catch (e) { showToast('Erro ao remover passageiro!', 'danger') }
}

const usuariosParaLider = computed(() => {
    if (!props.excursao) return [];
    const idsJaEmGrupo = new Set();
    Object.entries(props.excursao.grupos || {}).forEach(([lId, arr]) => {
        if (String(lId) !== String(formGrupo.value.originalLiderId)) {
            idsJaEmGrupo.add(String(lId));
            arr.forEach(i => idsJaEmGrupo.add(String(i)));
        }
    });
    return props.excursao.usuarios.filter(u => !idsJaEmGrupo.has(String(u.id)) && u.id !== props.excursao.guiaId);
});

const usuariosPossiveisDependentes = computed(() => {
    if (!props.excursao || !formGrupo.value.liderId) return [];
    const idsJaEmGrupo = new Set();
    Object.entries(props.excursao.grupos || {}).forEach(([lId, arr]) => {
        if (String(lId) !== String(formGrupo.value.originalLiderId)) {
            idsJaEmGrupo.add(String(lId));
            arr.forEach(i => idsJaEmGrupo.add(String(i)));
        }
    });
    idsJaEmGrupo.add(String(formGrupo.value.liderId));

    let lista = props.excursao.usuarios.filter(u => !idsJaEmGrupo.has(String(u.id)) && u.id !== props.excursao.guiaId);
    if (buscaDependente.value) { lista = lista.filter(u => u.nome.toLowerCase().includes(buscaDependente.value.toLowerCase())); }
    return lista;
})

const abrirAgrupar = () => {
    formGrupo.value = { liderId: null, dependentes: [], originalLiderId: null };
    buscaDependente.value = '';
    modalAgrupar.value = true;
}

const editarGrupo = (liderIdStr) => {
    formGrupo.value = {
        liderId: Number(liderIdStr),
        dependentes: props.excursao.grupos[liderIdStr].map(Number),
        originalLiderId: Number(liderIdStr)
    };
    buscaDependente.value = '';
    modalAgrupar.value = true;
}

const salvarGrupo = async () => {
    if (!formGrupo.value.liderId || formGrupo.value.dependentes.length === 0) {
        showToast('Selecione o líder e os dependentes.', 'warning');
        return;
    }

    const novosGrupos = { ...(props.excursao.grupos || {}) };

    if (formGrupo.value.originalLiderId && String(formGrupo.value.originalLiderId) !== String(formGrupo.value.liderId)) {
        delete novosGrupos[String(formGrupo.value.originalLiderId)];
    }

    novosGrupos[String(formGrupo.value.liderId)] = formGrupo.value.dependentes.map(String);

    const payload = {
        ...props.excursao,
        valores: JSON.stringify(props.excursao.valores),
        contratoDetalhes: JSON.stringify(props.excursao.detalhes || {}),
        contratoGrupos: JSON.stringify(novosGrupos)
    };

    try {
        await $fetch(`/api/excursoes/${props.excursao.id}`, { method: 'PUT', body: payload });
        showToast('Grupo salvo com sucesso!', 'success');
        modalAgrupar.value = false;
        emit('atualizado');
    } catch (e) { showToast('Erro ao agrupar.', 'danger'); }
}

const removerGrupo = async (liderId) => {
    const novosGrupos = { ...(props.excursao.grupos || {}) };
    delete novosGrupos[String(liderId)];
    const payload = {
        ...props.excursao,
        valores: JSON.stringify(props.excursao.valores),
        contratoDetalhes: JSON.stringify(props.excursao.detalhes || {}),
        contratoGrupos: JSON.stringify(novosGrupos)
    };

    try {
        await $fetch(`/api/excursoes/${props.excursao.id}`, { method: 'PUT', body: payload });
        showToast('Grupo removido!', 'success');
        emit('atualizado');
    } catch (e) { showToast('Erro.', 'danger'); }
}

const acaoBaixarListaPDF = () => { exportarListaPDF(props.excursao, showToast) }
const acaoBaixarListaExcel = () => { exportarListaExcel(props.excursao, showToast) }
</script>

<style scoped>
.scrollable-table-container {
    overflow-y: auto;
    max-height: 400px;
}

.cursor-pointer {
    cursor: pointer;
}

.action-btn {
    transition: transform 0.1s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

.transition-hover {
    transition: all 0.2s;
}

.transition-hover:hover {
    filter: brightness(0.9);
    transform: scale(1.02);
}

.hover-whatsapp:hover {
    text-decoration: underline !important;
    opacity: 0.8;
}

.btn-pdf-custom {
    background-color: #DC3545;
    color: white;
    border: none;
    transition: background-color 0.2s;
}

.btn-pdf-custom:hover {
    background-color: #A52834;
    color: white;
}

.btn-excel-custom {
    background-color: #198754;
    color: white;
    border: none;
    transition: background-color 0.2s;
}

.btn-excel-custom:hover {
    background-color: #146c43;
    color: white;
}

.btn-primary-custom {
    background-color: #0d6efd;
    color: white;
    border: none;
}

.btn-primary-custom:hover {
    background-color: #0b5ed7;
    color: white;
}

.btn-dark-custom {
    background-color: #212529;
    color: white;
    border: none;
}

.btn-dark-custom:hover {
    background-color: #000000;
    color: white;
}

.btn-outline-brand-custom {
    color: #2563eb;
    border: 2px solid #2563eb;
    background-color: transparent;
}

.btn-outline-brand-custom:hover {
    background-color: #2563eb;
    color: white;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (min-width: 992px) {
    .desktop-compact {
        max-width: 92vw !important;
    }

    .desktop-compact .modal-header,
    .desktop-compact .modal-body,
    .desktop-compact .modal-footer {
        padding: 1.25rem 1.5rem !important;
    }

    .desktop-compact .modal-title {
        font-size: 1.2rem !important;
    }

    .desktop-compact .card-ocupacao-wrapper {
        padding: 1rem 1.25rem !important;
    }

    .desktop-compact .card-ocupacao-wrapper h6 {
        margin-bottom: 0.5rem !important;
        font-size: 0.75rem !important;
    }

    .desktop-compact .row.g-4.mb-4 {
        margin-bottom: 1rem !important;
    }

    .desktop-compact .scrollable-table-container {
        max-height: 68vh !important;
    }

    .desktop-compact .table th,
    .desktop-compact .table td {
        padding: 0.4rem 1rem !important;
    }

    .desktop-compact .table th {
        font-size: 0.75rem !important;
    }

    .desktop-compact .passageiro-nome {
        font-size: 0.85rem !important;
    }

    .desktop-compact .text-muted.small {
        font-size: 0.75rem !important;
    }

    .desktop-compact .btn {
        font-size: 0.8rem !important;
        padding: 0.4rem 1rem !important;
    }

    .desktop-compact .btn-sm {
        padding: 0.25rem 0.5rem !important;
    }

    .desktop-compact .action-btn {
        width: 28px !important;
        height: 28px !important;
        font-size: 0.8rem !important;
        padding: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .desktop-compact .alert {
        padding: 0.75rem 1rem !important;
        margin-bottom: 1rem !important;
    }
}
</style>