<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); overflow-y: auto; z-index: 1050;">
        <div class="modal-dialog modal-lg modal-dialog-centered px-2" style="max-width: 800px;">
            <div class="modal-content border-0 shadow-lg rounded-5 bg-light">
                <div
                    class="modal-header bg-white p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                    <h5 class="modal-title fw-bold text-dark fs-5 d-flex align-items-center gap-2 m-0">
                        {{ formEx.id ? 'Editar Excursão' : 'Nova Excursão' }}
                    </h5>
                    <button class="btn-close m-0" @click="$emit('close')"></button>
                </div>
                <div class="modal-body p-4 bg-white">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted mb-1 fw-semibold">Título do Pacote *</label>
                            <input v-model="formEx.nome"
                                class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-semibold"
                                placeholder="Ex: Fim de Semana Beto Carrero">
                        </div>
                        <div class="col-12 col-md-8">
                            <label class="form-label small text-muted mb-1 fw-semibold">Destino *</label>
                            <input v-model="formEx.lugar"
                                class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-semibold"
                                placeholder="Local de destino principal">
                        </div>
                        <div class="col-12 col-md-4">
                            <label class="form-label small text-muted mb-1 fw-semibold">Qtd de Vagas *</label>
                            <input v-model="formEx.vagas" type="number"
                                class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-bold text-brand">
                        </div>

                        <div class="col-12 mt-4 p-4 bg-light rounded-4 border border-light">
                            <label
                                class="form-label small fw-bold text-dark mb-3 d-flex align-items-center gap-2">Configurações
                                e Pagamento *</label>

                            <div class="d-flex flex-column flex-sm-row gap-2 mb-3">
                                <input v-model="novoValor" type="number"
                                    class="form-control bg-white border-0 shadow-sm py-2 fw-semibold"
                                    placeholder="Valor (Ex: 1800)">
                                <input v-model="novasVezes" type="number"
                                    class="form-control bg-white border-0 shadow-sm py-2 fw-semibold"
                                    placeholder="Vezes (Ex: 3)">
                                <button class="btn btn-brand fw-bold px-4 rounded-3 text-nowrap shadow-sm"
                                    @click="adicionarValorExcursao">Adicionar Valor</button>
                            </div>

                            <ul class="list-group list-group-flush rounded-3 overflow-hidden shadow-sm mb-4">
                                <li v-for="(v, index) in formEx.valores" :key="index"
                                    class="list-group-item d-flex justify-content-between align-items-center py-3 px-4 bg-white">
                                    <span class="fw-bold text-dark fs-6">{{ v.vezes }}x de R$ {{ v.valor }}</span>
                                    <button class="btn btn-sm text-danger p-1 border-0 bg-light rounded-circle"
                                        style="width: 28px; height: 28px;"
                                        @click="removerValorExcursao(index)">✕</button>
                                </li>
                            </ul>

                            <hr class="my-4 border-secondary opacity-10">

                            <div class="d-flex flex-column gap-3">
                                <div
                                    class="form-check form-switch d-flex align-items-center bg-white p-3 rounded-3 shadow-sm m-0 border border-light">
                                    <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                        type="checkbox" v-model="formEx.liberarContratos" id="liberarContratosSwitch">
                                    <label class="form-check-label fw-bold text-success cursor-pointer lh-sm"
                                        for="liberarContratosSwitch">
                                        Liberar Assinatura Digital no Portal <br>
                                        <span class="text-muted small fw-normal fst-italic">Permite que o cliente
                                            visualize e assine pelo CPF</span>
                                    </label>
                                </div>

                                <div
                                    class="form-check form-switch d-flex align-items-center bg-white p-3 rounded-3 shadow-sm m-0 border border-light">
                                    <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                        type="checkbox" v-model="formEx.ativarContrato" id="ativarContratoSwitch">
                                    <label class="form-check-label fw-bold text-dark cursor-pointer lh-sm"
                                        for="ativarContratoSwitch">Habilitar Contratos Oficiais</label>
                                </div>

                                <div
                                    class="form-check form-switch d-flex align-items-center bg-white p-3 rounded-3 shadow-sm m-0 border border-light">
                                    <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                        type="checkbox" v-model="formEx.aplicarParcelas" id="aplicarParcelasSwitch">
                                    <label class="form-check-label fw-bold text-dark cursor-pointer lh-sm"
                                        for="aplicarParcelasSwitch">Atribuir parcelas individualmente</label>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-4 pt-4 border-top border-light" v-if="formEx.ativarContrato">
                            <h6 class="fw-bold text-brand mb-3">Parâmetros Jurídicos do Contrato</h6>
                            <div class="row g-3 bg-light p-4 rounded-4 border border-light">
                                <div class="col-6 col-md-3">
                                    <label class="form-label small fw-semibold text-muted mb-1">Data Saída</label>
                                    <input :value="formEx.detalhes?.dataSaida"
                                        @input="e => formEx.detalhes.dataSaida = mascaraData(e.target.value)"
                                        type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="DD/MM/AAAA" maxlength="10">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label small fw-semibold text-muted mb-1">Hora Saída</label>
                                    <input :value="formEx.detalhes?.horaSaida"
                                        @input="e => formEx.detalhes.horaSaida = mascaraHora(e.target.value)"
                                        type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="03:00" maxlength="5">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label small fw-semibold text-muted mb-1">Data Retorno</label>
                                    <input :value="formEx.detalhes?.dataRetorno"
                                        @input="e => formEx.detalhes.dataRetorno = mascaraData(e.target.value)"
                                        type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="DD/MM/AAAA" maxlength="10">
                                </div>
                                <div class="col-6 col-md-3">
                                    <label class="form-label small fw-semibold text-muted mb-1">Hora Retorno</label>
                                    <input :value="formEx.detalhes?.horaRetorno"
                                        @input="e => formEx.detalhes.horaRetorno = mascaraHora(e.target.value)"
                                        type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="17:00" maxlength="5">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small fw-semibold text-muted mb-1">Meio de
                                        Transporte</label>
                                    <input v-model="formEx.detalhes.transporte" type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="Ex: Van">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small fw-semibold text-muted mb-1">Transportadora</label>
                                    <input v-model="formEx.detalhes.empresa" type="text"
                                        class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                        placeholder="Ex: Quissa Turismo">
                                </div>
                                <div class="col-12">
                                    <label class="form-label small fw-semibold text-muted mb-1">Roteiro Completo</label>
                                    <textarea v-model="formEx.detalhes.roteiro"
                                        class="form-control bg-white border-0 shadow-sm p-3" rows="4"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 mt-4 p-4 bg-brand-light rounded-4 border border-brand border-opacity-25">
                            <label class="form-label small fw-bold text-brand mb-2">Guia Responsável (Opcional)</label>
                            <select v-model="formEx.guiaId"
                                class="form-select form-select-lg border-0 fw-semibold text-dark bg-white shadow-sm rounded-3 py-2">
                                <option :value="null">-- Nenhum Guia Vinculado --</option>
                                <option v-for="g in guiasDisponiveis" :key="g.id" :value="g.id">{{ g.nome }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    class="modal-footer p-4 bg-white border-top border-light d-flex flex-column flex-sm-row gap-2 rounded-bottom-5">
                    <button v-if="formEx.id"
                        class="btn btn-outline-danger fw-bold rounded-pill py-3 w-100 w-sm-auto px-4 me-auto"
                        @click="$emit('apagar', formEx.id)">Apagar Viagem</button>
                    <button
                        class="btn btn-light text-secondary fw-bold border border-light py-3 w-100 w-sm-auto px-4 rounded-pill"
                        :class="!formEx.id ? 'me-auto' : ''" @click="$emit('close')">Cancelar</button>
                    <button class="btn btn-brand fw-bold px-5 py-3 w-100 w-sm-auto rounded-pill shadow-soft"
                        @click="salvarExcursao">Salvar Excursão</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    excursaoEditando: { type: Object, default: () => null },
    guiasDisponiveis: { type: Array, required: true }
})
const emit = defineEmits(['close', 'salvo', 'apagar'])
const { showToast } = useToasts()

const formEx = ref({
    id: null,
    nome: '',
    lugar: '',
    vagas: '',
    guiaId: null,
    valores: [],
    ativarContrato: false,
    aplicarParcelas: false,
    liberarContratos: false, // NOVO CAMPO
    detalhes: { dataSaida: '', horaSaida: '', dataRetorno: '', horaRetorno: '', transporte: '', empresa: '', roteiro: '' }
})

const novoValor = ref('')
const novasVezes = ref('')

onMounted(() => {
    if (props.excursaoEditando) {
        formEx.value = JSON.parse(JSON.stringify(props.excursaoEditando))
    }
})

const adicionarValorExcursao = () => {
    if (novoValor.value && novasVezes.value) {
        formEx.value.valores = [...(formEx.value.valores || []), { valor: parseFloat(novoValor.value), vezes: parseInt(novasVezes.value) }];
        novoValor.value = ''; novasVezes.value = ''
    }
}
const removerValorExcursao = (index) => { formEx.value.valores = formEx.value.valores.filter((_, i) => i !== index) }

const salvarExcursao = async () => {
    if (!formEx.value.nome || !formEx.value.lugar || !formEx.value.vagas || !formEx.value.valores || formEx.value.valores.length === 0) { showToast('Título, Destino, Vagas e Pagamento são obrigatórios!', 'warning'); return; }

    const method = formEx.value.id ? 'PUT' : 'POST';
    const url = formEx.value.id ? `/api/excursoes/${formEx.value.id}` : '/api/excursoes';

    const payload = {
        ...formEx.value,
        valores: JSON.stringify(formEx.value.valores || []),
        ativarContrato: formEx.value.ativarContrato,
        aplicarParcelas: formEx.value.aplicarParcelas,
        liberarContratos: formEx.value.liberarContratos, // ENVIA O NOVO CAMPO
        contratoDetalhes: JSON.stringify(formEx.value.detalhes || {})
    };

    try {
        await $fetch(url, { method, body: payload });
        showToast('Viagem salva com sucesso!', 'success');
        emit('salvo');
        emit('close');
    } catch (e) { showToast('Erro ao salvar excursão.', 'danger') }
}
</script>