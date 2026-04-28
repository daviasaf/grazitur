<template>
    <nav class="navbar bg-white shadow-sm sticky-top px-3 py-3 mb-0 border-bottom">
        <div class="container-fluid p-0 d-flex justify-content-between align-items-center px-2 px-md-4">
            <h1 class="fw-bold text-brand fs-4 m-0 d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M15 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7zM2 5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H2z" />
                    <path d="M8 0a4 4 0 0 0-4 4v1h8V4a4 4 0 0 0-4-4zm-3 4a3 3 0 0 1 6 0v1H5V4z" />
                </svg>
                GraziTur <span class="text-dark">Admin</span>
            </h1>
            <button class="btn btn-light text-danger fw-bold rounded-pill px-4 shadow-sm"
                @click="$emit('logout')">Sair</button>
        </div>
    </nav>
</template>

<script setup>
defineEmits(['logout'])
</script>