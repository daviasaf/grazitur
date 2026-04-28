<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 450px;">
            <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                <div
                    class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                    <h5 class="modal-title fw-bold fs-5 text-dark m-0">Alterar Pagamento</h5>
                    <button class="btn-close m-0" @click="$emit('close')"></button>
                </div>
                <div class="modal-body p-4 p-md-5 text-center">
                    <div class="mb-4">
                        <span
                            class="badge bg-primary bg-opacity-10 text-brand px-3 py-2 rounded-pill fw-bold mb-3 fs-6">{{
                            usuarioPagamento?.nome }}</span>
                    </div>
                    <label class="form-label small fw-bold text-muted mb-2">Nova opção de parcela:</label>
                    <select v-model="novoPagamento"
                        class="form-select form-select-lg bg-light border-0 fw-bold text-dark mb-2 py-3 text-center rounded-4">
                        <option value="">-- Pendente / À Combinar --</option>
                        <option v-for="(v, i) in excursaoSelecionada.valores" :key="i"
                            :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor }}</option>
                    </select>
                </div>
                <div class="modal-footer bg-white p-4 border-top border-light rounded-bottom-5">
                    <button class="btn btn-brand w-100 py-3 rounded-pill fw-bold shadow-soft"
                        @click="salvarPagamentoUsuario">Salvar Alteração</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ usuarioPagamento: Object, excursaoSelecionada: Object })
const emit = defineEmits(['close', 'atualizado'])
const { showToast } = useToasts()

const novoPagamento = ref('')

onMounted(() => {
    const atual = props.excursaoSelecionada.pagamentos?.[props.usuarioPagamento.id] || 'Pendente';
    novoPagamento.value = atual === 'Pendente' ? '' : atual;
})

const salvarPagamentoUsuario = async () => {
    const ex = props.excursaoSelecionada;
    const pags = { ...ex.pagamentos };
    if (novoPagamento.value) { pags[props.usuarioPagamento.id] = novoPagamento.value; } else { delete pags[props.usuarioPagamento.id]; }
    const payload = { ...ex, valores: JSON.stringify(ex.valores || []), pagamentosJson: JSON.stringify(pags), contratoDetalhes: JSON.stringify(ex.detalhes || {}), contratoGrupos: JSON.stringify(ex.grupos || {}) };
    try {
        await $fetch(`/api/excursoes/${ex.id}`, { method: 'PUT', body: payload });
        showToast('Pagamento atualizado!', 'success');
        emit('atualizado');
        emit('close');
    } catch (e) { showToast('Erro.', 'danger'); }
}
</script>