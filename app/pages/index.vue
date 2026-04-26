<template>
    <div class="min-vh-100 bg-light py-4 py-md-5 d-flex align-items-center">
        <div class="container px-3 px-md-0">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-8">

                    <div class="text-center mb-4">
                        <h2 class="fw-bold text-primary fs-3 fs-md-2">Cadastro de Passageiro</h2>
                        <p class="text-muted small">Preencha seus dados para viajar conosco.</p>
                    </div>

                    <div v-if="cadastroSucesso" class="card border-0 shadow-lg p-4 p-md-5 text-center rounded-4">
                        <h3 class="text-success fw-bold mb-3 fs-4">✔ Cadastro Realizado!</h3>
                        <p class="text-muted mb-4 small">Seus dados foram salvos com segurança.</p>
                        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                            <button class="btn btn-outline-secondary px-4 py-2 fw-bold w-100 w-sm-auto"
                                @click="finalizar">Finalizar</button>
                            <button class="btn btn-primary px-4 py-2 fw-bold w-100 w-sm-auto" @click="cadastrarFamiliar">
                                Cadastrar Familiar ou Amigo
                            </button>
                        </div>
                    </div>

                    <div v-else class="card border-0 shadow-lg p-3 p-md-5 rounded-4">

                        <div v-if="erroForm" class="alert alert-danger small fw-bold text-center">{{ erroForm }}</div>

                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label small text-muted fw-bold mb-1">Nome Completo *</label>
                                <input v-model="formUser.nome" type="text" class="form-control form-control-lg fs-6 bg-light border-0">
                            </div>

                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">CPF *</label>
                                <input v-model="formUser.cpf" type="text" class="form-control form-control-lg fs-6 bg-light border-0"
                                    placeholder="Apenas números">
                            </div>
                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">Data de Nascimento</label>
                                <input v-model="formUser.nascimento" type="date" class="form-control form-control-lg fs-6 bg-light border-0">
                            </div>

                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">RG (Opcional)</label>
                                <input v-model="formUser.rg" type="text" class="form-control form-control-lg fs-6 bg-light border-0" placeholder="Apenas números">
                            </div>
                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">Órgão Expeditor</label>
                                <input v-model="formUser.orgaoExpeditor" type="text" class="form-control form-control-lg fs-6 bg-light border-0"
                                    placeholder="Ex: Detran">
                            </div>

                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">Celular / WhatsApp *</label>
                                <input v-model="formUser.celular" type="text" class="form-control form-control-lg fs-6 bg-light border-0" placeholder="(00) 00000-0000">
                            </div>
                            <div class="col-12 col-sm-6">
                                <label class="form-label small text-muted fw-bold mb-1">Cidade</label>
                                <input v-model="formUser.cidade" type="text" class="form-control form-control-lg fs-6 bg-light border-0">
                            </div>

                            <div class="col-12">
                                <label class="form-label small text-muted fw-bold mb-1">Endereço Completo</label>
                                <input v-model="formUser.endereco" type="text" class="form-control form-control-lg fs-6 bg-light border-0" placeholder="Rua, Número, Bairro">
                            </div>

                            <div class="col-12 mt-4 text-end">
                                <button class="btn btn-primary fw-bold px-5 py-3 w-100 rounded-3 shadow-sm" @click="enviarCadastro"
                                    :disabled="carregando">
                                    {{ carregando ? 'Salvando...' : 'Realizar Cadastro' }}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const formUser = ref({ nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: '' })
const erroForm = ref('')
const cadastroSucesso = ref(false)
const carregando = ref(false)
const ultimoCpfCadastrado = ref('')

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
    if (!formUser.value.nome || !formUser.value.cpf || !formUser.value.celular) {
        erroForm.value = "Por favor, preencha Nome, CPF e Celular."
        return
    }

    if (!validarCPF(formUser.value.cpf)) {
        erroForm.value = "O CPF digitado é inválido. Verifique os números."
        return
    }

    carregando.value = true
    try {
        let dataFormatada = formUser.value.nascimento;
        if (dataFormatada && dataFormatada.includes('-')) {
            const partes = dataFormatada.split('-');
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        const payload = { ...formUser.value, nascimento: dataFormatada }

        await $fetch('/api/users', { method: 'POST', body: payload })

        ultimoCpfCadastrado.value = formUser.value.cpf
        cadastroSucesso.value = true

    } catch (e) {
        erroForm.value = e.data?.message || 'Erro ao realizar cadastro.'
    } finally {
        carregando.value = false
    }
}

const cadastrarFamiliar = () => {
    formUser.value = { nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: ultimoCpfCadastrado.value }
    cadastroSucesso.value = false
}

const finalizar = () => {
    formUser.value = { nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: '' }
    cadastroSucesso.value = false
}
</script>