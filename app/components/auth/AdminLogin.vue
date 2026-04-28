<template>
    <div class="min-vh-100 bg-surface d-flex align-items-center justify-content-center p-3">
        <div class="card border-0 shadow-hover p-4 p-md-5 text-center w-100 rounded-5 bg-white"
            style="max-width: 420px;">
            <div class="mb-4 text-brand">
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" fill="currentColor" class="mb-3"
                    viewBox="0 0 16 16">
                    <path
                        d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                </svg>
                <h3 class="fw-bold text-dark tracking-tight">Acesso Restrito</h3>
                <p class="text-muted small">Gerenciamento GraziTur</p>
            </div>
            <input v-model="senha" type="password"
                class="form-control form-control-lg mb-4 text-center fs-6 bg-light border-0 rounded-4 py-3"
                placeholder="Digite a senha de administrador" @keyup.enter="fazerLogin">
            <p v-if="erroLogin" class="text-danger small fw-bold mb-3">{{ erroLogin }}</p>
            <button class="btn btn-brand btn-lg w-100 fw-bold fs-6 rounded-4 py-3 shadow-soft"
                @click="fazerLogin">Entrar no Painel</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['sucesso'])
const senha = ref('')
const erroLogin = ref('')

const fazerLogin = async () => {
    try {
        await $fetch('/api/auth', { method: 'POST', body: { password: senha.value } });
        if (import.meta.client) localStorage.setItem('graziTurAdmin', 'true');
        emit('sucesso')
    } catch (e) {
        erroLogin.value = e.data?.message || 'Senha incorreta.'
    }
}
</script>