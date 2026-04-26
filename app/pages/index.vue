<template>
    <div class="min-vh-100 bg-light py-5 d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">

                    <div class="text-center mb-4">
                        <h2 class="fw-bold text-primary">Cadastro de Passageiro</h2>
                        <p class="text-muted">Preencha seus dados para viajar conosco.</p>
                    </div>

                    <div v-if="cadastroSucesso" class="card border-0 shadow-lg p-5 text-center">
                        <h3 class="text-success fw-bold mb-3">✔ Cadastro Realizado!</h3>
                        <p class="text-muted mb-4">Seus dados foram salvos com segurança.</p>
                        <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                            <button class="btn btn-outline-secondary px-4 py-2 fw-bold"
                                @click="finalizar">Finalizar</button>
                            <button class="btn btn-primary px-4 py-2 fw-bold" @click="cadastrarFamiliar">Cadastrar
                                Familiar ou Amigo</button>
                        </div>
                    </div>

                    <div v-else class="card border-0 shadow-lg p-4 p-md-5">

                        <div v-if="erroForm" class="alert alert-danger small fw-bold">{{ erroForm }}</div>

                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label small text-muted fw-bold">Nome Completo *</label>
                                <input v-model="formUser.nome" type="text" class="form-control bg-light">
                            </div>

                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">CPF *</label>
                                <input v-model="formUser.cpf" type="text" class="form-control bg-light"
                                    placeholder="Apenas números">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">Data de Nascimento</label>
                                <input v-model="formUser.nascimento" type="date" class="form-control bg-light">
                            </div>

                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">RG (Opcional)</label>
                                <input v-model="formUser.rg" type="text" class="form-control bg-light">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">Órgão Expeditor</label>
                                <input v-model="formUser.orgaoExpeditor" type="text" class="form-control bg-light"
                                    placeholder="Ex: Detran">
                            </div>

                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">Celular / WhatsApp *</label>
                                <input v-model="formUser.celular" type="text" class="form-control bg-light">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small text-muted fw-bold">Cidade</label>
                                <input v-model="formUser.cidade" type="text" class="form-control bg-light">
                            </div>

                            <div class="col-12">
                                <label class="form-label small text-muted fw-bold">Endereço Completo</label>
                                <input v-model="formUser.endereco" type="text" class="form-control bg-light">
                            </div>

                            <div class="col-12 mt-4">
                                <div class="p-3 bg-primary bg-opacity-10 border border-primary rounded">
                                    <label class="form-label small text-primary fw-bold mb-1">Este cadastro é de um
                                        familiar/amigo?</label>
                                    <input v-model="formUser.cpfFamiliar" type="text" class="form-control"
                                        placeholder="Se sim, digite o seu CPF para registrar como parente no sistema">
                                    <small class="text-muted mt-1 d-block">Deixe em branco se este for o seu próprio
                                        cadastro.</small>
                                </div>
                            </div>

                            <div class="col-12 mt-4 text-end">
                                <button class="btn btn-primary fw-bold px-5 py-2 w-100" @click="enviarCadastro"
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

const enviarCadastro = async () => {
    erroForm.value = ''
    if (!formUser.value.nome || !formUser.value.cpf || !formUser.value.celular) {
        erroForm.value = "Por favor, preencha Nome, CPF e Celular."
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

        // Salva o CPF que acabou de ser registrado para caso ele queira atrelar um parente
        ultimoCpfCadastrado.value = formUser.value.cpf
        cadastroSucesso.value = true

    } catch (e) {
        erroForm.value = e.data?.message || 'Erro ao realizar cadastro.'
    } finally {
        carregando.value = false
    }
}

const cadastrarFamiliar = () => {
    // Limpa o formulário, mas preenche o CPF do familiar automaticamente com o CPF do titular
    formUser.value = { nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: ultimoCpfCadastrado.value }
    cadastroSucesso.value = false
}

const finalizar = () => {
    formUser.value = { nome: '', cpf: '', rg: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', cpfFamiliar: '' }
    cadastroSucesso.value = false
}
</script>