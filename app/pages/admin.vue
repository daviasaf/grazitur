<template>
    <div>
        <div v-if="!logado" class="min-vh-100 bg-dark d-flex align-items-center justify-content-center">
            <div class="card border-0 shadow p-5 text-center" style="max-width: 400px; width: 100%;">
                <h3 class="fw-bold text-primary mb-4">Área Restrita</h3>
                <input v-model="senha" type="password" class="form-control mb-3 text-center"
                    placeholder="Senha do Administrador" @keyup.enter="fazerLogin">
                <button class="btn btn-primary w-100 fw-bold" @click="fazerLogin">Entrar no Painel</button>
                <p v-if="erroLogin" class="text-danger small fw-bold mt-3 mb-0">{{ erroLogin }}</p>
            </div>
        </div>

        <div v-else class="container-fluid py-5 bg-light min-vh-100">
            <div class="container">

                <div class="d-flex justify-content-between align-items-center mb-5">
                    <h1 class="fw-bold text-primary">Painel de Excursões</h1>
                    <div>
                        <button class="btn btn-outline-danger shadow-sm px-4 py-2 me-2 fw-bold"
                            @click="fazerLogout">Sair do Painel</button>
                        <button class="btn btn-success shadow-sm px-4 py-2 fw-bold" @click="abrirModalExcursao()">+ Nova
                            Excursão</button>
                    </div>
                </div>

                <div class="mb-5">
                    <h4 class="text-secondary border-bottom pb-2 mb-4">Excursões Ativas</h4>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div v-for="ex in excursoes" :key="ex.id" class="col text-start">
                            <div class="card h-100 shadow-sm border-0 btn-card" @click="abrirGerenciarExcursao(ex)"
                                role="button">
                                <div class="card-body">
                                    <h5 class="card-title text-primary fw-bold">{{ ex.nome }}</h5>
                                    <p class="card-text text-muted mb-2">{{ ex.lugar }}</p>
                                    <p class="card-text text-success fw-bold mb-3">R$ {{ ex.preco }}</p>

                                    <div class="small text-muted mb-2 p-2 bg-light rounded border border-light">
                                        <div class="d-flex align-items-center">
                                            <strong>Guia Responsável:</strong>
                                            <span :class="ex.guia ? 'text-dark ms-2' : 'text-danger fw-bold ms-2'">
                                                {{ ex.guia?.nome || 'Pendente (Obrigatório)' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="progress mt-4" style="height: 8px;">
                                        <div class="progress-bar"
                                            :class="ex._count.usuarios >= ex.vagas ? 'bg-danger' : 'bg-primary'"
                                            :style="{ width: (ex._count.usuarios / ex.vagas * 100) + '%' }"></div>
                                    </div>
                                    <small class="text-muted mt-2 d-block text-end">
                                        {{ ex._count.usuarios }} / {{ ex.vagas }} Vagas ocupadas
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div v-if="excursoes.length === 0" class="col-12 text-muted">
                            Nenhuma excursão criada ainda.
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
                        <h4 class="text-secondary mb-0">Passageiros & Equipe</h4>
                        <button class="btn btn-sm btn-primary" @click="prepararNovoUser">
                            + Novo Cadastro
                        </button>
                    </div>

                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3">
                            <input v-model="buscaUser" type="text" class="form-control"
                                placeholder="Buscar por nome ou CPF...">
                        </div>
                        <div class="card-body p-0">
                            <ul class="list-group list-group-flush">
                                <li v-for="u in usuariosFiltrados" :key="u.id"
                                    class="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div @click="abrirVincular(u)" role="button" class="flex-grow-1">
                                        <div class="fw-bold text-dark">
                                            {{ u.nome }}
                                            <span v-if="u.isGuia" class="badge bg-warning text-dark ms-2"
                                                style="font-size: 0.7em;">GUIA</span>
                                        </div>
                                        <small class="text-muted">CPF: {{ u.cpf || 'Não informado' }} | RG: {{ u.rg ||
                                            '-' }}</small>
                                    </div>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-primary"
                                            @click="prepararEdicaoUser(u)">Editar</button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            @click="deletarUser(u.id)">Apagar</button>
                                    </div>
                                </li>
                                <li v-if="usuariosFiltrados.length === 0"
                                    class="list-group-item text-center text-muted py-4">
                                    Nenhum passageiro encontrado.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>

            <div v-if="modalCriarExcursao" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title text-primary fw-bold">{{ formEx.id ? 'Editar' : 'Nova' }} Excursão
                            </h5>
                            <button class="btn-close" @click="fecharExcursao"></button>
                        </div>
                        <div class="modal-body p-4">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label small text-muted fw-bold">Título da Excursão</label>
                                    <input v-model="formEx.nome" class="form-control" placeholder="Ex: Beto Carrero">
                                </div>
                                <div class="col-12">
                                    <label class="form-label small text-muted fw-bold">Destino</label>
                                    <input v-model="formEx.lugar" class="form-control" placeholder="Lugar">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small text-muted fw-bold">Preço (R$)</label>
                                    <input v-model="formEx.preco" type="number" class="form-control"
                                        placeholder="Ex: 150">
                                </div>
                                <div class="col-6">
                                    <label class="form-label small text-muted fw-bold">Total Vagas</label>
                                    <input v-model="formEx.vagas" type="number" class="form-control"
                                        placeholder="Ex: 40">
                                </div>

                                <div class="col-12 mt-4">
                                    <label class="form-label small text-primary fw-bold mb-1">Selecione o Guia
                                        Responsável</label>
                                    <select v-model="formEx.guiaId" class="form-select border-primary">
                                        <option :value="null">-- Não escolhido ainda --</option>
                                        <option v-for="g in guiasDisponiveis" :key="g.id" :value="g.id">{{ g.nome }}
                                        </option>
                                    </select>
                                    <small class="text-muted" v-if="guiasDisponiveis.length === 0">Nenhum usuário
                                        marcado como "Guia" no sistema.</small>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light">
                            <button v-if="formEx.id" class="btn btn-outline-danger me-auto"
                                @click="deletarExcursao(formEx.id)">Apagar Excursão</button>
                            <button class="btn btn-primary px-4" @click="salvarExcursao">Salvar Excursão</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalGerenciarEx" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title fw-bold">{{ exSelecionada.nome }}</h5>
                            <button class="btn-close btn-close-white" @click="modalGerenciarEx = false"></button>
                        </div>
                        <div class="modal-body p-4">

                            <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                                <h6 class="mb-0 text-secondary fw-bold">
                                    Passageiros Confirmados ({{ exSelecionada.usuarios.length }}/{{ exSelecionada.vagas
                                    }})
                                </h6>

                                <div class="text-end">
                                    <button class="btn btn-success btn-sm px-3" @click="baixarListaPDF(exSelecionada)"
                                        :disabled="exSelecionada.usuarios.length === 0 || !exSelecionada.guiaId">
                                        Baixar Lista em PDF
                                    </button>
                                    <div v-if="!exSelecionada.guiaId" class="text-danger small fw-bold mt-1">
                                        *Vincule um Guia para liberar o PDF
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Nome</th>
                                            <th>CPF</th>
                                            <th>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in exSelecionada.usuarios" :key="p.id">
                                            <td class="fw-bold">{{ p.nome }}</td>
                                            <td>{{ p.cpf || '-' }}</td>
                                            <td><button class="btn btn-sm btn-outline-danger"
                                                    @click="removerUserDaEx(p.id, exSelecionada.id)">Remover</button>
                                            </td>
                                        </tr>
                                        <tr v-if="exSelecionada.usuarios.length === 0">
                                            <td colspan="3" class="text-center text-muted py-4">Nenhum passageiro nesta
                                                excursão ainda.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer bg-light">
                            <button class="btn btn-outline-primary" @click="prepararEdicaoEx(exSelecionada)">Editar
                                Dados da Excursão</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalVincular" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog">
                    <div class="modal-content shadow">
                        <div class="modal-header bg-light">
                            <h5 class="modal-title fw-bold">Adicionar <span class="text-primary">{{
                                    userParaVincular.nome }}</span></h5>
                            <button class="btn-close" @click="modalVincular = false"></button>
                        </div>
                        <div class="modal-body p-4">

                            <div v-if="!excursaoVinculada">
                                <p class="text-muted">Selecione o destino do passageiro:</p>
                                <div class="list-group">
                                    <button v-for="e in excursoes" :key="e.id"
                                        @click="vincularMainUser(userParaVincular.id, e)"
                                        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                                        :disabled="e._count.usuarios >= e.vagas">
                                        <div>
                                            <strong class="text-dark">{{ e.nome }}</strong>
                                            <div class="text-muted small">{{ e.lugar }}</div>
                                        </div>
                                        <span class="badge"
                                            :class="e._count.usuarios >= e.vagas ? 'bg-danger' : 'bg-success'">
                                            {{ e._count.usuarios }}/{{ e.vagas }} vagas
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div v-else>
                                <div class="alert alert-success d-flex align-items-center py-3 mb-4 fw-bold">
                                    ✔ {{ userParaVincular.nome }} foi adicionado(a)!
                                </div>

                                <div v-if="parentesDoUsuarioSelecionado.length > 0">
                                    <h6 class="fw-bold mb-3 text-secondary">Adicionar parentes atrelados?</h6>
                                    <div class="list-group">
                                        <div v-for="parente in parentesDoUsuarioSelecionado" :key="parente.id"
                                            class="list-group-item d-flex justify-content-between align-items-center py-2"
                                            :class="{ 'bg-light': parentesAdicionadosNaSessao.includes(parente.id) }">
                                            <div>
                                                <span class="fw-bold text-dark d-block"
                                                    :class="{ 'text-success': parentesAdicionadosNaSessao.includes(parente.id) }">
                                                    {{ parente.nome }}
                                                </span>
                                                <small class="text-muted">CPF: {{ parente.cpf || '-' }}</small>
                                            </div>
                                            <button class="btn btn-sm fw-bold"
                                                :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'btn-success' : 'btn-outline-primary'"
                                                :disabled="parentesAdicionadosNaSessao.includes(parente.id)"
                                                @click="vincularParente(parente, excursaoVinculada.id)">
                                                {{ parentesAdicionadosNaSessao.includes(parente.id) ? '✔ Adicionado' :
                                                '+ Adicionar' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-muted py-3">
                                    Este passageiro não possui parentes cadastrados no sistema.
                                </div>
                            </div>

                        </div>
                        <div class="modal-footer bg-light" v-if="excursaoVinculada">
                            <button class="btn btn-primary px-4" @click="fecharModalVincular">Concluir</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalUser" class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content border-0 shadow-lg">

                        <div class="modal-header bg-primary text-white py-3">
                            <h5 class="modal-title fw-bold">{{ formUser.id ? 'Editar Cadastro de Passageiro' : 'Novo Cadastro de Passageiro' }}</h5>
                            <button class="btn-close btn-close-white" @click="modalUser = false"></button>
                        </div>

                        <div class="modal-body p-4 p-md-5 bg-light">
                            <div class="row g-4">

                                <div class="col-lg-6 pe-lg-4 border-end-lg">
                                    <h6 class="text-primary fw-bold border-bottom border-2 border-primary pb-2 mb-4">
                                        Dados Pessoais</h6>

                                    <div class="mb-3">
                                        <label class="form-label small text-muted fw-bold">Nome Completo *</label>
                                        <input v-model="formUser.nome" type="text"
                                            class="form-control form-control-lg fs-6 shadow-sm border-0"
                                            placeholder="Digite o nome completo">
                                    </div>

                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-6">
                                            <label class="form-label small text-muted fw-bold">CPF</label>
                                            <input v-model="formUser.cpf" type="text"
                                                class="form-control shadow-sm border-0" placeholder="000.000.000-00">
                                        </div>
                                        <div class="col-sm-6">
                                            <label class="form-label small text-muted fw-bold">Data de
                                                Nascimento</label>
                                            <input v-model="formUser.nascimento" type="date"
                                                class="form-control shadow-sm border-0">
                                        </div>
                                    </div>

                                    <div class="row g-3">
                                        <div class="col-sm-6">
                                            <label class="form-label small text-muted fw-bold">RG (Opcional)</label>
                                            <input v-model="formUser.rg" type="text"
                                                class="form-control shadow-sm border-0" placeholder="Apenas números">
                                        </div>
                                        <div class="col-sm-6">
                                            <label class="form-label small text-muted fw-bold">Órgão Expeditor</label>
                                            <input v-model="formUser.orgaoExpeditor" type="text"
                                                class="form-control shadow-sm border-0" placeholder="Ex: Detran">
                                        </div>
                                    </div>
                                </div>

                                <div class="col-lg-6 ps-lg-4">
                                    <h6 class="text-primary fw-bold border-bottom border-2 border-primary pb-2 mb-4">
                                        Contato e Localização</h6>

                                    <div class="mb-3">
                                        <label class="form-label small text-muted fw-bold">Celular / WhatsApp</label>
                                        <input v-model="formUser.celular" type="text"
                                            class="form-control shadow-sm border-0" placeholder="(00) 00000-0000">
                                    </div>

                                    <div class="row g-3 mb-3">
                                        <div class="col-sm-8">
                                            <label class="form-label small text-muted fw-bold">Endereço Completo</label>
                                            <input v-model="formUser.endereco" type="text"
                                                class="form-control shadow-sm border-0"
                                                placeholder="Rua, Número, Bairro">
                                        </div>
                                        <div class="col-sm-4">
                                            <label class="form-label small text-muted fw-bold">Cidade</label>
                                            <input v-model="formUser.cidade" type="text"
                                                class="form-control shadow-sm border-0" placeholder="Cidade">
                                        </div>
                                    </div>

                                    <div class="mt-4 p-4 bg-white rounded-3 shadow-sm border border-warning">
                                        <div class="form-check form-switch d-flex align-items-center m-0 p-0">
                                            <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                type="checkbox" v-model="formUser.isGuia" id="guiaSwitch">
                                            <label class="form-check-label fw-bold text-dark mb-0 cursor-pointer"
                                                for="guiaSwitch">
                                                Habilitar como GUIA de Excursão
                                            </label>
                                        </div>
                                        <p class="text-muted small mt-2 mb-0 ms-5">Marcando esta opção, este usuário
                                            aparecerá na lista de Guias disponíveis para gerenciar viagens.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-5 pt-4 border-top">
                                <div class="col-12">
                                    <h6 class="text-secondary fw-bold mb-3">Vincular Familiares / Parentes</h6>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label small text-muted">Pesquisar na base de passageiros:</label>
                                    <input v-model="buscaParenteModal" type="text"
                                        class="form-control shadow-sm border-0 mb-2" placeholder="Buscar por nome...">
                                    <div class="list-group shadow-sm" style="max-height: 150px; overflow-y: auto;">

                                        <div v-for="u in usuariosParaParenteFiltrados" :key="u.id"
                                            class="list-group-item py-2 px-3 small d-flex justify-content-between align-items-center border-0 border-bottom"
                                            :class="{ 'bg-light': u.jaAdicionado }">
                                            <span class="fw-bold text-dark"
                                                :class="{ 'text-success': u.jaAdicionado }">{{ u.nome }}</span>
                                            <button class="btn btn-sm fw-bold"
                                                :class="u.jaAdicionado ? 'btn-success' : 'btn-outline-primary'"
                                                :disabled="u.jaAdicionado" @click="adicionarParenteNoForm(u)">
                                                {{ u.jaAdicionado ? '✔ Adicionado' : '+ Adicionar' }}
                                            </button>
                                        </div>

                                        <div v-if="usuariosParaParenteFiltrados.length === 0 && buscaParenteModal"
                                            class="text-muted small p-3 bg-white text-center">Nenhum resultado
                                            encontrado.</div>
                                    </div>
                                </div>

                                <div class="col-md-6 mt-3 mt-md-0">
                                    <label class="form-label small text-muted">Parentes Selecionados:</label>
                                    <ul class="list-group shadow-sm">
                                        <li v-for="(p, index) in formUser.parentesSelecionados" :key="index"
                                            class="list-group-item d-flex justify-content-between align-items-center py-2 px-3 small border-0 border-bottom">
                                            <span class="fw-bold">{{ p.nome }}</span>
                                            <button class="btn btn-sm text-danger fw-bold border-0 p-0"
                                                @click="removerParenteDoForm(index)">Remover</button>
                                        </li>
                                        <li v-if="formUser.parentesSelecionados.length === 0"
                                            class="list-group-item text-muted small py-3 text-center border-0">Nenhum
                                            parente vinculado a este cadastro.</li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div class="modal-footer bg-white border-top py-3 px-4">
                            <button class="btn btn-light border fw-bold text-secondary me-auto px-4"
                                @click="modalUser = false">Cancelar</button>
                            <button class="btn btn-primary fw-bold px-5 shadow-sm" @click="salvarUser">Salvar
                                Cadastro</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const logado = ref(false)
const senha = ref('')
const erroLogin = ref('')

// NOVA FUNÇÃO: Checa se já está logado ao carregar a página
onMounted(() => {
    if (import.meta.client && localStorage.getItem('graziTurAdmin') === 'true') {
        logado.value = true
        carregar()
    }
})

const fazerLogin = async () => {
    erroLogin.value = ''
    try {
        await $fetch('/api/auth', { method: 'POST', body: { password: senha.value } })
        logado.value = true
        // NOVA FUNÇÃO: Salva a memória do login
        if (import.meta.client) localStorage.setItem('graziTurAdmin', 'true')
        carregar()
    } catch (e) {
        erroLogin.value = e.data?.message || 'Senha incorreta ou erro no servidor.'
    }
}

// NOVA FUNÇÃO: Para deslogar e apagar a memória
const fazerLogout = () => {
    logado.value = false
    senha.value = ''
    if (import.meta.client) localStorage.removeItem('graziTurAdmin')
    usuarios.value = []
    excursoes.value = []
}

const usuarios = ref([])
const excursoes = ref([])
const buscaUser = ref('')

const modalCriarExcursao = ref(false)
const modalGerenciarEx = ref(false)
const modalVincular = ref(false)
const modalUser = ref(false)

const formEx = ref({ id: null, nome: '', lugar: '', preco: '', vagas: '', guiaId: null })
const exSelecionada = ref(null)

const userParaVincular = ref(null)
const excursaoVinculada = ref(null)
const parentesAdicionadosNaSessao = ref([])

const formUser = ref({
    id: null, nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: []
})
const buscaParenteModal = ref('')

// NOVA FUNÇÃO: Adicionado a hora "?t=" na URL para FORÇAR o Render a dar os dados novos (Quebrador de Cache)
const carregar = async () => {
    const timestamp = new Date().getTime()
    usuarios.value = await $fetch(`/api/users?t=${timestamp}`)
    excursoes.value = await $fetch(`/api/excursoes?includeUsers=true&t=${timestamp}`)
}

const usuariosFiltrados = computed(() => {
    if (!buscaUser.value) return usuarios.value
    return usuarios.value.filter(u =>
        u.nome.toLowerCase().includes(buscaUser.value.toLowerCase()) ||
        (u.cpf && u.cpf.includes(buscaUser.value))
    )
})

const guiasDisponiveis = computed(() => {
    return usuarios.value.filter(u => u.isGuia)
})

const abrirModalExcursao = () => {
    formEx.value = { id: null, nome: '', lugar: '', preco: '', vagas: '', guiaId: null }
    modalCriarExcursao.value = true
}

const salvarExcursao = async () => {
    const method = formEx.value.id ? 'PUT' : 'POST'
    const url = formEx.value.id ? `/api/excursoes/${formEx.value.id}` : '/api/excursoes'
    await $fetch(url, { method, body: formEx.value })
    fecharExcursao()
    carregar()
}

const deletarExcursao = async (id) => {
    if (confirm("Apagar esta excursão permanentemente?")) {
        await $fetch(`/api/excursoes/${id}`, { method: 'DELETE' })
        fecharExcursao()
        carregar()
    }
}

const abrirGerenciarExcursao = (ex) => {
    exSelecionada.value = excursoes.value.find(e => e.id === ex.id)
    modalGerenciarEx.value = true
}

const fecharExcursao = () => {
    modalCriarExcursao.value = false
    modalGerenciarEx.value = false
}

const prepararEdicaoEx = (ex) => {
    formEx.value = { ...ex }
    modalGerenciarEx.value = false
    modalCriarExcursao.value = true
}

const prepararNovoUser = () => {
    formUser.value = { id: null, nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] }
    buscaParenteModal.value = ''
    modalUser.value = true
}

const prepararEdicaoUser = (u) => {
    const listaParentes = [...(u.parentes || []), ...(u.parentesDe || [])]
    formUser.value = {
        id: u.id, nome: u.nome, cpf: u.cpf, rg: u.rg, orgaoExpeditor: u.orgaoExpeditor, nascimento: u.nascimento, celular: u.celular, idade: u.idade, cidade: u.cidade, endereco: u.endereco, isGuia: u.isGuia,
        parentesSelecionados: listaParentes
    }
    buscaParenteModal.value = ''
    modalUser.value = true
}

const salvarUser = async () => {
    if (!formUser.value.nome) return alert("O Nome é obrigatório!")

    let dataFormatada = formUser.value.nascimento;
    if (dataFormatada && dataFormatada.includes('-')) {
        const partes = dataFormatada.split('-');
        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    const payload = {
        ...formUser.value,
        nascimento: dataFormatada,
        parentesIds: formUser.value.parentesSelecionados.map(p => p.id)
    }

    const method = formUser.value.id ? 'PUT' : 'POST'
    const url = formUser.value.id ? `/api/users/${formUser.value.id}` : '/api/users'

    try {
        await $fetch(url, { method, body: payload })
        modalUser.value = false
        carregar()
    } catch (e) { alert('Erro ao salvar: ' + (e.data?.message || e)) }
}

const deletarUser = async (id) => {
    if (confirm("Remover do sistema?")) {
        await $fetch(`/api/users/${id}`, { method: 'DELETE' })
        carregar()
    }
}

const usuariosParaParenteFiltrados = computed(() => {
    if (!buscaParenteModal.value) return []
    return usuarios.value.filter(u =>
        u.id !== formUser.value.id &&
        u.nome.toLowerCase().includes(buscaParenteModal.value.toLowerCase())
    ).map(u => ({
        ...u,
        jaAdicionado: formUser.value.parentesSelecionados.some(p => p.id === u.id)
    })).slice(0, 5)
})

const adicionarParenteNoForm = (user) => {
    if (!formUser.value.parentesSelecionados.some(p => p.id === user.id)) {
        formUser.value.parentesSelecionados = [...formUser.value.parentesSelecionados, user];
    }
}

const removerParenteDoForm = (index) => {
    formUser.value.parentesSelecionados.splice(index, 1)
}

const parentesDoUsuarioSelecionado = computed(() => {
    if (!userParaVincular.value) return []
    const lista = [...(userParaVincular.value.parentes || []), ...(userParaVincular.value.parentesDe || [])]
    return lista.map(p => ({ ...p, adicionado: false }))
})

const abrirVincular = (u) => {
    userParaVincular.value = u
    excursaoVinculada.value = null
    parentesAdicionadosNaSessao.value = []
    modalVincular.value = true
}

const fecharModalVincular = () => {
    modalVincular.value = false
    excursaoVinculada.value = null
    carregar()
}

const vincularMainUser = async (userId, excursao) => {
    try {
        await $fetch('/api/vincular', { method: 'POST', body: { userId, excursaoId: excursao.id } })
        excursaoVinculada.value = excursao
    } catch (e) { alert(e.data?.message || 'Erro ao adicionar.') }
}

const vincularParente = async (parente, excursaoId) => {
    if (parentesAdicionadosNaSessao.value.includes(parente.id)) return
    try {
        await $fetch('/api/vincular', { method: 'POST', body: { userId: parente.id, excursaoId } })
        parentesAdicionadosNaSessao.value.push(parente.id)
    } catch (e) { alert(`Erro: ${e.data?.message || 'Já Lotado.'}`) }
}

const removerUserDaEx = async (userId, excursaoId) => {
    await $fetch('/api/desvincular', { method: 'POST', body: { userId, excursaoId } })
    await carregar()
    exSelecionada.value = excursoes.value.find(e => e.id === excursaoId)
}

const baixarListaPDF = async (excursao) => {
    if (!import.meta.client) return;

    try {
        const { jsPDF } = await import('jspdf')
        const autoTableModule = await import('jspdf-autotable')
        const autoTable = autoTableModule.default || autoTableModule
        const doc = new jsPDF()

        doc.setFontSize(22)
        doc.setTextColor(13, 110, 253)
        doc.text(`Lista de Passageiros`, 14, 22)

        doc.setFontSize(14)
        doc.setTextColor(50, 50, 50)
        doc.text(`Excursão: ${excursao.nome}`, 14, 32)

        doc.setFontSize(11)
        doc.setTextColor(100, 100, 100)
        doc.text(`Destino: ${excursao.lugar}`, 14, 40)

        let listaCompleta = [...excursao.usuarios]

        if (excursao.guia) {
            const guiaJaNaLista = listaCompleta.some(u => u.id === excursao.guia.id)
            if (!guiaJaNaLista) {
                const guiaFormatado = { ...excursao.guia, nome: `${excursao.guia.nome} (GUIA)` }
                listaCompleta.push(guiaFormatado)
            } else {
                const indexGuia = listaCompleta.findIndex(u => u.id === excursao.guia.id)
                listaCompleta[indexGuia].nome = `${listaCompleta[indexGuia].nome} (GUIA)`
            }
        }

        listaCompleta.sort((a, b) => a.nome.localeCompare(b.nome))

        const dadosTabela = listaCompleta.map((user, index) => [
            index + 1,
            user.nome,
            user.cpf || '-',
            user.orgaoExpeditor || '-'
        ])

        autoTable(doc, {
            startY: 50,
            head: [['Nº', 'Nome Completo', 'CPF', 'Órgão Expeditor']],
            body: dadosTabela,
            headStyles: { fillColor: [13, 110, 253], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 248, 250] },
            styles: { fontSize: 10, cellPadding: 4 },
        })

        const nomeArquivo = `Lista_${excursao.nome.replace(/\s+/g, '_')}.pdf`
        doc.save(nomeArquivo)

    } catch (error) {
        console.error("Erro ao gerar o PDF:", error)
        alert("Ocorreu um erro na biblioteca de PDF.")
    }
}
</script>

<style scoped>
.btn-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border-radius: 12px;
}

.btn-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
    border: 1px solid #0d6efd;
}

.progress {
    border-radius: 10px;
    background-color: #e9ecef;
}

.list-group-flush {
    max-height: 400px;
    overflow-y: auto;
}

.cursor-pointer {
    cursor: pointer;
}

.border-end-lg {
    border-right: 1px solid #dee2e6;
}

@media (max-width: 991px) {
    .border-end-lg {
        border-right: none;
    }
}
</style>