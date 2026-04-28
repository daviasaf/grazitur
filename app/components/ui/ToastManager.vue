<template>
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
        <div v-for="t in toasts" :key="t.id"
            class="toast show align-items-center text-white border-0 mb-2 shadow-soft rounded-4" :class="`bg-${t.type}`"
            role="alert">
            <div class="d-flex">
                <div class="toast-body fw-semibold">
                    <span v-if="t.type === 'success'" class="me-2">✔</span>
                    <span v-if="t.type === 'danger'" class="me-2">✖</span>
                    <span v-if="t.type === 'warning'" class="me-2 text-dark">⚠</span>
                    <span :class="t.type === 'warning' ? 'text-dark' : ''">{{ t.message }}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto"
                    :class="t.type === 'warning' ? '' : 'btn-close-white'" @click="removerToast(t.id)"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
const { toasts, removerToast } = useToasts()
</script>