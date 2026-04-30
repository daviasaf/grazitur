<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); overflow-y: auto; z-index: 1050;">
        <div class="modal-dialog modal-dialog-centered px-2">
            <div class="modal-content shadow-lg border-0 rounded-5 bg-light">
                <div
                    class="modal-header bg-white p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                    <h5 class="modal-title fw-bold fs-5 text-dark m-0">Matricular <span class="text-brand">{{
                        userParaVincular.nome }}</span></h5>
                    <button class="btn-close m-0" @click="$emit('close')"></button>
                </div>
                <div class="modal-body p-4 bg-white">
                    <div v-if="!excursaoSendoVinculada && !excursaoVinculada">
                        <p class="text-muted fw-bold mb-4 text-center">Selecione a viagem destino:</p>
                        <div class="d-flex flex-column gap-3">
                            <button v-for="e in excursoes" :key="e.id" @click="selecionarExcursaoParaVincular(e)"
                                class="btn btn-white text-start p-4 rounded-4 border border-light shadow-hover bg-white"
                                :disabled="e._count.usuarios >= e.vagas">
                                <strong class="text-dark fs-5 d-block mb-1">{{ e.nome }}</strong>
                                <small class="text-brand fw-semibold">{{ e.lugar }}</small>
                                <span class="badge mt-3 d-block rounded-pill px-4 py-2 fs-6"
                                    :class="e._count.usuarios >= e.vagas ? 'bg-danger' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'">{{
                                        e._count.usuarios }}/{{ e.vagas }} vagas ocupadas</span>
                            </button>
                        </div>
                    </div>

                    <div v-if="excursaoSendoVinculada && !excursaoVinculada" class="text-center py-3">
                        <h6 class="fw-bold mb-4 text-dark fs-5">Definir Pagamento: <span
                                class="text-brand d-block mt-2">{{ userParaVincular.nome }}</span></h6>
                        <div class="p-4 bg-light rounded-4 border border-light mb-4">
                            <label class="form-label fw-semibold text-muted mb-3">Escolha a parcela para este
                                passageiro:</label>
                            <select v-model="opcaoPagamentoMain"
                                class="form-select form-select-lg border-0 fw-bold text-dark bg-white shadow-sm rounded-3 py-3 text-center">
                                <option value="">-- À Combinar --</option>
                                <option value="Criança de 0 a 1,9 meses - Isento">Criança de 0 a 1,9 meses - Isento
                                </option>
                                <option v-for="(v, i) in excursaoSendoVinculada.valores" :key="i"
                                    :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor }}</option>
                            </select>
                        </div>
                        <div class="d-flex gap-3">
                            <button class="btn btn-light fw-bold flex-fill py-3 rounded-pill border border-light"
                                @click="excursaoSendoVinculada = null">Voltar</button>
                            <button class="btn btn-brand fw-bold flex-fill py-3 rounded-pill shadow-soft"
                                @click="vincularMainUser(userParaVincular.id, excursaoSendoVinculada)">Confirmar
                                Inscrição</button>
                        </div>
                    </div>

                    <div v-if="excursaoVinculada">
                        <div v-if="!parenteSendoVinculado">
                            <div
                                class="alert alert-success bg-success bg-opacity-10 border-0 text-success py-4 mb-4 fw-bold text-center rounded-4 shadow-sm fs-5">
                                ✔ Passageiro Adicionado!</div>
                            <div v-if="parentesDoUsuarioSelecionado.length > 0">
                                <h6 class="fw-bold mb-4 text-dark text-center">Deseja adicionar o grupo familiar também?
                                </h6>
                                <div class="d-flex flex-column gap-3 scrollable-table-container">
                                    <div v-for="parente in parentesDoUsuarioSelecionado" :key="parente.id"
                                        class="p-3 bg-white rounded-4 shadow-sm border border-light d-flex justify-content-between align-items-center gap-3"
                                        :class="{ 'border-success bg-success bg-opacity-10': parentesAdicionadosNaSessao.includes(parente.id) }">
                                        <div>
                                            <span class="fw-bold fs-6 d-block mb-1"
                                                :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'text-success' : 'text-dark'">{{
                                                    parente.nome }}</span>
                                            <small class="text-muted fw-semibold">CPF: {{ parente.cpf || '-' }}</small>
                                        </div>
                                        <button class="btn fw-bold rounded-pill px-4 py-2 shadow-sm"
                                            :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'btn-success' : 'btn-outline-brand bg-white'"
                                            :disabled="parentesAdicionadosNaSessao.includes(parente.id)"
                                            @click="iniciarVinculoParente(parente)">
                                            {{ parentesAdicionadosNaSessao.includes(parente.id) ? '✔ Inserido' :
                                                'Adicionar' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="parenteSendoVinculado" class="text-center py-3">
                            <h6 class="fw-bold mb-4 text-dark fs-5">Definir Pagamento Dependente: <span
                                    class="text-brand d-block mt-2">{{ parenteSendoVinculado.nome }}</span></h6>
                            <div class="p-4 bg-light rounded-4 border border-light mb-4">
                                <select v-model="opcaoPagamentoParente"
                                    class="form-select form-select-lg border-0 fw-bold text-dark bg-white shadow-sm rounded-3 py-3 text-center">
                                    <option value="">-- À Combinar --</option>
                                    <option value="Criança de 0 a 1,9 meses - Isento">Criança de 0 a 1,9 meses - Isento
                                    </option>
                                    <option v-for="(v, i) in excursaoVinculada.valores" :key="i"
                                        :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor }}
                                    </option>
                                </select>
                            </div>
                            <div class="d-flex gap-3">
                                <button class="btn btn-light fw-bold flex-fill py-3 rounded-pill border border-light"
                                    @click="parenteSendoVinculado = null">Cancelar</button>
                                <button class="btn btn-brand fw-bold flex-fill py-3 rounded-pill shadow-soft"
                                    @click="confirmarVinculoParente">Confirmar Vínculo</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-light p-4 border-top border-light rounded-bottom-5"
                    v-if="excursaoVinculada && !parenteSendoVinculado">
                    <button class="btn btn-brand w-100 py-3 rounded-pill fw-bold shadow-soft fs-5"
                        @click="$emit('close')">Concluir Processo</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ userParaVincular: { type: Object, required: true }, excursoes: { type: Array, required: true } })
const emit = defineEmits(['close', 'atualizado'])
const { showToast } = useToasts()

const excursaoSendoVinculada = ref(null)
const excursaoVinculada = ref(null)
const opcaoPagamentoMain = ref('')
const parenteSendoVinculado = ref(null)
const opcaoPagamentoParente = ref('')
const parentesAdicionadosNaSessao = ref([])

const parentesDoUsuarioSelecionado = computed(() => {
    const listaBruta = [...(props.userParaVincular.parentes || []), ...(props.userParaVincular.parentesDe || [])];
    const listaUnica = [...new Map(listaBruta.map(item => [item.id, item])).values()];
    return listaUnica.map(p => ({ ...p, adicionado: false }))
})

const selecionarExcursaoParaVincular = (e) => {
    if (e.usuarios && e.usuarios.some(u => String(u.id) === String(props.userParaVincular.id))) {
        showToast(`${props.userParaVincular.nome} já está matriculado(a) nesta viagem!`, 'warning');
        return;
    }

    excursaoSendoVinculada.value = e;
    opcaoPagamentoMain.value = '';
    if (!e.aplicarParcelas) vincularMainUser(props.userParaVincular.id, e)
}

const vincularMainUser = async (userId, excursao) => {
    const op = excursao.aplicarParcelas ? opcaoPagamentoMain.value : null;
    if (excursao.aplicarParcelas && !op && userId !== excursao.guiaId) { showToast('Selecione a parcela!', 'warning'); return }
    if (excursao.guiaId === userId) { showToast('Usuário é o guia da viagem!', 'warning'); return }
    try {
        await $fetch('/api/vincular', { method: 'POST', body: { userId, excursaoId: excursao.id, opcaoPagamento: op } });
        excursaoVinculada.value = excursao;
        showToast('Adicionado com sucesso!', 'success');
        emit('atualizado');
    } catch (e) {
        showToast(e.data?.message || 'Erro ao matricular!', 'danger')
    }
}

const iniciarVinculoParente = (parente) => {
    if (excursaoVinculada.value.usuarios && excursaoVinculada.value.usuarios.some(u => String(u.id) === String(parente.id))) {
        showToast(`${parente.nome} já está matriculado(a) nesta viagem!`, 'warning');
        parentesAdicionadosNaSessao.value.push(parente.id);
        return;
    }

    if (excursaoVinculada.value.aplicarParcelas && parente.id !== excursaoVinculada.value.guiaId) {
        parenteSendoVinculado.value = parente; opcaoPagamentoParente.value = '';
    } else {
        vincularParente(parente, excursaoVinculada.value.id, null);
    }
}

const confirmarVinculoParente = () => {
    if (!opcaoPagamentoParente.value) { showToast('Selecione a parcela para o parente!', 'warning'); return; }
    vincularParente(parenteSendoVinculado.value, excursaoVinculada.value.id, opcaoPagamentoParente.value);
}

const vincularParente = async (parente, excursaoId, opcaoPag) => {
    const op = opcaoPag || null;
    if (parentesAdicionadosNaSessao.value.includes(parente.id)) return;
    if (excursaoVinculada.value && excursaoVinculada.value.guiaId === parente.id) { showToast('É o Guia!', 'warning'); return }
    try {
        await $fetch('/api/vincular', { method: 'POST', body: { userId: parente.id, excursaoId, opcaoPagamento: op } });
        parentesAdicionadosNaSessao.value.push(parente.id);
        parenteSendoVinculado.value = null; opcaoPagamentoParente.value = '';
        showToast('Dependente adicionado!', 'success');
        emit('atualizado');
    } catch (e) {
        showToast(e.data?.message || 'Erro ao matricular dependente!', 'danger')
    }
}
</script>