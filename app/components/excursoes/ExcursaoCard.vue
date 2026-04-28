<template>
    <div class="card h-100 shadow-hover border border-light bg-light rounded-4 card-excursao cursor-pointer"
        @click="$emit('gerenciar', excursao)">
        <div class="card-body p-4 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title text-dark fw-bold fs-5 mb-0">{{ excursao.nome }}</h5>
            </div>
            <p class="card-text text-brand fw-semibold small mb-4 d-flex align-items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                {{ excursao.lugar }}
            </p>
            <div class="mt-auto bg-white p-3 rounded-4 border-0 shadow-sm">
                <div class="small d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted small fw-semibold">Guia Responsável:</span>
                    <span :class="excursao.guia ? 'text-dark fw-bold' : 'text-danger fw-bold'">{{
                        excursao.guia?.nome || 'Pendente' }}</span>
                </div>
                <div class="progress rounded-pill bg-light" style="height: 8px;">
                    <div class="progress-bar rounded-pill"
                        :class="excursao._count.usuarios >= excursao.vagas ? 'bg-danger' : 'bg-brand'"
                        :style="{ width: (excursao._count.usuarios / excursao.vagas * 100) + '%' }"></div>
                </div>
                <div class="text-end mt-2">
                    <span class="fw-bold text-muted" style="font-size: 0.8rem;">{{
                        excursao._count.usuarios }} / {{ excursao.vagas }} vagas</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    excursao: { type: Object, required: true }
})
defineEmits(['gerenciar'])
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>