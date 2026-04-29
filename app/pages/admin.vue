<template>
    <div class="app-container">
        <UiToastManager />
        <AuthAdminLogin v-if="!logado" @sucesso="aoLogar" />

        <div v-else class="min-vh-100 bg-surface pb-5">
           <LayoutAdminHeader @logout="fazerLogout" @exportarSeed="acaoGerarSeed" />

            <div class="main-container px-3 px-md-4 mt-4 mt-md-5">

                <div class="bg-white p-4 p-md-5 rounded-5 mb-5 shadow-sm border-0">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                        <h4 class="text-dark fw-bold mb-0 fs-4 tracking-tight">Excursões Ativas</h4>
                        <button
                            class="btn btn-brand btn-sm shadow-soft px-4 py-2 fw-bold rounded-pill d-flex align-items-center gap-2"
                            @click="abrirNovaExcursao">Nova Excursão</button>
                    </div>

                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div class="col" v-for="ex in excursoes" :key="ex.id">
                            <ExcursoesExcursaoCard :excursao="ex" @gerenciar="abrirGerenciarExcursao(ex)" />
                        </div>
                        <div v-if="excursoes.length === 0" class="col-12 text-center py-5 text-muted opacity-50">Nenhuma
                            excursão cadastrada.</div>
                    </div>
                </div>

                <div class="bg-white p-4 p-md-5 rounded-5 shadow-sm border-0 mb-5">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                        <h4 class="text-dark fw-bold mb-0 fs-4 tracking-tight">Base de Passageiros</h4>
                        <div class="d-flex gap-2 w-100 w-sm-auto">
                            <input v-model="buscaUser" type="text"
                                class="form-control bg-light rounded-pill px-4 fw-semibold"
                                placeholder="Buscar passageiro...">
                            <button class="btn btn-brand fw-bold px-4 rounded-pill d-flex align-items-center gap-2"
                                @click="abrirNovoUser">Cadastro</button>
                        </div>
                    </div>

                    <PassageirosTabela :usuarios="usuariosFiltrados" @vincular="abrirVincular" @editar="abrirEdicaoUser"
                        @excluir="(u) => pedirConfirmacao('user', u.id, 'Excluir Passageiro', 'Deseja excluir permanentemente este cadastro?')" />
                </div>
            </div>

          <ModaisModalUser v-if="modalUser" :usuarioEditando="userSelecionado" :todosUsuarios="usuarios"
                @close="modalUser = false" @salvo="carregar" />
                @salvo="carregar" />
            <ModaisModalNovaExcursao v-if="modalCriarExcursao" :excursaoEditando="exSelecionada"
                :guiasDisponiveis="guiasDisponiveis" @close="modalCriarExcursao = false" @salvo="carregar"
                @apagar="(id) => pedirConfirmacao('excursao', id, 'Apagar Excursão', 'Deseja apagar esta viagem definitivamente?')" />
            <ModaisModalGerenciarEx v-if="modalGerenciarEx" :excursao="exSelecionada" @close="modalGerenciarEx = false"
                @atualizado="carregar" @alterarPagamento="abrirAlterarPagamento"
                @editarParametros="abrirEditarExcursao" />
            <ModaisModalVincular v-if="modalVincular" :userParaVincular="userSelecionado" :excursoes="excursoes"
                @close="modalVincular = false" @atualizado="carregar" />
            <ModaisModalPagamento v-if="modalPagamento" :usuarioPagamento="userSelecionado"
                :excursaoSelecionada="exSelecionada" @close="modalPagamento = false" @atualizado="carregar" />

            <UiModalConfirm v-if="modalConfirm" :title="confirmTitle" :text="confirmText" @confirm="executarConfirmacao"
                @cancel="modalConfirm = false" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PassageirosTabela from '~/components/passageiros/Tabela.vue'
import UiModalConfirm from '~/components/ui/ModalConfirm.vue' // Criação sugerida no passo 1 caso queira isolar esse tb!
import { exportarSeedUsuarios } from '~/utils/exportacoes'

const { showToast } = useToasts()
const logado = ref(false)

const aoLogar = () => { logado.value = true; carregar(); }
const fazerLogout = () => { logado.value = false; if (import.meta.client) localStorage.removeItem('graziTurAdmin'); usuarios.value = []; excursoes.value = [] }

// Estados Modais e Seleções
const modalUser = ref(false); const modalCriarExcursao = ref(false); const modalGerenciarEx = ref(false); const modalVincular = ref(false); const modalPagamento = ref(false); const modalConfirm = ref(false);
const userSelecionado = ref(null); const exSelecionada = ref(null);
const confirmType = ref(''); const confirmId = ref(null); const confirmTitle = ref(''); const confirmText = ref('');

onMounted(() => { if (import.meta.client && localStorage.getItem('graziTurAdmin') === 'true') { logado.value = true; carregar() } })

const usuarios = ref([])
const excursoes = ref([])
const buscaUser = ref('')

const abrirNovoUser = () => { userSelecionado.value = null; modalUser.value = true; }
const abrirEdicaoUser = (u) => { userSelecionado.value = u; modalUser.value = true; }
const abrirVincular = (u) => { userSelecionado.value = u; modalVincular.value = true; }
const abrirNovaExcursao = () => { exSelecionada.value = null; modalCriarExcursao.value = true; }
const abrirGerenciarExcursao = (ex) => { exSelecionada.value = excursoes.value.find(e => e.id === ex.id); modalGerenciarEx.value = true; }
const abrirEditarExcursao = (ex) => { exSelecionada.value = ex; modalGerenciarEx.value = false; modalCriarExcursao.value = true; }
const abrirAlterarPagamento = (user, ex) => { userSelecionado.value = user; exSelecionada.value = ex; modalPagamento.value = true; }

const pedirConfirmacao = (tipo, id, titulo, texto) => { confirmType.value = tipo; confirmId.value = id; confirmTitle.value = titulo; confirmText.value = texto; modalConfirm.value = true }
const executarConfirmacao = async () => {
    modalConfirm.value = false;
    try {
        if (confirmType.value === 'excursao') { await $fetch(`/api/excursoes/${confirmId.value}`, { method: 'DELETE' }); modalCriarExcursao.value = false; }
        else if (confirmType.value === 'user') { await $fetch(`/api/users/${confirmId.value}`, { method: 'DELETE' }); }
        showToast('Apagado com Sucesso!', 'success'); await carregar();
    } catch (e) { showToast('Erro ao apagar!', 'danger') }
}

const acaoGerarSeed = () => {
    exportarSeedUsuarios(usuarios.value, showToast);
}

const carregar = async () => {
    const timestamp = new Date().getTime()
    usuarios.value = await $fetch(`/api/users?t=${timestamp}`)
    const resExcursoes = await $fetch(`/api/excursoes?includeUsers=true&t=${timestamp}`)
    // ... dentro de carregar()
    excursoes.value = resExcursoes.map(ex => {
        let val = []; let pags = {}; let det = {}; let grp = {}; let assinaturasObj = {};
        if (ex.valores) { try { val = typeof ex.valores === 'string' ? JSON.parse(ex.valores) : ex.valores } catch (e) { } }
        if (ex.pagamentosJson) { try { pags = JSON.parse(ex.pagamentosJson) } catch (e) { } }
        if (ex.contratoDetalhes) { try { det = JSON.parse(ex.contratoDetalhes) } catch (e) { } }
        if (ex.contratoGrupos) { try { grp = JSON.parse(ex.contratoGrupos) } catch (e) { } }
        if (ex.assinaturasJson) { try { assinaturasObj = JSON.parse(ex.assinaturasJson) } catch (e) { } }

        return { ...ex, valores: Array.isArray(val) ? val : [], pagamentos: pags, detalhes: det, grupos: grp, assinaturas: assinaturasObj }
    })
    // ...
    if (exSelecionada.value) { const atualizada = excursoes.value.find(e => e.id === exSelecionada.value.id); if (atualizada) exSelecionada.value = atualizada }
}

const usuariosFiltrados = computed(() => { if (!buscaUser.value) return usuarios.value; return usuarios.value.filter(u => u.nome.toLowerCase().includes(buscaUser.value.toLowerCase()) || (u.cpf && u.cpf.includes(buscaUser.value))) })
const guiasDisponiveis = computed(() => usuarios.value.filter(u => u.isGuia))
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
    font-family: 'Inter', sans-serif;
    color: #334155;
}

.main-container {
    max-width: 1080px;
    margin: 0 auto;
}

.text-brand {
    color: #2563eb !important;
}

.bg-brand {
    background-color: #2563eb !important;
    color: white;
}

.bg-surface {
    background-color: #f8fafc !important;
}
</style>