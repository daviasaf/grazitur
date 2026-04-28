<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); overflow-y: auto; z-index: 1050;">
        <div class="modal-dialog modal-xl modal-dialog-scrollable px-2">
            <div class="modal-content border-0 shadow-lg rounded-5 bg-light transition">
                <div
                    class="modal-header bg-white p-4 border-bottom rounded-top-5 d-flex justify-content-between align-items-center">
                    <h5 class="modal-title fw-bold fs-5 text-dark d-flex align-items-center gap-2 m-0">
                        {{ formUser.id ? 'Editar Cadastro' : 'Novo Cadastro' }}
                    </h5>
                    <button class="btn-close m-0" @click="$emit('close')"></button>
                </div>
                <div class="modal-body p-4 p-md-5">
                    <div class="row g-4">
                        <div class="col-lg-6">
                            <div class="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
                                <h6 class="text-brand fw-bold border-bottom pb-3 mb-4" style="color: #2563eb;">Dados
                                    Pessoais</h6>
                                <div class="mb-3">
                                    <label class="form-label small fw-semibold text-muted">Nome Completo *</label>
                                    <input v-model="formUser.nome" type="text"
                                        class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label small fw-semibold text-muted">E-mail *</label>
                                    <input v-model="formUser.email" type="email"
                                        class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                </div>
                                <div class="row g-3">
                                    <div class="col-12 col-md-6">
                                        <label class="form-label small fw-semibold text-muted">CPF *</label>
                                        <input v-model="formUser.cpf" type="text"
                                            class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                            placeholder="Apenas números">
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <label
                                            class="form-label small fw-semibold text-muted d-flex justify-content-between">Nascimento
                                            *</label>
                                        <input :value="formUser.nascimento"
                                            @input="e => formUser.nascimento = mascaraData(e.target.value)" type="text"
                                            maxlength="10"
                                            class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                            placeholder="DD/MM/AAAA">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small fw-semibold text-muted">Órgão Expeditor *</label>
                                        <select v-model="selecaoOrgao" @change="handleOrgaoChange"
                                            class="form-select bg-light border-0 rounded-3 py-2 fw-semibold">
                                            <option value="" disabled>Selecione...</option>
                                            <option v-for="op in opcoesOrgao" :key="op" :value="op">{{ op }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div
                                class="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100 d-flex flex-column">
                                <h6 class="text-brand fw-bold border-bottom pb-3 mb-4" style="color: #2563eb;">Contato e
                                    Localização</h6>
                                <div class="mb-3">
                                    <label class="form-label small fw-semibold text-muted">Celular *</label>
                                    <input v-model="formUser.celular" type="text"
                                        class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                </div>

                                <div class="row g-3 mb-3">
                                    <div class="col-12 col-sm-4">
                                        <label class="form-label small fw-semibold text-muted">Estado *</label>
                                        <select v-model="estadoSelecionado" @change="buscarCidades"
                                            class="form-select bg-light border-0 rounded-3 py-2 fw-semibold"
                                            :disabled="carregandoEstados">
                                            <option value="" disabled>{{ carregandoEstados ? '...' : 'UF' }}</option>
                                            <option v-for="uf in estados" :key="uf.sigla" :value="uf.sigla">{{ uf.sigla
                                                }}</option>
                                        </select>
                                    </div>
                                    <div class="col-12 col-sm-8">
                                        <label class="form-label small fw-semibold text-muted">Cidade *</label>
                                        <select v-model="cidadeSelecionada"
                                            class="form-select bg-light border-0 rounded-3 py-2 fw-semibold"
                                            :disabled="!estadoSelecionado || carregandoCidades">
                                            <option value="" disabled>{{ carregandoCidades ? 'Carregando...' :
                                                'Selecione a cidade' }}</option>
                                            <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">{{
                                                cidade.nome }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label small fw-semibold text-muted">Endereço Completo *</label>
                                    <input v-model="formUser.endereco" type="text"
                                        class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                        placeholder="Rua, Número, Bairro">
                                </div>

                                <div class="mt-auto p-3 bg-warning bg-opacity-10 rounded-4 border border-warning mb-3">
                                    <div class="form-check form-switch m-0 d-flex align-items-center">
                                        <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                            type="checkbox" v-model="formUser.isGuia" id="guiaSwitch">
                                        <label class="form-check-label fw-bold text-dark mb-0 cursor-pointer lh-sm"
                                            for="guiaSwitch">Habilitar como GUIA</label>
                                    </div>
                                </div>
                                <div class="p-3 bg-danger bg-opacity-10 rounded-4 border border-danger">
                                    <div class="form-check form-switch m-0 d-flex align-items-center">
                                        <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                            type="checkbox" v-model="ignorarRegras" id="ignorarSwitch">
                                        <label class="form-check-label fw-bold text-danger mb-0 cursor-pointer lh-sm"
                                            for="ignorarSwitch">IGNORAR REGRAS</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="modal-footer bg-white p-4 border-top border-light d-flex flex-column flex-sm-row gap-2 rounded-bottom-5">
                    <button
                        class="btn btn-light-cancel text-secondary fw-bold transition w-100 w-sm-auto me-sm-auto py-3 rounded-pill px-4"
                        style="background-color: white; color: #6C757D; border: 1px solid #CED4DA;"
                        @click="$emit('close')">Cancelar</button>
                    <button
                        class="btn btn-save transition fw-bold w-100 w-sm-auto py-3 shadow-soft rounded-pill px-5 d-flex align-items-center justify-content-center gap-2"
                        style="background-color: #2563eb; color: white; border: none;" @click="salvarUser"
                        :disabled="carregando">
                        {{ carregando ? 'Processando...' : 'Salvar Cadastro' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="modalOutroOrgao" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1060;">
            <div class="modal-dialog modal-dialog-centered px-3">
                <div class="modal-content rounded-4 border-0 shadow-lg">
                    <div class="modal-body p-4 p-md-5">
                        <h5 class="fw-bold mb-3 text-dark text-center">Informe o Órgão Expeditor</h5>
                        <input v-model="outroOrgaoTexto" type="text"
                            class="form-control form-control-lg fs-6 bg-light border-0 rounded-3 mb-4 text-center"
                            placeholder="Ex: SJS, Cartório Civil..." @keyup.enter="confirmarOutroOrgao">
                        <div class="d-flex gap-2">
                            <button class="btn btn-light fw-bold flex-fill py-3 rounded-3 border"
                                @click="cancelarOutroOrgao">Cancelar</button>
                            <button class="btn btn-primary fw-bold flex-fill py-3 rounded-3 shadow-sm"
                                @click="confirmarOutroOrgao">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    usuarioEditando: { type: Object, default: () => null }
})
const emit = defineEmits(['close', 'salvo'])
const { showToast } = useToasts()

const ignorarRegras = ref(false)
const carregando = ref(false)
const formUser = ref({ id: null, nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] })

// Órgão Expeditor
const opcoesOrgao = ref(['DETRAN', 'DIC', 'IFP', 'SSP', 'Outros'])
const selecaoOrgao = ref('')
const modalOutroOrgao = ref(false)
const outroOrgaoTexto = ref('')

// Estados e Cidades
const estados = ref([])
const cidades = ref([])
const estadoSelecionado = ref('')
const cidadeSelecionada = ref('')
const carregandoEstados = ref(false)
const carregandoCidades = ref(false)

onMounted(async () => {
    // 1. Carregar Estados do IBGE
    carregandoEstados.value = true
    try {
        const res = await $fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        estados.value = res.map(e => ({ sigla: e.sigla, nome: e.nome }))
    } catch (e) { console.error('Erro IBGE', e) }
    finally { carregandoEstados.value = false }

    // 2. Preencher dados se for Edição
    if (props.usuarioEditando) {
        formUser.value = { ...props.usuarioEditando, parentesSelecionados: [] }

        // Tratar Órgão Expeditor
        if (opcoesOrgao.value.includes(props.usuarioEditando.orgaoExpeditor)) {
            selecaoOrgao.value = props.usuarioEditando.orgaoExpeditor
        } else if (props.usuarioEditando.orgaoExpeditor) {
            opcoesOrgao.value.splice(opcoesOrgao.value.length - 1, 0, props.usuarioEditando.orgaoExpeditor)
            selecaoOrgao.value = props.usuarioEditando.orgaoExpeditor
        }

        // Tratar Cidade/Estado (Formato "Cidade, UF")
        if (props.usuarioEditando.cidade && props.usuarioEditando.cidade.includes(', ')) {
            const [cid, uf] = props.usuarioEditando.cidade.split(', ')
            estadoSelecionado.value = uf
            await buscarCidades() // Busca a lista antes de setar o valor
            cidadeSelecionada.value = cid
        }
    }
})

const buscarCidades = async () => {
    cidadeSelecionada.value = ''
    cidades.value = []
    if (!estadoSelecionado.value) return

    carregandoCidades.value = true
    try {
        const res = await $fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.value}/municipios?orderBy=nome`)
        cidades.value = res.map(c => ({ id: c.id, nome: c.nome }))
    } catch (e) { console.error('Erro Cidades', e) }
    finally { carregandoCidades.value = false }
}

const handleOrgaoChange = () => {
    if (selecaoOrgao.value === 'Outros') {
        modalOutroOrgao.value = true
        outroOrgaoTexto.value = ''
    } else {
        formUser.value.orgaoExpeditor = selecaoOrgao.value
    }
}

const confirmarOutroOrgao = () => {
    if (outroOrgaoTexto.value.trim()) {
        const novo = outroOrgaoTexto.value.trim().toUpperCase()
        if (!opcoesOrgao.value.includes(novo)) {
            opcoesOrgao.value.splice(opcoesOrgao.value.length - 1, 0, novo)
        }
        selecaoOrgao.value = novo
        formUser.value.orgaoExpeditor = novo
        modalOutroOrgao.value = false
    }
}

const cancelarOutroOrgao = () => {
    selecaoOrgao.value = formUser.value.orgaoExpeditor || ''
    modalOutroOrgao.value = false
}

const salvarUser = async () => {
    if (!ignorarRegras.value) {
        const campos = ['nome', 'email', 'cpf', 'nascimento', 'orgaoExpeditor', 'celular', 'endereco'];
        if (campos.some(c => !formUser.value[c]) || !estadoSelecionado.value || !cidadeSelecionada.value) {
            showToast("Preencha todos os campos obrigatórios (*).", "warning");
            return
        }
        if (formUser.value.cpf && !validarCPF(formUser.value.cpf)) {
            showToast("CPF inválido!", "danger");
            return
        }
    }

    // Prepara a string final de cidade
    if (cidadeSelecionada.value && estadoSelecionado.value) {
        formUser.value.cidade = `${cidadeSelecionada.value}, ${estadoSelecionado.value}`
    }

    carregando.value = true
    const payload = { ...formUser.value, parentesIds: formUser.value.parentesSelecionados.map(p => p.id) };
    const method = formUser.value.id ? 'PUT' : 'POST';
    const url = formUser.value.id ? `/api/users/${formUser.value.id}` : '/api/users';

    try {
        await $fetch(url, { method, body: payload });
        showToast('Salvo com sucesso!', 'success');
        emit('salvo');
        emit('close');
    } catch (e) {
        showToast(e.data?.message || 'Erro ao salvar.', 'danger')
    } finally {
        carregando.value = false
    }
}
</script>

<style scoped>
.transition {
    transition: all 0.2s ease;
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
}

.btn-save:hover {
    background-color: #1D4ED8 !important;
}

.btn-light-cancel:hover {
    background-color: #E9ECEF !important;
}

.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.1);
    border-color: #93c5fd !important;
}
</style>