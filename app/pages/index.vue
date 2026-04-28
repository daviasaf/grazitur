<template>
    <div class="min-vh-100 bg-light py-4 py-md-5 d-flex align-items-center">
        <div class="container px-3 px-md-0">

            <div v-if="step === 'home'" class="row justify-content-center">
                <div class="col-12 text-center mb-5">
                    <h1 class="fw-bold text-brand display-5 mb-3">Bem-vindo à GraziTur</h1>
                    <p class="text-muted fs-5">O que você deseja fazer hoje?</p>
                </div>

                <div class="col-12 col-md-5 mb-4">
                    <div class="card border-0 shadow-sm rounded-5 h-100 bg-white p-4 p-md-5 text-center cursor-pointer card-hover"
                        @click="step = 'cadastro'">
                        <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-4"
                            style="width: 80px; height: 80px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path fill-rule="evenodd"
                                    d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                            </svg>
                        </div>
                        <h3 class="fw-bold text-dark mb-3">Novo Cadastro</h3>
                        <p class="text-muted mb-0">Ainda não viajou com a gente? Faça seu cadastro rápido aqui.</p>
                    </div>
                </div>

                <div class="col-12 col-md-5 mb-4">
                    <div class="card border-0 shadow-sm rounded-5 h-100 bg-white p-4 p-md-5 text-center cursor-pointer card-hover"
                        @click="step = 'login'">
                        <div class="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-4"
                            style="width: 80px; height: 80px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                <path
                                    d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .471.242c.182.251.28.618.28 1.05 0 .524-.188 1.135-.436 1.763a31.428 31.428 0 0 0-.422 1.168c.28.65.59 1.34.922 1.96.223.418.45.83.67 1.218.318.067.65.132.97.195.421.082.802.138 1.126.138.45 0 .84-.11 1.1-.38.258-.266.368-.621.288-1.026a.557.557 0 0 0-.214-.388.948.948 0 0 0-.472-.187 1.632 1.632 0 0 0-.616.059c-.43.151-.837.458-1.12.875a.5.5 0 0 1-.84-.528c.365-.58.918-.98 1.488-1.08a1.956 1.956 0 0 1 1.25.105c.48.21.84.664.95 1.242.096.536-.01 1.077-.306 1.484-.286.393-.728.6-1.173.6a3.296 3.296 0 0 1-1.39-.31c-.347-.132-.712-.3-1.07-.487a22.253 22.253 0 0 1-1.265-.724 23.454 23.454 0 0 1-1.92 1.196c-.347.185-.688.35-1.02.493-.418.18-1.083.42-1.748.42a1.76 1.76 0 0 1-1.04-.306zM7.31 9.497c-.15.385-.31.815-.47 1.263-.1.284-.2.57-.3.856.326.135.65.285.968.448.225-.438.441-.884.646-1.332.203-.44.385-.86.53-1.238a16.892 16.892 0 0 0-1.374-.002V9.497zm.582-4.148c-.08-.225-.213-.396-.34-.45a.144.144 0 0 0-.131.01.272.272 0 0 0-.095.143c-.046.168-.029.467.042.842.062.33.15.652.261.942a4.931 4.931 0 0 0 .313-1.18c.006-.118.006-.23 0-.307zM5.38 12.875c.29-.126.6-.264.92-.416-.36-.2-.717-.42-1.053-.655-.306-.215-.558-.415-.718-.58-.094.137-.156.29-.17.432-.016.16.035.315.144.407.13.111.319.162.535.162.13 0 .25-.01.341-.05z" />
                            </svg>
                        </div>
                        <h3 class="fw-bold text-dark mb-3">Acessar Minha Viagem</h3>
                        <p class="text-muted mb-0">Veja seus dados, forme seu grupo e assine seu contrato de viagem.</p>
                    </div>
                </div>
            </div>

            <div v-else class="row justify-content-center position-relative">
                <button
                    class="btn btn-light position-absolute top-0 start-0 m-3 m-md-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style="width: 48px; height: 48px; z-index: 10;" @click="reiniciarFluxo" title="Voltar ao início">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </button>

                <div class="col-12 col-lg-8">
                    <PublicStepObrigado v-if="step === 'obrigado'" @reiniciar="reiniciarFluxo" />
                    <div v-else-if="step === 'cadastro' || step === 'sucesso'">
                        <div class="text-center mb-4 pt-5 pt-md-0">
                            <h2 class="fw-bold text-primary fs-3 fs-md-2">{{ tituloFormulario }}</h2>
                            <p class="text-muted small">Preencha seus dados para viajar conosco.</p>
                        </div>
                        <PublicStepSucesso v-if="step === 'sucesso'" @finalizar="abrirConfirmacao('finalizar')"
                            @cadastrarFamiliar="abrirConfirmacao('familiar')" />
                        <PublicFormPassageiro v-if="step === 'cadastro'" :cpfFamiliar="cpfFamiliarBase"
                            @sucesso="onCadastroSucesso" />
                    </div>

                    <PublicAreaPassageiro v-if="step === 'login'" />
                </div>
            </div>
        </div>

        <PublicModalConfirmacao v-if="modalAberto" :tipoAcao="tipoAcao" @cancelar="modalAberto = false"
            @confirmar="executarAcao" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const step = ref('home') // 'home' | 'cadastro' | 'login' | 'sucesso' | 'obrigado'
const cpfFamiliarBase = ref('')
const nomeLider = ref('')
const modalAberto = ref(false)
const tipoAcao = ref('')

const tituloFormulario = computed(() => cpfFamiliarBase.value ? `Adicionando parente de: ${nomeLider.value}` : 'Cadastro de Passageiro')

const onCadastroSucesso = (cpf, nome) => {
    if (!nomeLider.value) nomeLider.value = nome;
    cpfFamiliarBase.value = cpf;
    step.value = 'sucesso';
}

const abrirConfirmacao = (acao) => { tipoAcao.value = acao; modalAberto.value = true; }

const executarAcao = () => {
    modalAberto.value = false;
    if (tipoAcao.value === 'finalizar') step.value = 'obrigado';
    else if (tipoAcao.value === 'familiar') step.value = 'cadastro';
}

const reiniciarFluxo = () => {
    cpfFamiliarBase.value = '';
    nomeLider.value = '';
    step.value = 'home';
}
</script>

<style scoped>
.card-hover {
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;
}

.card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    border-color: var(--brand-color);
}
</style>