<template>
    <div class="card border-0 shadow-sm p-4 p-md-5 text-center rounded-4 bg-white">
        <h3 class="text-success fw-bold mb-3 fs-4">✔ Cadastro Realizado!</h3>
        <p class="text-muted mb-4 small">Seus dados foram salvos com segurança.</p>
        <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-3">
            <button class="btn btn-outline-secondary px-4 py-3 py-sm-2 fw-bold w-100 w-sm-auto rounded-3"
                @click="$emit('finalizar')">Finalizar</button>
            <button class="btn btn-primary px-4 py-3 py-sm-2 fw-bold w-100 w-sm-auto rounded-3"
                @click="$emit('cadastrarFamiliar')">Cadastrar Familiar ou Amigo</button>
        </div>
    </div>
</template>

<script setup>
defineEmits(['finalizar', 'cadastrarFamiliar'])
</script>