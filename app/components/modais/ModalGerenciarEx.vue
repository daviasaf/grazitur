<template>
    <div>
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); overflow-y: auto; z-index: 1040;">
            <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable px-2">
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
                                    class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 d-flex flex-column justify-content-center">
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
                                    <thead class="text-muted small text-uppercase">
                                        <tr>
                                            <th class="ps-4 py-3 border-0 text-start fw-bold">Nome do Passageiro</th>
                                            <th class="py-3 border-0 text-center fw-bold">CPF</th>
                                            <th v-if="excursao.aplicarParcelas"
                                                class="py-3 border-0 text-center fw-bold text-brand">Pagamento</th>

                                            <th v-if="excursao.liberarContratos"
                                                class="py-3 border-0 text-center fw-bold text-success">Contrato</th>

                                            <th class="pe-4 py-3 border-0 text-center fw-bold">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in excursao.usuarios" :key="p.id">
                                            <td class="ps-4 py-3 fw-bold text-dark small text-start">{{ p.nome }}</td>
                                            <td class="text-muted fw-semibold small py-3 text-center">{{
                                                mascaraCPF(p.cpf) || '-' }}
                                            </td>
                                            <td v-if="excursao.aplicarParcelas"
                                                class="fw-bold text-brand small py-3 text-center">
                                                <div class="cursor-pointer d-inline-block bg-primary bg-opacity-10 px-3 py-1 rounded-pill"
                                                    @click="$emit('alterarPagamento', p, excursao)"
                                                    title="Alterar Pagamento">
                                                    {{ obterPagamento(p.id) }} ✎
                                                </div>
                                            </td>

                                            <td v-if="excursao.liberarContratos" class="text-center">
                                                <template v-if="p.id === excursao.guiaId">
                                                    <span
                                                        class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-1">✔
                                                        Guia Assinado</span>
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
                                                        class="text-muted small fw-semibold fst-italic">Pendente</span>
                                                </template>
                                            </td>

                                            <td class="pe-4 py-3 text-center">
                                                <button
                                                    class="btn btn-sm bg-danger bg-opacity-10 text-danger border-0 rounded-circle action-btn"
                                                    style="width: 32px; height: 32px;"
                                                    @click="removerUserDaEx(p.id)">✕</button>
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
                                class="p-4 bg-brand-light border border-light rounded-4 position-relative shadow-sm mt-3">

                                <div class="position-absolute top-0 end-0 m-3 d-flex gap-2" style="z-index: 10;">
                                    <button class="btn btn-sm btn-primary shadow-sm fw-bold px-3 rounded-pill"
                                        @click="editarGrupo(liderId)" title="Editar Grupo">✎ Editar</button>
                                    <button class="btn btn-sm btn-danger shadow-sm fw-bold px-3 rounded-pill"
                                        @click="removerGrupo(liderId)" title="Desfazer Grupo">✕ Apagar</button>
                                </div>

                                <div class="fw-bold text-brand mb-2 fs-6 mt-2">Líder: {{ getNomeUser(liderId) }}</div>
                                <div class="small text-dark fw-bold mb-2 ps-4">Acompanhantes (Dependentes):</div>
                                <ul class="mb-0 ps-5 small text-muted fw-semibold">
                                    <li v-for="depId in dependentes" :key="depId" class="mb-1">{{ getNomeUser(depId) }}
                                    </li>
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
const formGrupo = ref({ liderId: null, dependentes: [], originalLiderId: null })
const buscaDependente = ref('')

// Lógica de Assinatura Individual
const verificarAssinatura = (userId) => {
    if (!props.excursao.assinaturas) return false;
    return !!props.excursao.assinaturas[String(userId)];
}

const verificarSeEhDependente = (userId) => {
    if (!props.excursao.grupos) return false;
    return Object.values(props.excursao.grupos).some((dependentesArray) =>
        dependentesArray.map(String).includes(String(userId))
    );
};

const baixarContratoAssinado = (userId) => {
    gerarContratoAssinadoPDF(props.excursao, userId, showToast);
}

const obterPagamento = (pId) => { return props.excursao.pagamentos?.[pId] || 'Pendente'; }
const getNomeUser = (id) => { const u = props.excursao.usuarios.find(x => String(x.id) === String(id)); return u ? u.nome : 'Desconhecido'; }

const removerUserDaEx = async (userId) => {
    try {
        await $fetch('/api/desvincular', { method: 'POST', body: { userId, excursaoId: props.excursao.id } });
        emit('atualizado');
        showToast('Passageiro Removido!', 'success')
    } catch (e) { showToast('Erro ao remover passageiro!', 'danger') }
}

const usuariosParaLider = computed(() => {
    if (!props.excursao) return [];
    const idsJaEmGrupo = new Set();
    Object.entries(props.excursao.grupos || {}).forEach(([lId, arr]) => {
        // Ignora os membros do grupo ATUAL que está sendo editado, para não bloqueá-los de serem selecionados
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
    // O Líder atual selecionado não pode ser dependente dele mesmo
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

    // Se mudou de líder durante a edição, apaga o registro do líder antigo
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
</style>