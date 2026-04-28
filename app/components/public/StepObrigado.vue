<template>
    <div class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white">
        <h2 class="fw-bold text-success mb-3">Obrigado por se cadastrar ✨</h2>
        <p class="text-muted fs-5">Grazi Turismo agradece sua confiança.</p>
        <p class="fw-bold text-primary mt-3 fs-4 border-bottom pb-4">Obrigado por viajar com a gente 🚍</p>
        <div class="mt-4">
            <button class="btn btn-outline-primary px-4 py-2 fw-bold rounded-pill shadow-sm"
                @click="$emit('reiniciar')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg> Voltar ao formulário
            </button>
        </div>
    </div>
</template>

<script setup>
defineEmits(['reiniciar'])
</script>