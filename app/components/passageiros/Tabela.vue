<template>
    <div>
        <div class="d-none d-lg-block table-wrapper shadow-sm border border-light rounded-4 overflow-hidden bg-white">
            <div class="scrollable-table-container">
                <table class="table table-hover align-middle mb-0 table-fixed-header">
                    <thead class="text-muted small text-uppercase sticky-top bg-white">
                        <tr>
                            <th class="ps-4 py-3 fw-bold border-0 text-start" style="width: 40%;">Nome do Passageiro
                            </th>
                            <th class="py-3 fw-bold border-0 text-center" style="width: 30%;">Documento (CPF)</th>
                            <th class="pe-4 py-3 fw-bold border-0 text-center" style="width: 30%;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in usuarios" :key="u.id" class="table-row-hover">
                            <td class="ps-4 py-3 text-start cursor-pointer" @click="$emit('vincular', u)">
                                <div class="fw-bold text-dark d-flex align-items-center gap-2">
                                    {{ u.nome }}
                                    <span v-if="u.isGuia"
                                        class="badge bg-warning text-dark py-1 px-2 rounded-pill shadow-sm"
                                        style="font-size: 0.65rem;">GUIA</span>
                                </div>
                            </td>
                            <td class="py-3 text-muted fw-semibold small text-center cursor-pointer"
                                @click="$emit('vincular', u)">{{ u.cpf || '-' }}</td>
                            <td class="pe-4 py-3 text-center text-nowrap">
                                <button
                                    class="btn btn-sm bg-primary bg-opacity-10 text-primary border-0 rounded-circle me-2 d-inline-flex align-items-center justify-content-center action-btn"
                                    style="width: 35px; height: 35px;" @click.stop="$emit('editar', u)" title="Editar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path
                                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </button>
                                <button
                                    class="btn btn-sm bg-danger bg-opacity-10 text-danger border-0 rounded-circle d-inline-flex align-items-center justify-content-center action-btn"
                                    style="width: 35px; height: 35px;" @click.stop="$emit('excluir', u)" title="Apagar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="usuarios.length === 0">
                            <td colspan="3" class="text-center text-muted py-5 p-4 fw-semibold">Nenhum passageiro
                                encontrado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="d-block d-lg-none mobile-list-container pe-1">
            <div v-for="u in usuarios" :key="u.id" class="card border border-light shadow-sm rounded-4 mb-3"
                style="background-color: #F1F5F9;">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3 cursor-pointer"
                        @click="$emit('vincular', u)">
                        <div>
                            <h6 class="fw-bold text-dark mb-1 fs-6">{{ u.nome }}</h6>
                            <p class="text-muted small fw-semibold mb-0">CPF: {{ u.cpf || '-' }}</p>
                        </div>
                        <span v-if="u.isGuia" class="badge bg-warning text-dark rounded-pill"
                            style="font-size: 0.7rem;">GUIA</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-light">
                        <button class="btn btn-editar flex-fill rounded-pill py-2 fw-bold small transition"
                            style="background-color: #2563eb; color: white; border: none;"
                            @click="$emit('editar', u)">Editar</button>
                        <button class="btn btn-vincular flex-fill rounded-pill py-2 fw-bold small transition"
                            style="background-color: #2563eb; color: white; border: none;"
                            @click="$emit('vincular', u)">Vincular</button>
                        <button
                            class="btn btn-outline-danger flex-fill flex-sm-grow-0 px-3 rounded-pill py-2 fw-bold bg-white transition hover-red"
                            style="color: #DC3545; border: 1px solid #DC3545;" @click="$emit('excluir', u)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="usuarios.length === 0"
                class="text-center text-muted py-5 bg-white rounded-4 border border-light">
                <p class="small fw-semibold mb-0">Nenhum passageiro encontrado.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({ usuarios: { type: Array, required: true } })
defineEmits(['vincular', 'editar', 'excluir'])
</script>

<style scoped>
.scrollable-table-container {
    max-height: 480px;
    /* Limite de altura definido para Tabela Desktop */
    overflow-y: auto;
}

.mobile-list-container {
    max-height: 520px;
    /* Limite de altura definido para Lista Mobile */
    overflow-y: auto;
}

/* Deixa o cabeçalho fixo ao rolar */
.table-fixed-header th {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f8fafc;
    /* cor combinando com o fundo, ou #fff */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.cursor-pointer {
    cursor: pointer;
}

.action-btn {
    transition: transform 0.15s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

.transition {
    transition: all 0.2s ease;
}

.btn-editar:hover,
.btn-vincular:hover {
    background-color: #1D4ED8 !important;
}

.hover-red:hover {
    background-color: #DC3545 !important;
    color: white !important;
}
</style>