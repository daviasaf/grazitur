<template>
    <div class="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
        <div v-if="erroForm" class="alert alert-danger small fw-bold text-center border-0 rounded-3">{{ erroForm }}
        </div>

        <div class="row g-3">
            <div class="col-12">
                <label class="form-label small text-muted fw-bold mb-1">Nome Completo *</label>
                <input v-model="formUser.nome" type="text"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3">
            </div>

            <div class="col-12">
                <label class="form-label small text-muted fw-bold mb-1">E-mail *</label>
                <input v-model="formUser.email" type="email"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                    placeholder="exemplo@email.com">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">CPF *</label>
                <input v-model="formUser.cpf" @input="e => formUser.cpf = mascaraCPF(e.target.value)" type="text"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3" placeholder="000.000.000-00"
                    maxlength="14">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">Nascimento *</label>
                <input :value="formUser.nascimento" @input="e => formUser.nascimento = mascaraData(e.target.value)"
                    type="text" maxlength="10" class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                    placeholder="DD/MM/AAAA">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">Órgão Expeditor *</label>
                <select v-model="selecaoOrgao" @change="handleOrgaoChange"
                    class="form-select form-select-lg fs-6 bg-light border-0 rounded-3">
                    <option value="" disabled>Selecione...</option>
                    <option v-for="op in opcoesOrgao" :key="op" :value="op">{{ op }}</option>
                </select>
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">RG (Opcional)</label>
                <input v-model="formUser.rg" @input="e => formUser.rg = mascaraRG(e.target.value)" type="text"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3" placeholder="00.000.000-0">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">Idade </label>
                <input v-model="formUser.idade" type="number"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3" placeholder="Ex: 25">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">Celular / WhatsApp *</label>
                <input v-model="formUser.celular" type="text"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3" placeholder="(00) 00000-0000">
            </div>

            <div class="col-12 col-md-4">
                <label class="form-label small text-muted fw-bold mb-1">Estado *</label>
                <select v-model="estadoSelecionado" @change="buscarCidades"
                    class="form-select form-select-lg fs-6 bg-light border-0 rounded-3" :disabled="carregandoEstados">
                    <option value="" disabled>{{ carregandoEstados ? 'Aguarde...' : 'UF' }}</option>
                    <option v-for="uf in estados" :key="uf.sigla" :value="uf.sigla">{{ uf.sigla }}</option>
                </select>
            </div>

            <div class="col-12 col-md-8">
                <label class="form-label small text-muted fw-bold mb-1">Cidade *</label>
                <select v-model="cidadeSelecionada" class="form-select form-select-lg fs-6 bg-light border-0 rounded-3"
                    :disabled="!estadoSelecionado || carregandoCidades">
                    <option value="" disabled>{{ carregandoCidades ? 'Carregando cidades...' : 'Selecione a cidade' }}
                    </option>
                    <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.nome">{{ cidade.nome }}</option>
                </select>
            </div>

            <div class="col-12">
                <label class="form-label small text-muted fw-bold mb-1">Endereço Completo *</label>
                <input v-model="formUser.endereco" type="text"
                    class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                    placeholder="Rua, Número, Bairro">
            </div>

            <div class="col-12 mt-4 text-end">
                <button class="btn btn-primary fw-bold px-5 py-3 w-100 rounded-3 shadow-sm" @click="enviarCadastro"
                    :disabled="carregando">
                    {{ carregando ? 'Salvando...' : (formUser.id ? 'Salvar Alterações' : 'Realizar Cadastro') }}
                </button>
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
import { mascaraCPF, mascaraData, mascaraRG, validarCPF } from '~/utils/formatadores'

const props = defineProps({
    cpfFamiliar: { type: String, default: '' },
    usuarioEditando: { type: Object, default: () => null }
})
const emit = defineEmits(['sucesso'])

const formUser = ref({ id: null, nome: '', email: '', cpf: '', rg: '', idade: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: props.cpfFamiliar })
const erroForm = ref('')
const carregando = ref(false)

// Lógica de Órgão Expeditor
const opcoesOrgao = ref(['DETRAN', 'DIC', 'IFP', 'SSP', 'Outros'])
const selecaoOrgao = ref('')
const modalOutroOrgao = ref(false)
const outroOrgaoTexto = ref('')

// Estados e Cidades (IBGE)
const estados = ref([])
const cidades = ref([])
const estadoSelecionado = ref('')
const cidadeSelecionada = ref('')
const carregandoEstados = ref(false)
const carregandoCidades = ref(false)

onMounted(async () => {
    carregandoEstados.value = true
    try {
        const res = await $fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        estados.value = res.map(e => ({ sigla: e.sigla, nome: e.nome }))
    } catch (e) {
        console.error('Erro ao carregar estados do IBGE', e)
    } finally {
        carregandoEstados.value = false
    }

    if (props.usuarioEditando) {
        formUser.value = { ...formUser.value, ...props.usuarioEditando }

        if (opcoesOrgao.value.includes(props.usuarioEditando.orgaoExpeditor)) {
            selecaoOrgao.value = props.usuarioEditando.orgaoExpeditor
        } else if (props.usuarioEditando.orgaoExpeditor) {
            opcoesOrgao.value.splice(opcoesOrgao.value.length - 1, 0, props.usuarioEditando.orgaoExpeditor)
            selecaoOrgao.value = props.usuarioEditando.orgaoExpeditor
        }

        if (props.usuarioEditando.cidade && props.usuarioEditando.cidade.includes(', ')) {
            const [cid, uf] = props.usuarioEditando.cidade.split(', ')
            estadoSelecionado.value = uf
            await buscarCidades()
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
    } catch (e) {
        console.error('Erro ao carregar cidades do IBGE', e)
    } finally {
        carregandoCidades.value = false
    }
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
        const novoOrgao = outroOrgaoTexto.value.trim().toUpperCase()
        if (!opcoesOrgao.value.includes(novoOrgao)) {
            opcoesOrgao.value.splice(opcoesOrgao.value.length - 1, 0, novoOrgao)
        }
        selecaoOrgao.value = novoOrgao
        formUser.value.orgaoExpeditor = novoOrgao
        modalOutroOrgao.value = false
    }
}

const cancelarOutroOrgao = () => {
    selecaoOrgao.value = formUser.value.orgaoExpeditor || ''
    modalOutroOrgao.value = false
}

const enviarCadastro = async () => {
    erroForm.value = ''

    if (cidadeSelecionada.value && estadoSelecionado.value) {
        formUser.value.cidade = `${cidadeSelecionada.value}, ${estadoSelecionado.value}`
    } else {
        formUser.value.cidade = ''
    }

    const camposObrigatorios = ['nome', 'email', 'cpf', 'nascimento', 'orgaoExpeditor', 'celular', 'cidade', 'endereco']
    if (camposObrigatorios.some(campo => !formUser.value[campo])) { erroForm.value = "Por favor, preencha todos os campos obrigatórios (*)."; return }
    if (!validarCPF(formUser.value.cpf)) { erroForm.value = "O CPF digitado é inválido."; return }

    carregando.value = true
    try {
        const payload = {
            ...formUser.value,
            cpf: formUser.value.cpf.replace(/[^\d]+/g, "")
        };
        const method = formUser.value.id ? 'PUT' : 'POST';
        const url = formUser.value.id ? `/api/users/${formUser.value.id}` : '/api/users';

        await $fetch(url, { method, body: payload })
        emit('sucesso', payload.cpf, formUser.value.nome)
    } catch (e) {
        erroForm.value = e.data?.message || 'Erro ao realizar cadastro.'
    } finally {
        carregando.value = false
    }
}
</script>

<style scoped>
.form-control:focus,
.form-select:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
    background-color: #fff !important;
}
</style>