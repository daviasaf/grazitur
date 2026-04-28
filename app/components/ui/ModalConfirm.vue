<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1060;">
        <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 400px;">
            <div class="modal-content shadow-lg border-0 rounded-5">
                <div class="modal-body p-4 p-md-5 text-center bg-white rounded-5">
                    <div class="text-danger mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                    </div>
                    <h5 class="fw-bold text-dark mb-2 fs-4 tracking-tight">{{ title }}</h5>
                    <p class="text-muted small fw-semibold mb-4">{{ text }}</p>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-light fw-bold flex-fill rounded-pill py-3 border border-light"
                            @click="$emit('cancel')">Cancelar</button>
                        <button class="btn btn-danger fw-bold flex-fill rounded-pill py-3 shadow-soft"
                            @click="$emit('confirm')">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, default: 'Confirmar Ação' },
    text: { type: String, default: 'Deseja realmente prosseguir?' }
})
defineEmits(['confirm', 'cancel'])
</script>