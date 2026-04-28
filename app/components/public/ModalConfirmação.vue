<template>
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.6);">
        <div class="modal-dialog modal-dialog-centered px-3">
            <div class="modal-content rounded-4 border-0 shadow-lg">
                <div class="modal-body text-center p-4 p-md-5">
                    <div class="mb-3 text-primary">
                        <svg v-if="tipoAcao === 'finalizar'" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                            fill="currentColor" viewBox="0 0 16 16">
                            <path
                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                        </svg>
                    </div>
                    <h5 class="fw-bold mb-4 text-dark fs-5">{{ mensagem }}</h5>
                    <div class="d-flex gap-2">
                        <button class="btn btn-light fw-bold flex-fill py-3 rounded-3 border"
                            @click="$emit('cancelar')">Não</button>
                        <button class="btn btn-primary fw-bold flex-fill py-3 rounded-3 shadow-sm"
                            @click="$emit('confirmar')">Sim, Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ tipoAcao: { type: String, required: true } })
defineEmits(['cancelar', 'confirmar'])

const mensagem = computed(() => props.tipoAcao === 'finalizar' ? 'Deseja finalizar seu cadastro agora?' : 'Deseja cadastrar um novo familiar ou amigo?')
</script>