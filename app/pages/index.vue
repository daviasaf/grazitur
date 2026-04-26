<template>
    <div class="min-vh-100 bg-light py-4 py-md-5 d-flex align-items-center">
        <div class="container px-3 px-md-0">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-8">

                    <div v-if="telaObrigado" class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white">
                        <h2 class="fw-bold text-success mb-3">Obrigado por se cadastrar ✨</h2>
                        <p class="text-muted fs-5">Grazi Turismo agradece sua confiança.</p>
                        <p class="fw-bold text-primary mt-3 fs-4 border-bottom pb-4">Obrigado por viajar com a gente 🚍
                        </p>

                        <div class="mt-4">
                            <button class="btn btn-outline-primary px-4 py-2 fw-bold rounded-pill shadow-sm"
                                @click="voltarAoInicio">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg>
                                Voltar ao formulário
                            </button>
                        </div>
                    </div>

                    <div v-else>
                        <div class="text-center mb-4">
                            <h2 class="fw-bold text-primary fs-3 fs-md-2">{{ tituloFormulario }}</h2>
                            <p class="text-muted small">Preencha seus dados para viajar conosco.</p>
                        </div>

                        <div v-if="cadastroSucesso"
                            class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white">
                            <h3 class="text-success fw-bold mb-3 fs-4">✔ Cadastro Realizado!</h3>
                            <p class="text-muted mb-4 small">Seus dados foram salvos com segurança.</p>
                            <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-3">
                                <button
                                    class="btn btn-outline-secondary px-4 py-3 py-sm-2 fw-bold w-100 w-sm-auto rounded-3"
                                    @click="abrirModal('finalizar')">Finalizar</button>
                                <button class="btn btn-primary px-4 py-3 py-sm-2 fw-bold w-100 w-sm-auto rounded-3"
                                    @click="abrirModal('familiar')">Cadastrar Familiar ou Amigo</button>
                            </div>
                        </div>

                        <div v-else class="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
                            <div v-if="erroForm"
                                class="alert alert-danger small fw-bold text-center border-0 rounded-3">{{ erroForm }}
                            </div>

                            <div class="row g-4">
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

                                <div class="col-12 col-md-6">
                                    <label class="form-label small text-muted fw-bold mb-1">CPF *</label>
                                    <input v-model="formUser.cpf" type="text"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                                        placeholder="Apenas números">
                                </div>

                                <div class="col-12 col-md-6">
                                    <label class="form-label small text-muted fw-bold mb-1">Nascimento (DD/MM/AAAA)
                                        *</label>
                                    <input v-model="formUser.nascimento" @input="formatarData" type="text"
                                        maxlength="10"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                                        placeholder="Ex: 25/12/1990">
                                </div>

                                <div class="col-12 col-md-6">
                                    <label class="form-label small text-muted fw-bold mb-1">Órgão Expeditor *</label>
                                    <input v-model="formUser.orgaoExpeditor" type="text"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                                        placeholder="Ex: Detran">
                                </div>

                                <div class="col-12 col-md-6">
                                    <label class="form-label small text-muted fw-bold mb-1">Celular / WhatsApp *</label>
                                    <input v-model="formUser.celular" type="text"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                                        placeholder="(00) 00000-0000">
                                </div>

                                <div class="col-12 col-md-8">
                                    <label class="form-label small text-muted fw-bold mb-1">Endereço Completo *</label>
                                    <input v-model="formUser.endereco" type="text"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3"
                                        placeholder="Rua, Número, Bairro">
                                </div>

                                <div class="col-12 col-md-4">
                                    <label class="form-label small text-muted fw-bold mb-1">Cidade *</label>
                                    <input v-model="formUser.cidade" type="text"
                                        class="form-control form-control-lg fs-6 bg-light border-0 rounded-3">
                                </div>

                                <div class="col-12 mt-5 text-end">
                                    <button class="btn btn-primary fw-bold px-5 py-3 w-100 rounded-3 shadow-sm"
                                        @click="enviarCadastro" :disabled="carregando">{{ carregando ? 'Salvando...' :
                                        'Realizar Cadastro' }}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="mostrarModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.6);">
            <div class="modal-dialog modal-dialog-centered px-3">
                <div class="modal-content rounded-4 border-0 shadow-lg">
                    <div class="modal-body text-center p-4 p-md-5">
                        <div class="mb-3 text-primary">
                            <svg v-if="tipoAcao === 'finalizar'" xmlns="http://www.w3.org/2000/svg" width="48"
                                height="48" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                            </svg>
                        </div>
                        <h5 class="fw-bold mb-4 text-dark fs-5">{{ mensagemModal }}</h5>
                        <div class="d-flex gap-2">
                            <button class="btn btn-light fw-bold flex-fill py-3 rounded-3 border"
                                @click="mostrarModal = false">Não</button>
                            <button class="btn btn-primary fw-bold flex-fill py-3 rounded-3 shadow-sm"
                                @click="confirmarAcao">Sim, Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formUser = ref({ nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: '' })
const erroForm = ref('')
const cadastroSucesso = ref(false)
const carregando = ref(false)
const ultimoCpfCadastrado = ref('')
const primeiroNome = ref('')
const mostrarModal = ref(false)
const tipoAcao = ref('')
const telaObrigado = ref(false)

const tituloFormulario = computed(() => {
    if (formUser.value.cpfFamiliar) return `Adicionando parente de: ${primeiroNome.value}`
    return 'Cadastro de Passageiro'
})

const mensagemModal = computed(() => {
    if (tipoAcao.value === 'finalizar') return 'Deseja finalizar seu cadastro agora?'
    return 'Deseja cadastrar um novo familiar ou amigo?'
})

const formatarData = (event) => {
    let v = event.target.value.replace(/\D/g, '')
    if (v.length >= 5) {
        v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3')
    } else if (v.length >= 3) {
        v = v.replace(/(\d{2})(\d{1,4})/, '$1/$2')
    }
    formUser.value.nascimento = v
}

const abrirModal = (acao) => {
    tipoAcao.value = acao
    mostrarModal.value = true
}

const confirmarAcao = () => {
    mostrarModal.value = false
    if (tipoAcao.value === 'finalizar') finalizar()
    if (tipoAcao.value === 'familiar') cadastrarFamiliar()
}

const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
    let soma = 0, resto
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11))) return false
    return true
}

const enviarCadastro = async () => {
    erroForm.value = ''
    const camposObrigatorios = ['nome', 'email', 'cpf', 'nascimento', 'orgaoExpeditor', 'celular', 'cidade', 'endereco']
    const algumCampoVazio = camposObrigatorios.some(campo => !formUser.value[campo])

    if (algumCampoVazio) {
        erroForm.value = "Por favor, preencha todos os campos."
        return
    }

    if (!validarCPF(formUser.value.cpf)) {
        erroForm.value = "O CPF digitado é inválido."
        return
    }

    carregando.value = true
    try {
        await $fetch('/api/users', { method: 'POST', body: formUser.value })
        if (!primeiroNome.value) primeiroNome.value = formUser.value.nome
        ultimoCpfCadastrado.value = formUser.value.cpf
        cadastroSucesso.value = true
    } catch (e) {
        erroForm.value = e.data?.message || 'Erro ao realizar cadastro.'
    } finally {
        carregando.value = false
    }
}

const cadastrarFamiliar = () => {
    formUser.value = { nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: ultimoCpfCadastrado.value }
    cadastroSucesso.value = false
}

const finalizar = () => {
    telaObrigado.value = true
}

const voltarAoInicio = () => {
    primeiroNome.value = ''
    ultimoCpfCadastrado.value = ''
    formUser.value = { nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: '' }
    cadastroSucesso.value = false
    telaObrigado.value = false
}
</script>

<style scoped>
.form-control:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
    background-color: #fff !important;
}
</style>