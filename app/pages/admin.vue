<template>
    <div class="app-container">
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
            <div v-for="t in toasts" :key="t.id"
                class="toast show align-items-center text-white border-0 mb-2 shadow-soft rounded-4"
                :class="`bg-${t.type}`" role="alert">
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

        <div v-if="!logado" class="min-vh-100 bg-surface d-flex align-items-center justify-content-center p-3">
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
                <button class="btn btn-brand btn-lg w-100 fw-bold fs-6 rounded-4 py-3 shadow-soft"
                    @click="fazerLogin">Entrar no Painel</button>
            </div>
        </div>

        <div v-else class="min-vh-100 bg-surface pb-5">
            <nav class="navbar bg-white shadow-sm sticky-top px-3 py-3 mb-0 border-bottom">
                <div class="container-fluid p-0 d-flex justify-content-between align-items-center px-2 px-md-4">
                    <h1 class="fw-bold text-brand fs-4 m-0 d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M15 7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7zM2 5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H2z" />
                            <path d="M8 0a4 4 0 0 0-4 4v1h8V4a4 4 0 0 0-4-4zm-3 4a3 3 0 0 1 6 0v1H5V4z" />
                        </svg>
                        GraziTur <span class="text-dark">Admin</span>
                    </h1>
                    <button class="btn btn-light text-danger fw-bold rounded-pill px-4 shadow-sm"
                        @click="fazerLogout">Sair</button>
                </div>
            </nav>

            <div class="main-container px-3 px-md-4 mt-4 mt-md-5">

                <div class="bg-white p-4 p-md-5 rounded-5 mb-5 shadow-sm border-0">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                        <h4 class="text-dark fw-bold mb-0 fs-4 tracking-tight">Excursões Ativas</h4>
                        <button
                            class="btn btn-brand btn-sm shadow-soft px-4 py-2 fw-bold rounded-pill d-flex align-items-center gap-2"
                            @click="abrirModalExcursao()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                            Nova Excursão
                        </button>
                    </div>

                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <div v-for="ex in excursoes" :key="ex.id" class="col">
                            <div class="card h-100 shadow-hover border border-light bg-light rounded-4 card-excursao"
                                @click="abrirGerenciarExcursao(ex)">
                                <div class="card-body p-4 d-flex flex-column">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <h5 class="card-title text-dark fw-bold fs-5 mb-0">{{ ex.nome }}</h5>
                                    </div>
                                    <p
                                        class="card-text text-brand fw-semibold small mb-4 d-flex align-items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                        </svg>
                                        {{ ex.lugar }}
                                    </p>
                                    <div class="mt-auto bg-white p-3 rounded-4 border-0 shadow-sm">
                                        <div class="small d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small fw-semibold">Guia Responsável:</span>
                                            <span :class="ex.guia ? 'text-dark fw-bold' : 'text-danger fw-bold'">{{
                                                ex.guia?.nome || 'Pendente' }}</span>
                                        </div>
                                        <div class="progress rounded-pill bg-light" style="height: 8px;">
                                            <div class="progress-bar rounded-pill"
                                                :class="ex._count.usuarios >= ex.vagas ? 'bg-danger' : 'bg-brand'"
                                                :style="{ width: (ex._count.usuarios / ex.vagas * 100) + '%' }"></div>
                                        </div>
                                        <div class="text-end mt-2">
                                            <span class="fw-bold text-muted" style="font-size: 0.8rem;">{{
                                                ex._count.usuarios }} / {{ ex.vagas }} vagas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="excursoes.length === 0" class="col-12 text-center py-5">
                            <div class="text-muted mb-0 d-flex flex-column align-items-center opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                                    class="mb-3" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path
                                        d="M4.285 10.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 8.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 7.5a4.498 4.498 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                </svg>
                                Nenhuma excursão cadastrada no momento.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 p-md-5 rounded-5 shadow-sm border-0 mb-5">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                        <h4 class="text-dark fw-bold mb-0 fs-4 tracking-tight">Base de Passageiros</h4>
                        <div class="d-flex gap-2 w-100 w-sm-auto position-relative">
                            <div class="position-relative w-100 input-search-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                </svg>
                                <input v-model="buscaUser" type="text"
                                    class="form-control border-light bg-light rounded-pill ps-5 pe-4 py-2 fw-semibold"
                                    placeholder="Buscar passageiro...">
                                <button v-if="buscaUser" type="button"
                                    class="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
                                    style="font-size: 0.6rem;" @click="buscaUser = ''"></button>
                            </div>
                            <button
                                class="btn btn-brand fw-bold px-4 shadow-soft text-nowrap rounded-pill d-flex align-items-center gap-2"
                                @click="prepararNovoUser">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    <path fill-rule="evenodd"
                                        d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                </svg>
                                Cadastro
                            </button>
                        </div>
                    </div>

                    <div
                        class="d-none d-lg-block table-wrapper shadow-sm border border-light rounded-4 overflow-hidden bg-white">
                        <div class="scrollable-table-container">
                            <table class="table table-hover align-middle mb-0 table-fixed-header">
                                <thead class="text-muted small text-uppercase">
                                    <tr>
                                        <th class="ps-4 py-3 fw-bold border-0 text-start" style="width: 40%;">Nome do
                                            Passageiro</th>
                                        <th class="py-3 fw-bold border-0 text-center" style="width: 30%;">Documento
                                            (CPF)</th>
                                        <th class="pe-4 py-3 fw-bold border-0 text-center" style="width: 30%;">Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="u in usuariosFiltrados" :key="u.id" class="table-row-hover">
                                        <td class="ps-4 py-3 text-start" @click="abrirVincular(u)">
                                            <div class="fw-bold text-dark d-flex align-items-center gap-2">
                                                {{ u.nome }}
                                                <span v-if="u.isGuia"
                                                    class="badge bg-warning text-dark py-1 px-2 rounded-pill shadow-sm"
                                                    style="font-size: 0.65rem;">GUIA</span>
                                            </div>
                                        </td>
                                        <td class="py-3 text-muted fw-semibold small text-center"
                                            @click="abrirVincular(u)">{{ u.cpf || '-' }}</td>
                                        <td class="pe-4 py-3 text-center text-nowrap">
                                            <button
                                                class="btn btn-sm bg-primary bg-opacity-10 text-primary border-0 rounded-circle me-2 d-inline-flex align-items-center justify-content-center action-btn"
                                                style="width: 35px; height: 35px;" @click.stop="prepararEdicaoUser(u)"
                                                title="Editar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path
                                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                </svg>
                                            </button>
                                            <button
                                                class="btn btn-sm bg-danger bg-opacity-10 text-danger border-0 rounded-circle d-inline-flex align-items-center justify-content-center action-btn"
                                                style="width: 35px; height: 35px;"
                                                @click.stop="pedirConfirmacao('user', u.id, 'Excluir Passageiro', 'Deseja excluir permanentemente este cadastro?')"
                                                title="Apagar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path
                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="usuariosFiltrados.length === 0">
                                        <td colspan="3" class="text-center text-muted py-5 p-4 fw-semibold">Nenhum
                                            passageiro encontrado.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="d-block d-lg-none">
                        <div v-for="u in usuariosFiltrados" :key="u.id"
                            class="card border border-light shadow-sm rounded-4 mb-3 bg-light">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-start mb-3"
                                    @click="abrirVincular(u)">
                                    <div>
                                        <h6 class="fw-bold text-dark mb-1 fs-6">{{ u.nome }}</h6>
                                        <p class="text-muted small fw-semibold mb-0">CPF: {{ u.cpf || '-' }}</p>
                                    </div>
                                    <span v-if="u.isGuia" class="badge bg-warning text-dark rounded-pill"
                                        style="font-size: 0.7rem;">GUIA</span>
                                </div>
                                <div class="d-flex gap-2 mt-3 pt-3 border-top border-light">
                                    <button
                                        class="btn btn-outline-brand flex-fill rounded-pill py-2 fw-bold small bg-white"
                                        @click="prepararEdicaoUser(u)">Editar</button>
                                    <button class="btn btn-brand flex-fill rounded-pill py-2 fw-bold small shadow-sm"
                                        @click="abrirVincular(u)">Vincular</button>
                                    <button class="btn btn-outline-danger px-3 rounded-pill py-2 fw-bold bg-white"
                                        @click="pedirConfirmacao('user', u.id, 'Excluir', 'Deseja excluir permanentemente?')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path
                                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="usuariosFiltrados.length === 0"
                            class="text-center text-muted py-5 bg-white rounded-4 border">
                            <p class="small fw-semibold mb-0">Nenhum passageiro encontrado.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalUser" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-xl modal-dialog-scrollable px-2">
                    <div class="modal-content border-0 shadow-lg rounded-5 bg-light">
                        <div
                            class="modal-header bg-white p-4 border-bottom rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold fs-5 text-dark d-flex align-items-center gap-2 m-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="text-brand" viewBox="0 0 16 16">
                                    <path
                                        d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>
                                {{ formUser.id ? 'Editar Cadastro' : 'Novo Cadastro' }}
                            </h5>
                            <button class="btn-close m-0" @click="modalUser = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5">
                            <div class="row g-4">
                                <div class="col-lg-6">
                                    <div class="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100">
                                        <h6 class="text-brand fw-bold border-bottom pb-3 mb-4">Dados Pessoais</h6>
                                        <div class="mb-3">
                                            <label class="form-label small fw-semibold text-muted">Nome Completo
                                                *</label>
                                            <input v-model="formUser.nome" type="text"
                                                class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label small fw-semibold text-muted">E-mail</label>
                                            <input v-model="formUser.email" type="email"
                                                class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                        </div>
                                        <div class="row g-3">
                                            <div class="col-12 col-md-6">
                                                <label class="form-label small fw-semibold text-muted">CPF *</label>
                                                <input v-model="formUser.cpf" type="text"
                                                    class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                                    placeholder="Apenas números">
                                            </div>
                                            <div class="col-12 col-md-6">
                                                <label
                                                    class="form-label small fw-semibold text-muted d-flex justify-content-between">Nascimento
                                                    *</label>
                                                <input :value="formUser.nascimento"
                                                    @input="e => formUser.nascimento = mascaraData(e.target.value)"
                                                    type="text" maxlength="10"
                                                    class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                                    placeholder="DD/MM/AAAA">
                                            </div>
                                            <div class="col-12">
                                                <label class="form-label small fw-semibold text-muted">Órgão Expeditor
                                                    *</label>
                                                <input v-model="formUser.orgaoExpeditor" type="text"
                                                    class="form-control bg-light border-0 rounded-3 py-2 fw-semibold"
                                                    placeholder="Ex: Detran RJ">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div
                                        class="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light h-100 d-flex flex-column">
                                        <h6 class="text-brand fw-bold border-bottom pb-3 mb-4">Contato e Sistema</h6>
                                        <div class="mb-3">
                                            <label class="form-label small fw-semibold text-muted">Celular *</label>
                                            <input v-model="formUser.celular" type="text"
                                                class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                        </div>
                                        <div class="row g-3 mb-4">
                                            <div class="col-12 col-sm-8">
                                                <label class="form-label small fw-semibold text-muted">Endereço Completo
                                                    *</label>
                                                <input v-model="formUser.endereco" type="text"
                                                    class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label small fw-semibold text-muted">Cidade *</label>
                                                <input v-model="formUser.cidade" type="text"
                                                    class="form-control bg-light border-0 rounded-3 py-2 fw-semibold">
                                            </div>
                                        </div>
                                        <div
                                            class="mt-auto p-3 bg-warning bg-opacity-10 rounded-4 border border-warning mb-3">
                                            <div class="form-check form-switch m-0 d-flex align-items-center">
                                                <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                    type="checkbox" v-model="formUser.isGuia" id="guiaSwitch">
                                                <label
                                                    class="form-check-label fw-bold text-dark mb-0 cursor-pointer lh-sm"
                                                    for="guiaSwitch">Habilitar como GUIA</label>
                                            </div>
                                        </div>
                                        <div class="p-3 bg-danger bg-opacity-10 rounded-4 border border-danger">
                                            <div class="form-check form-switch m-0 d-flex align-items-center">
                                                <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                    type="checkbox" v-model="ignorarRegras" id="ignorarSwitch">
                                                <label
                                                    class="form-check-label fw-bold text-danger mb-0 cursor-pointer lh-sm"
                                                    for="ignorarSwitch">
                                                    IGNORAR REGRAS <br>
                                                    <span class="fw-semibold text-muted small d-block mt-1">Salvar sem
                                                        preenchimento obrigatório.</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-4">
                                <div class="col-12 mb-3">
                                    <h5 class="text-dark fw-bold mb-0 fs-5 d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="text-success" viewBox="0 0 16 16">
                                            <path
                                                d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            <path fill-rule="evenodd"
                                                d="M5.25 1.5A.75.75 0 0 1 6 2.25v2.5h2.5a.75.75 0 0 1 0 1.5H6v2.5a.75.75 0 0 1-1.5 0v-2.5H2a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 .75-.75z" />
                                        </svg>
                                        Grupo Familiar (Opcional)
                                    </h5>
                                </div>
                                <div class="col-lg-6 mb-4 mb-lg-0">
                                    <div class="bg-white p-4 rounded-4 shadow-sm border border-light h-100">
                                        <label class="form-label small fw-semibold text-muted">Pesquisar Passageiro na
                                            Base:</label>
                                        <div class="position-relative mb-3">
                                            <input v-model="buscaParenteModal" type="text"
                                                class="form-control bg-light border-0 rounded-pill pe-4 py-2 fw-semibold"
                                                placeholder="Digite o nome...">
                                            <button v-if="buscaParenteModal" type="button"
                                                class="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
                                                style="font-size: 0.6rem;" @click="buscaParenteModal = ''"></button>
                                        </div>
                                        <div class="d-flex flex-column gap-2 scrollable-table-container"
                                            style="max-height: 200px;">
                                            <div v-for="u in usuariosParaParenteFiltrados" :key="u.id"
                                                class="p-3 rounded-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 border bg-light"
                                                :class="{ 'border-success bg-success bg-opacity-10': u.jaAdicionado }">
                                                <span class="fw-bold text-dark text-truncate w-100"
                                                    :class="{ 'text-success': u.jaAdicionado }">{{ u.nome }}</span>
                                                <button
                                                    class="btn btn-sm fw-bold w-100 w-sm-auto rounded-pill px-3 shadow-sm"
                                                    :class="u.jaAdicionado ? 'btn-success' : 'btn-brand'"
                                                    :disabled="u.jaAdicionado" @click="adicionarParenteNoForm(u)">{{
                                                    u.jaAdicionado ? '✔' : 'Adicionar' }}</button>
                                            </div>
                                            <div v-if="usuariosParaParenteFiltrados.length === 0 && buscaParenteModal"
                                                class="text-muted small p-4 bg-light text-center rounded-4 fw-semibold">
                                                Nenhum resultado.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div
                                        class="bg-brand-light p-4 rounded-4 border border-brand border-opacity-25 h-100">
                                        <label class="form-label small fw-bold text-brand">Parentes Vinculados:</label>
                                        <div class="d-flex flex-column gap-2 scrollable-table-container"
                                            style="max-height: 200px;">
                                            <div v-for="(p, index) in formUser.parentesSelecionados" :key="index"
                                                class="bg-white p-3 rounded-4 shadow-sm border-0 d-flex justify-content-between align-items-center">
                                                <span class="fw-bold text-dark text-truncate pe-2">{{ p.nome }}</span>
                                                <button
                                                    class="btn btn-sm btn-light text-danger fw-bold rounded-pill px-3"
                                                    @click="removerParenteDoForm(index)">Remover</button>
                                            </div>
                                            <div v-if="formUser.parentesSelecionados.length === 0"
                                                class="text-center p-4 bg-white rounded-4 opacity-75 border-light border">
                                                <p class="text-muted small mb-0 fw-semibold">Lista vazia.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="modal-footer bg-white p-4 border-top border-light d-flex flex-column flex-sm-row gap-2 rounded-bottom-5">
                            <button
                                class="btn btn-light text-secondary fw-bold border border-light w-100 w-sm-auto me-sm-auto py-3 rounded-pill px-4"
                                @click="modalUser = false">Cancelar</button>
                            <button
                                class="btn btn-brand fw-bold w-100 w-sm-auto py-3 shadow-soft rounded-pill px-5 d-flex align-items-center justify-content-center gap-2"
                                @click="salvarUser">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path
                                        d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
                                </svg>
                                Salvar Cadastro
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalConfirm" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); z-index: 1060;">
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
                            <h5 class="fw-bold text-dark mb-2 fs-4 tracking-tight">{{ confirmTitle }}</h5>
                            <p class="text-muted small fw-semibold mb-4">{{ confirmText }}</p>
                            <div class="d-flex gap-2 mt-2">
                                <button class="btn btn-light fw-bold flex-fill rounded-pill py-3 border border-light"
                                    @click="modalConfirm = false">Cancelar</button>
                                <button class="btn btn-danger fw-bold flex-fill rounded-pill py-3 shadow-soft"
                                    @click="executarConfirmacao">Sim, Apagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalCriarExcursao" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-lg modal-dialog-centered px-2" style="max-width: 800px;">
                    <div class="modal-content border-0 shadow-lg rounded-5 bg-light">
                        <div
                            class="modal-header bg-white p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold text-dark fs-5 d-flex align-items-center gap-2 m-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                    class="text-brand" viewBox="0 0 16 16">
                                    <path
                                        d="M8 0a.5.5 0 0 1 .5.5v2h5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2h5v-2A.5.5 0 0 1 8 0zM1 4.5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H1z" />
                                </svg>
                                {{ formEx.id ? 'Editar Excursão' : 'Nova Excursão' }}
                            </h5>
                            <button class="btn-close m-0" @click="fecharExcursao"></button>
                        </div>
                        <div class="modal-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label small text-muted mb-1 fw-semibold">Título do Pacote
                                        *</label>
                                    <input v-model="formEx.nome"
                                        class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-semibold"
                                        placeholder="Ex: Fim de Semana Beto Carrero">
                                </div>
                                <div class="col-12 col-md-8">
                                    <label class="form-label small text-muted mb-1 fw-semibold">Destino *</label>
                                    <input v-model="formEx.lugar"
                                        class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-semibold"
                                        placeholder="Local de destino principal">
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label small text-muted mb-1 fw-semibold">Qtd de Vagas *</label>
                                    <input v-model="formEx.vagas" type="number"
                                        class="form-control form-control-lg bg-light border-0 rounded-3 py-2 fw-bold text-brand">
                                </div>

                                <div class="col-12 mt-4 p-4 bg-light rounded-4 border border-light">
                                    <label
                                        class="form-label small fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="text-success" viewBox="0 0 16 16">
                                            <path
                                                d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                                            <path
                                                d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z" />
                                        </svg>
                                        Opções de Pagamento *
                                    </label>
                                    <div class="d-flex flex-column flex-sm-row gap-2 mb-3">
                                        <input v-model="novoValor" type="number"
                                            class="form-control bg-white border-0 shadow-sm py-2 fw-semibold"
                                            placeholder="Valor total (Ex: 1800)">
                                        <input v-model="novasVezes" type="number"
                                            class="form-control bg-white border-0 shadow-sm py-2 fw-semibold"
                                            placeholder="Vezes (Ex: 3)">
                                        <button class="btn btn-brand fw-bold px-4 rounded-3 text-nowrap shadow-sm"
                                            @click="adicionarValorExcursao">Adicionar</button>
                                    </div>
                                    <ul class="list-group list-group-flush rounded-3 overflow-hidden shadow-sm">
                                        <li v-if="!formEx.valores || formEx.valores.length === 0"
                                            class="list-group-item text-muted small text-center py-4 bg-white fw-semibold">
                                            Nenhuma opção de pagamento adicionada.
                                        </li>
                                        <li v-for="(v, index) in formEx.valores" :key="index"
                                            class="list-group-item d-flex justify-content-between align-items-center py-3 px-4 bg-white">
                                            <span class="fw-bold text-dark fs-6">{{ v.vezes }}x de R$ {{ v.valor
                                                }}</span>
                                            <button
                                                class="btn btn-sm text-danger p-1 border-0 bg-light rounded-circle d-flex align-items-center justify-content-center"
                                                style="width: 28px; height: 28px;"
                                                @click="removerValorExcursao(index)"><svg
                                                    xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                </svg></button>
                                        </li>
                                    </ul>
                                    <hr class="my-4 border-secondary opacity-10">
                                    <div class="d-flex flex-column gap-3">
                                        <div
                                            class="form-check form-switch d-flex align-items-center bg-white p-3 rounded-3 shadow-sm m-0 border border-light">
                                            <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                type="checkbox" v-model="formEx.ativarContrato"
                                                id="ativarContratoSwitch">
                                            <label class="form-check-label fw-bold text-dark cursor-pointer lh-sm"
                                                for="ativarContratoSwitch">Habilitar Contratos Oficiais</label>
                                        </div>
                                        <div
                                            class="form-check form-switch d-flex align-items-center bg-white p-3 rounded-3 shadow-sm m-0 border border-light">
                                            <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                type="checkbox" v-model="formEx.aplicarParcelas"
                                                id="aplicarParcelasSwitch">
                                            <label class="form-check-label fw-bold text-dark cursor-pointer lh-sm"
                                                for="aplicarParcelasSwitch">Atribuir parcelas individualmente aos
                                                passageiros</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 mt-4 pt-4 border-top border-light" v-if="formEx.ativarContrato">
                                    <h6 class="fw-bold text-brand mb-3 d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                        </svg>
                                        Parâmetros do Contrato
                                    </h6>
                                    <div class="row g-3 bg-light p-4 rounded-4 border border-light">
                                        <div class="col-6 col-md-3">
                                            <label class="form-label small fw-semibold text-muted mb-1">Data
                                                Saída</label>
                                            <input :value="formEx.detalhes?.dataSaida"
                                                @input="e => formEx.detalhes.dataSaida = mascaraData(e.target.value)"
                                                type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="DD/MM/AAAA" maxlength="10">
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <label class="form-label small fw-semibold text-muted mb-1">Hora
                                                Saída</label>
                                            <input :value="formEx.detalhes?.horaSaida"
                                                @input="e => formEx.detalhes.horaSaida = mascaraHora(e.target.value)"
                                                type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="03:00" maxlength="5">
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <label class="form-label small fw-semibold text-muted mb-1">Data
                                                Retorno</label>
                                            <input :value="formEx.detalhes?.dataRetorno"
                                                @input="e => formEx.detalhes.dataRetorno = mascaraData(e.target.value)"
                                                type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="DD/MM/AAAA" maxlength="10">
                                        </div>
                                        <div class="col-6 col-md-3">
                                            <label class="form-label small fw-semibold text-muted mb-1">Hora
                                                Retorno</label>
                                            <input :value="formEx.detalhes?.horaRetorno"
                                                @input="e => formEx.detalhes.horaRetorno = mascaraHora(e.target.value)"
                                                type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="17:00" maxlength="5">
                                        </div>
                                        <div class="col-6">
                                            <label class="form-label small fw-semibold text-muted mb-1">Meio de
                                                Transporte</label>
                                            <input v-model="formEx.detalhes.transporte" type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="Ex: Van">
                                        </div>
                                        <div class="col-6">
                                            <label
                                                class="form-label small fw-semibold text-muted mb-1">Transportadora</label>
                                            <input v-model="formEx.detalhes.empresa" type="text"
                                                class="form-control form-control-sm bg-white border-0 shadow-sm py-2"
                                                placeholder="Ex: Quissa Turismo">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label small fw-semibold text-muted mb-1">Roteiro Completo
                                                e Serviços Inclusos</label>
                                            <textarea v-model="formEx.detalhes.roteiro"
                                                class="form-control bg-white border-0 shadow-sm p-3" rows="4"
                                                placeholder="Detalhe os locais de visitação, almoços..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="col-12 mt-4 p-4 bg-brand-light rounded-4 border border-brand border-opacity-25">
                                    <label class="form-label small fw-bold text-brand mb-2">Guia Responsável
                                        (Opcional)</label>
                                    <select v-model="formEx.guiaId"
                                        class="form-select form-select-lg border-0 fw-semibold text-dark bg-white shadow-sm rounded-3 py-2">
                                        <option :value="null">-- Nenhum Guia Vinculado --</option>
                                        <option v-for="g in guiasDisponiveis" :key="g.id" :value="g.id">{{ g.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div
                            class="modal-footer p-4 bg-white border-top border-light d-flex flex-column flex-sm-row gap-2 rounded-bottom-5">
                            <button v-if="formEx.id"
                                class="btn btn-outline-danger fw-bold rounded-pill py-3 w-100 w-sm-auto px-4 me-auto"
                                @click="pedirConfirmacao('excursao', formEx.id, 'Apagar Excursão', 'Deseja apagar esta viagem definitivamente?')">Apagar
                                Viagem</button>
                            <button
                                class="btn btn-light text-secondary fw-bold border border-light py-3 w-100 w-sm-auto px-4 rounded-pill"
                                :class="!formEx.id ? 'me-auto' : ''" @click="fecharExcursao">Cancelar</button>
                            <button
                                class="btn btn-brand fw-bold px-5 py-3 w-100 w-sm-auto rounded-pill shadow-soft d-flex align-items-center justify-content-center gap-2"
                                @click="salvarExcursao">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path
                                        d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
                                </svg>
                                Salvar Excursão
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalGerenciarEx" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable px-2">
                    <div class="modal-content border-0 shadow-lg rounded-5 bg-light">
                        <div
                            class="modal-header bg-white p-4 p-md-5 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="modal-title fw-bold fs-4 text-dark mb-1 tracking-tight">{{ exSelecionada.nome
                                    }}</h5>
                                <p class="text-brand mb-0 small fw-semibold">{{ exSelecionada.lugar }}</p>
                            </div>
                            <button class="btn-close m-0" @click="modalGerenciarEx = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5 bg-surface">

                            <div class="row g-4 mb-4">
                                <div class="col-lg-4" v-if="exSelecionada.valores && exSelecionada.valores.length > 0">
                                    <div class="bg-white p-4 rounded-4 shadow-sm border border-light h-100">
                                        <h6 class="small fw-bold text-muted text-uppercase mb-4">Tabela de Preços</h6>
                                        <div class="d-flex flex-column gap-2">
                                            <span v-for="(v, i) in exSelecionada.valores" :key="i"
                                                class="badge bg-success bg-opacity-10 text-success px-4 py-2 fs-6 rounded-pill border border-success border-opacity-25 w-auto align-self-start">
                                                {{ v.vezes }}x de R$ {{ v.valor }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    :class="exSelecionada.valores && exSelecionada.valores.length > 0 ? 'col-lg-8' : 'col-12'">
                                    <div
                                        class="bg-white p-4 rounded-4 shadow-sm border border-light h-100 d-flex flex-column justify-content-center">
                                        <h6 class="small fw-bold text-muted text-uppercase mb-2">Ocupação</h6>
                                        <div class="d-flex align-items-center gap-2 mb-4">
                                            <h2 class="fw-bold text-dark mb-0 display-6">{{
                                                exSelecionada.usuarios.length }}</h2>
                                            <span class="fs-6 text-muted mt-1 fw-semibold">/ {{ exSelecionada.vagas }}
                                                vagas ocupadas</span>
                                        </div>
                                        <div class="d-flex flex-wrap gap-2">
                                            <button v-if="exSelecionada.ativarContrato"
                                                class="btn btn-outline-primary fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 bg-white"
                                                @click="abrirModalGrupos(exSelecionada)">
                                                👥 Grupos
                                            </button>
                                            <button v-if="exSelecionada.ativarContrato"
                                                class="btn btn-dark fw-bold rounded-pill px-4 py-2 shadow-soft d-flex align-items-center gap-2"
                                                @click="iniciarGeracaoContratos(exSelecionada)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                </svg>
                                                Contratos
                                            </button>
                                            <button
                                                class="btn btn-outline-danger fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 bg-white"
                                                @click="baixarListaPDF(exSelecionada)"
                                                :disabled="exSelecionada.usuarios.length === 0 || !exSelecionada.guiaId">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                    <path
                                                        d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .471.242c.182.251.28.618.28 1.05 0 .524-.188 1.135-.436 1.763a31.428 31.428 0 0 0-.422 1.168c.28.65.59 1.34.922 1.96.223.418.45.83.67 1.218.318.067.65.132.97.195.421.082.802.138 1.126.138.45 0 .84-.11 1.1-.38.258-.266.368-.621.288-1.026a.557.557 0 0 0-.214-.388.948.948 0 0 0-.472-.187 1.632 1.632 0 0 0-.616.059c-.43.151-.837.458-1.12.875a.5.5 0 0 1-.84-.528c.365-.58.918-.98 1.488-1.08a1.956 1.956 0 0 1 1.25.105c.48.21.84.664.95 1.242.096.536-.01 1.077-.306 1.484-.286.393-.728.6-1.173.6a3.296 3.296 0 0 1-1.39-.31c-.347-.132-.712-.3-1.07-.487a22.253 22.253 0 0 1-1.265-.724 23.454 23.454 0 0 1-1.92 1.196c-.347.185-.688.35-1.02.493-.418.18-1.083.42-1.748.42a1.76 1.76 0 0 1-1.04-.306zM7.31 9.497c-.15.385-.31.815-.47 1.263-.1.284-.2.57-.3.856.326.135.65.285.968.448.225-.438.441-.884.646-1.332.203-.44.385-.86.53-1.238a16.892 16.892 0 0 0-1.374-.002V9.497zm.582-4.148c-.08-.225-.213-.396-.34-.45a.144.144 0 0 0-.131.01.272.272 0 0 0-.095.143c-.046.168-.029.467.042.842.062.33.15.652.261.942a4.931 4.931 0 0 0 .313-1.18c.006-.118.006-.23 0-.307zM5.38 12.875c.29-.126.6-.264.92-.416-.36-.2-.717-.42-1.053-.655-.306-.215-.558-.415-.718-.58-.094.137-.156.29-.17.432-.016.16.035.315.144.407.13.111.319.162.535.162.13 0 .25-.01.341-.05z" />
                                                </svg>
                                                Lista PDF
                                            </button>
                                            <button
                                                class="btn btn-outline-success fw-bold rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 bg-white"
                                                @click="baixarListaExcel(exSelecionada)"
                                                :disabled="exSelecionada.usuarios.length === 0 || !exSelecionada.guiaId">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                                    <path
                                                        d="M4.636 6.607h1.568L8 9.42l1.796-2.813h1.568L8.85 10.422l2.673 4.195H9.955L8 11.583l-1.955 3.034H4.477l2.673-4.195L4.636 6.607z" />
                                                </svg>
                                                Lista Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="!exSelecionada.guiaId"
                                class="alert alert-danger bg-danger bg-opacity-10 text-danger border-0 small fw-bold py-3 px-4 text-center mb-4 rounded-4 shadow-sm d-flex align-items-center justify-content-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                Vincule um Guia em "Editar Parâmetros da Viagem" para liberar os downloads das listas.
                            </div>

                            <div class="border border-light rounded-4 overflow-hidden bg-white shadow-sm">
                                <div class="scrollable-table-container">
                                    <table class="table table-hover align-middle mb-0 table-fixed-header">
                                        <thead class="text-muted small text-uppercase">
                                            <tr>
                                                <th class="ps-4 py-3 border-0 text-start fw-bold" style="width: 40%;">
                                                    Nome do Passageiro</th>
                                                <th class="py-3 border-0 text-center fw-bold" style="width: 25%;">CPF
                                                </th>
                                                <th v-if="exSelecionada.aplicarParcelas"
                                                    class="py-3 border-0 text-center fw-bold text-brand"
                                                    style="width: 20%;">Pagamento</th>
                                                <th class="pe-4 py-3 border-0 text-center fw-bold" style="width: 15%;">
                                                    Remover</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="p in exSelecionada.usuarios" :key="p.id" class="table-row-hover">
                                                <td class="ps-4 py-3 fw-bold text-dark small text-start">{{ p.nome }}
                                                </td>
                                                <td class="text-muted fw-semibold small py-3 text-center">{{ p.cpf ||
                                                    '-' }}</td>
                                                <td v-if="exSelecionada.aplicarParcelas"
                                                    class="fw-bold text-brand small py-3 text-center">
                                                    <div class="cursor-pointer d-inline-block bg-primary bg-opacity-10 px-3 py-1 rounded-pill"
                                                        @click="abrirModalPagamento(p, exSelecionada)"
                                                        title="Alterar Pagamento">
                                                        {{ obterPagamento(exSelecionada, p.id) }}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                            fill="currentColor" class="ms-1" viewBox="0 0 16 16">
                                                            <path
                                                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                        </svg>
                                                    </div>
                                                </td>
                                                <td class="pe-4 py-3 text-center">
                                                    <button
                                                        class="btn btn-sm bg-danger bg-opacity-10 text-danger border-0 rounded-circle d-inline-flex align-items-center justify-content-center mx-auto action-btn"
                                                        style="width: 32px; height: 32px;"
                                                        @click="removerUserDaEx(p.id, exSelecionada.id)"
                                                        title="Remover da Viagem">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                            fill="currentColor" viewBox="0 0 16 16">
                                                            <path
                                                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr v-if="exSelecionada.usuarios.length === 0">
                                                <td colspan="4" class="text-center text-muted py-5 fw-semibold">Nenhum
                                                    passageiro vinculado a esta viagem ainda.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer p-4 bg-white border-top border-light d-flex gap-2 rounded-bottom-5">
                            <button
                                class="btn btn-outline-brand fw-bold w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 bg-white"
                                @click="prepararEdicaoEx(exSelecionada)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                                Editar Parâmetros da Viagem
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalGrupos" class="modal fade show d-block" style="background: rgba(0,0,0,0.6); z-index: 1055;">
                <div class="modal-dialog modal-lg modal-dialog-scrollable px-2">
                    <div class="modal-content shadow-lg border-0 rounded-5 bg-light">
                        <div
                            class="modal-header bg-white p-4 p-md-5 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5
                                class="modal-title fw-bold text-dark fs-4 d-flex align-items-center gap-2 m-0 tracking-tight">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                    class="text-brand" viewBox="0 0 16 16">
                                    <path
                                        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    <path fill-rule="evenodd"
                                        d="M5.25 1.5A.75.75 0 0 1 6 2.25v2.5h2.5a.75.75 0 0 1 0 1.5H6v2.5a.75.75 0 0 1-1.5 0v-2.5H2a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 .75-.75z" />
                                </svg>
                                Gerenciar Grupos
                            </h5>
                            <button class="btn-close m-0" @click="modalGrupos = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5 bg-surface">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <p class="small text-muted mb-0 fw-semibold">Líderes e seus dependentes vinculados.</p>
                                <button
                                    class="btn btn-brand fw-bold rounded-pill px-4 py-2 shadow-soft d-flex align-items-center gap-2"
                                    @click="abrirModalAgrupar">
                                    Novo Grupo
                                </button>
                            </div>

                            <div class="d-flex flex-column gap-3 scrollable-table-container">
                                <div v-if="Object.keys(exSelecionada.grupos || {}).length === 0"
                                    class="text-center p-5 bg-white rounded-4 border border-light">
                                    <p class="text-muted mb-0 fw-bold">Nenhum grupo familiar configurado ainda.</p>
                                    <p class="small text-muted mt-1">Todos os passageiros receberão contratos
                                        individuais.</p>
                                </div>
                                <div v-for="(dependentes, liderId) in (exSelecionada.grupos || {})" :key="liderId"
                                    class="p-4 bg-brand-light border border-light rounded-4 position-relative shadow-sm">
                                    <button
                                        class="btn btn-light text-danger position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center action-btn"
                                        style="width: 36px; height: 36px;" @click="removerGrupo(liderId)"
                                        title="Desfazer Grupo">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                            fill="currentColor" viewBox="0 0 16 16">

                                            <path
                                                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />

                                        </svg>

                                    </button>
                                    <div class="fw-bold text-brand mb-2 fs-6 d-flex align-items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" viewBox="0 0 16 16">
                                            <path
                                                d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        </svg>
                                        Líder: {{ getNomeUser(liderId) }}
                                    </div>
                                    <div class="small text-dark fw-bold mb-2 ps-4">Acompanhantes (Dependentes):</div>
                                    <ul class="mb-0 ps-5 small text-muted fw-semibold">
                                        <li v-for="depId in dependentes" :key="depId" class="mb-1">{{ getNomeUser(depId)
                                            }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-white p-4 border-top border-light rounded-bottom-5">
                            <button class="btn btn-light fw-bold px-4 py-3 rounded-pill w-100"
                                @click="modalGrupos = false">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalConfirmarContratos" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); z-index: 1060;">
                <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 500px;">
                    <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                        <div
                            class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold fs-5 text-dark m-0">Atenção antes de gerar</h5>
                            <button class="btn-close m-0" @click="modalConfirmarContratos = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5 text-center">
                            <div class="text-brand mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                                </svg>
                            </div>
                            <h5 class="fw-bold text-dark mb-3 fs-5">Todos os grupos familiares foram formados?</h5>
                            <p class="text-muted fw-semibold small mb-4">Lembre-se: Passageiros que estão agrupados
                                sairão juntos no mesmo contrato do Líder da família.</p>

                            <div class="d-flex flex-column gap-2">
                                <button class="btn btn-outline-brand fw-bold rounded-pill py-3 w-100 mb-3 bg-white"
                                    @click="abrirModalGrupos(exSelecionada); modalConfirmarContratos = false">
                                    Voltar e Revisar Grupos
                                </button>
                                <button
                                    class="btn btn-danger fw-bold rounded-pill py-3 shadow-soft w-100 d-flex justify-content-center align-items-center gap-2"
                                    @click="executarGeracaoContratos('pdf')">
                                    📄 Sim, Gerar em PDF
                                </button>
                                <button
                                    class="btn btn-brand fw-bold rounded-pill py-3 shadow-soft w-100 d-flex justify-content-center align-items-center gap-2"
                                    @click="executarGeracaoContratos('doc')">
                                    📄 Sim, Gerar em DOC
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalAgrupar" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); z-index: 1070;">
                <div class="modal-dialog modal-dialog-centered px-2">
                    <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                        <div
                            class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold fs-5 text-dark m-0">Criar Grupo Familiar</h5>
                            <button class="btn-close m-0" @click="modalAgrupar = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5">
                            <label class="form-label small fw-bold text-brand mb-2">1. Escolha o Líder (Contratante
                                principal)</label>
                            <select v-model="formGrupo.liderId"
                                class="form-select form-select-lg bg-light border-0 fw-bold text-dark mb-4 py-2"
                                @change="buscaDependente = ''">
                                <option :value="null">-- Selecione --</option>
                                <option v-for="u in exSelecionada.usuarios" :key="u.id" :value="u.id">{{ u.nome }}
                                </option>
                            </select>

                            <label v-if="formGrupo.liderId" class="form-label small fw-bold text-success mb-2">2.
                                Escolha os Dependentes</label>
                            <div v-if="formGrupo.liderId">
                                <div class="position-relative mb-3 input-search-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                                        class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                    <input v-model="buscaDependente" type="text"
                                        class="form-control bg-light border-0 rounded-pill pe-4 ps-5 py-2 fw-semibold"
                                        placeholder="Buscar por nome...">
                                    <button v-if="buscaDependente" type="button"
                                        class="btn-close position-absolute top-50 end-0 translate-middle-y me-3"
                                        style="font-size: 0.6rem;" @click="buscaDependente = ''"></button>
                                </div>
                                <div class="border border-light rounded-4 p-3 bg-white shadow-sm scrollable-table-container"
                                    style="min-height: 150px; max-height: 250px;">
                                    <div v-for="u in usuariosPossiveisDependentes" :key="u.id"
                                        class="form-check mb-3 custom-checkbox-wrapper">
                                        <input class="form-check-input shadow-none fs-5" type="checkbox" :value="u.id"
                                            :id="'dep_' + u.id" v-model="formGrupo.dependentes">
                                        <label class="form-check-label fw-bold text-dark mt-1 ms-2 cursor-pointer"
                                            :for="'dep_' + u.id">{{ u.nome }}</label>
                                    </div>
                                    <div v-if="usuariosPossiveisDependentes.length === 0"
                                        class="small text-muted text-center py-4 fw-semibold">Nenhum passageiro
                                        disponível.</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light p-3 border-top border-light rounded-bottom-5">
                            <button class="btn btn-brand w-100 py-3 rounded-pill fw-bold shadow-soft"
                                @click="salvarGrupo">Confirmar Grupo</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalPagamento" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); z-index: 1070;">
                <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 450px;">
                    <div class="modal-content shadow-lg border-0 rounded-5 bg-white">
                        <div
                            class="modal-header bg-light p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold fs-5 text-dark m-0">Alterar Pagamento</h5>
                            <button class="btn-close m-0" @click="modalPagamento = false"></button>
                        </div>
                        <div class="modal-body p-4 p-md-5 text-center">
                            <div class="mb-4">
                                <span
                                    class="badge bg-primary bg-opacity-10 text-brand px-3 py-2 rounded-pill fw-bold mb-3 fs-6">{{
                                    usuarioPagamento?.nome }}</span>
                            </div>
                            <label class="form-label small fw-bold text-muted mb-2">Nova opção de parcela:</label>
                            <select v-model="novoPagamento"
                                class="form-select form-select-lg bg-light border-0 fw-bold text-dark mb-2 py-3 text-center rounded-4">
                                <option value="">-- Pendente / À Combinar --</option>
                                <option v-for="(v, i) in exSelecionada.valores" :key="i"
                                    :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor }}</option>
                            </select>
                        </div>
                        <div class="modal-footer bg-white p-4 border-top border-light rounded-bottom-5">
                            <button class="btn btn-brand w-100 py-3 rounded-pill fw-bold shadow-soft"
                                @click="salvarPagamentoUsuario">Salvar Alteração</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalAvisoContrato" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); z-index: 1080;">
                <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 400px;">
                    <div class="modal-content shadow-lg border-0 rounded-5">
                        <div class="modal-body p-4 p-md-5 text-center bg-white rounded-5">
                            <div class="text-warning mb-4 d-flex justify-content-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                            </div>
                            <h5 class="fw-bold text-dark mb-2 fs-4 tracking-tight">Faltam Informações</h5>
                            <p class="text-muted fw-semibold small mb-4">Acesse <b class="text-brand">Editar Dados da
                                    Viagem</b> e preencha os Parâmetros do Contrato (Datas, Transporte, etc) antes de
                                baixar.</p>
                            <button class="btn btn-warning fw-bold w-100 rounded-pill py-3 shadow-sm text-dark fs-6"
                                @click="modalAvisoContrato = false">Entendi</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="modalVincular" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-dialog-centered px-2">
                    <div class="modal-content shadow-lg border-0 rounded-5 bg-light">
                        <div
                            class="modal-header bg-white p-4 border-bottom border-light rounded-top-5 d-flex justify-content-between align-items-center">
                            <h5 class="modal-title fw-bold fs-5 text-dark m-0">Adicionar <span class="text-brand">{{
                                    userParaVincular.nome }}</span></h5>
                            <button class="btn-close m-0" @click="fecharModalVincular"></button>
                        </div>
                        <div class="modal-body p-4 bg-white">
                            <div v-if="!excursaoSendoVinculada && !excursaoVinculada">
                                <p class="text-muted fw-bold mb-4 text-center">Selecione a viagem destino:</p>
                                <div class="d-flex flex-column gap-3">
                                    <button v-for="e in excursoes" :key="e.id"
                                        @click="selecionarExcursaoParaVincular(e)"
                                        class="btn btn-white text-start p-4 rounded-4 border border-light shadow-hover d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center bg-white"
                                        :disabled="e._count.usuarios >= e.vagas">
                                        <div>
                                            <strong class="text-dark fs-5 d-block mb-1">{{ e.nome }}</strong>
                                            <small class="text-brand fw-semibold">{{ e.lugar }}</small>
                                        </div>
                                        <span class="badge mt-3 mt-sm-0 rounded-pill px-4 py-2 fs-6"
                                            :class="e._count.usuarios >= e.vagas ? 'bg-danger' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'">{{
                                            e._count.usuarios }}/{{ e.vagas }} vagas</span>
                                    </button>
                                </div>
                            </div>
                            <div v-if="excursaoSendoVinculada && !excursaoVinculada" class="text-center py-3">
                                <h6 class="fw-bold mb-4 text-dark fs-5">Definir Pagamento: <span
                                        class="text-brand d-block mt-2">{{ userParaVincular.nome }}</span></h6>
                                <div class="p-4 bg-light rounded-4 border border-light mb-4">
                                    <label class="form-label fw-semibold text-muted mb-3">Escolha a parcela para este
                                        passageiro:</label>
                                    <select v-model="opcaoPagamentoMain"
                                        class="form-select form-select-lg border-0 fw-bold text-dark bg-white shadow-sm rounded-3 py-3 text-center">
                                        <option value="">-- À Combinar --</option>
                                        <option v-for="(v, i) in excursaoSendoVinculada.valores" :key="i"
                                            :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor }}
                                        </option>
                                    </select>
                                </div>
                                <div class="d-flex gap-3">
                                    <button
                                        class="btn btn-light fw-bold flex-fill py-3 rounded-pill border border-light"
                                        @click="excursaoSendoVinculada = null">Voltar</button>
                                    <button class="btn btn-brand fw-bold flex-fill py-3 rounded-pill shadow-soft"
                                        @click="vincularMainUser(userParaVincular.id, excursaoSendoVinculada)">Confirmar
                                        Inscrição</button>
                                </div>
                            </div>
                            <div v-if="excursaoVinculada">
                                <div v-if="!parenteSendoVinculado">
                                    <div
                                        class="alert alert-success bg-success bg-opacity-10 border-0 text-success py-4 mb-4 fw-bold text-center rounded-4 shadow-sm fs-5">
                                        ✔ Passageiro Adicionado!
                                    </div>
                                    <div v-if="parentesDoUsuarioSelecionado.length > 0">
                                        <h6 class="fw-bold mb-4 text-dark text-center">Deseja adicionar o grupo familiar
                                            também?</h6>
                                        <div class="d-flex flex-column gap-3 scrollable-table-container">
                                            <div v-for="parente in parentesDoUsuarioSelecionado" :key="parente.id"
                                                class="p-3 p-md-4 bg-white rounded-4 shadow-sm border border-light d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
                                                :class="{ 'border-success bg-success bg-opacity-10': parentesAdicionadosNaSessao.includes(parente.id) }">
                                                <div>
                                                    <span class="fw-bold fs-6 d-block mb-1"
                                                        :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'text-success' : 'text-dark'">{{
                                                        parente.nome }}</span>
                                                    <small class="text-muted fw-semibold">CPF: {{ parente.cpf || '-'
                                                        }}</small>
                                                </div>
                                                <button
                                                    class="btn fw-bold rounded-pill px-4 py-2 w-100 w-sm-auto shadow-sm"
                                                    :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'btn-success' : 'btn-outline-brand bg-white'"
                                                    :disabled="parentesAdicionadosNaSessao.includes(parente.id)"
                                                    @click="iniciarVinculoParente(parente)">
                                                    {{ parentesAdicionadosNaSessao.includes(parente.id) ? '✔ Inserido' :
                                                    'Adicionar' }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="parenteSendoVinculado" class="text-center py-3">
                                    <h6 class="fw-bold mb-4 text-dark fs-5">Definir Pagamento: <span
                                            class="text-brand d-block mt-2">{{ parenteSendoVinculado.nome }}</span></h6>
                                    <div class="p-4 bg-light rounded-4 border border-light mb-4">
                                        <label class="form-label fw-semibold text-muted mb-3">Selecione a parcela para o
                                            dependente:</label>
                                        <select v-model="opcaoPagamentoParente"
                                            class="form-select form-select-lg border-0 fw-bold text-dark bg-white shadow-sm rounded-3 py-3 text-center">
                                            <option value="">-- À Combinar --</option>
                                            <option v-for="(v, i) in excursaoVinculada.valores" :key="i"
                                                :value="`${v.vezes}x de R$ ${v.valor}`">{{ v.vezes }}x de R$ {{ v.valor
                                                }}</option>
                                        </select>
                                    </div>
                                    <div class="d-flex gap-3">
                                        <button
                                            class="btn btn-light fw-bold flex-fill py-3 rounded-pill border border-light"
                                            @click="parenteSendoVinculado = null">Cancelar</button>
                                        <button class="btn btn-brand fw-bold flex-fill py-3 rounded-pill shadow-soft"
                                            @click="confirmarVinculoParente">Confirmar Vínculo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light p-4 border-top border-light rounded-bottom-5"
                            v-if="excursaoVinculada && !parenteSendoVinculado">
                            <button class="btn btn-brand w-100 py-3 rounded-pill fw-bold shadow-soft fs-5"
                                @click="fecharModalVincular">Concluir Processo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const toasts = ref([])
const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 4000)
}
const removerToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id) }

const modalConfirm = ref(false)
const confirmType = ref('')
const confirmId = ref(null)
const confirmTitle = ref('')
const confirmText = ref('')
const pedirConfirmacao = (tipo, id, titulo, texto) => { confirmType.value = tipo; confirmId.value = id; confirmTitle.value = titulo; confirmText.value = texto; modalConfirm.value = true }
const executarConfirmacao = async () => { modalConfirm.value = false; if (confirmType.value === 'excursao') { await confirmarDelecaoExcursao(confirmId.value) } else if (confirmType.value === 'user') { await confirmarDelecaoUser(confirmId.value) } }

const logado = ref(false)
const senha = ref('')
const erroLogin = ref('')
onMounted(() => { if (import.meta.client && localStorage.getItem('graziTurAdmin') === 'true') { logado.value = true; carregar() } })
const fazerLogin = async () => { try { await $fetch('/api/auth', { method: 'POST', body: { password: senha.value } }); logado.value = true; if (import.meta.client) localStorage.setItem('graziTurAdmin', 'true'); await carregar() } catch (e) { erroLogin.value = e.data?.message || 'Senha incorreta.' } }
const fazerLogout = () => { logado.value = false; senha.value = ''; if (import.meta.client) localStorage.removeItem('graziTurAdmin'); usuarios.value = []; excursoes.value = [] }

const usuarios = ref([])
const excursoes = ref([])
const buscaUser = ref('')
const modalCriarExcursao = ref(false)
const modalGerenciarEx = ref(false)
const modalVincular = ref(false)
const modalUser = ref(false)
const formEx = ref({ id: null, nome: '', lugar: '', vagas: '', guiaId: null, valores: [], ativarContrato: false, aplicarParcelas: false, detalhes: { dataSaida: '', horaSaida: '', dataRetorno: '', horaRetorno: '', transporte: '', empresa: '', roteiro: '' } })
const exSelecionada = ref(null)

const excursaoSendoVinculada = ref(null)
const opcaoPagamentoMain = ref('')
const parenteSendoVinculado = ref(null)
const opcaoPagamentoParente = ref('')

const modalPagamento = ref(false)
const usuarioPagamento = ref(null)
const novoPagamento = ref('')

const modalGrupos = ref(false)
const modalAgrupar = ref(false)
const modalAvisoContrato = ref(false)
const modalConfirmarContratos = ref(false)
const formGrupo = ref({ liderId: null, dependentes: [] })
const buscaDependente = ref('')

const userParaVincular = ref(null)
const excursaoVinculada = ref(null)
const parentesAdicionadosNaSessao = ref([])
const ignorarRegras = ref(false)
const formUser = ref({ id: null, nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] })
const buscaParenteModal = ref('')
const novoValor = ref('')
const novasVezes = ref('')

const mascaraData = (v) => { if (!v) return ''; v = v.replace(/\D/g, ''); if (v.length >= 5) return v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3'); if (v.length >= 3) return v.replace(/(\d{2})(\d{1,4})/, '$1/$2'); return v; }
const mascaraHora = (v) => { if (!v) return ''; v = v.replace(/\D/g, ''); if (v.length > 4) v = v.substring(0, 4); if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, '$1:$2'); return v; }
const obterPagamento = (excursao, pId) => { if (!excursao || !excursao.pagamentos) return 'Pendente'; return excursao.pagamentos[pId] || 'Pendente'; }
const getNomeUser = (id) => { const u = exSelecionada.value?.usuarios.find(x => String(x.id) === String(id)); return u ? u.nome : 'Desconhecido'; }

const usuariosPossiveisDependentes = computed(() => {
    if (!exSelecionada.value || !formGrupo.value.liderId) return [];
    const idsJaEmGrupo = new Set();
    Object.values(exSelecionada.value.grupos || {}).forEach(arr => arr.forEach(i => idsJaEmGrupo.add(String(i))));
    let lista = exSelecionada.value.usuarios.filter(u => String(u.id) !== String(formGrupo.value.liderId) && !idsJaEmGrupo.has(String(u.id)) && u.id !== exSelecionada.value.guiaId);
    if (buscaDependente.value) {
        lista = lista.filter(u => u.nome.toLowerCase().includes(buscaDependente.value.toLowerCase()));
    }
    return lista;
})

const adicionarValorExcursao = () => { if (novoValor.value && novasVezes.value) { formEx.value.valores = [...(formEx.value.valores || []), { valor: parseFloat(novoValor.value), vezes: parseInt(novasVezes.value) }]; novoValor.value = ''; novasVezes.value = '' } }
const removerValorExcursao = (index) => { formEx.value.valores = formEx.value.valores.filter((_, i) => i !== index) }

const formatarData = (event) => { let v = event.target.value.replace(/\D/g, ''); if (v.length >= 5) { v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3') } else if (v.length >= 3) { v = v.replace(/(\d{2})(\d{1,4})/, '$1/$2') } formUser.value.nascimento = v }
const validarCPF = (cpf) => { if (!cpf) return true; cpf = cpf.replace(/[^\d]+/g, ''); if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; let soma = 0, resto; for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i); resto = (soma * 10) % 11; if (resto === 10 || resto === 11) resto = 0; if (resto !== parseInt(cpf.substring(9, 10))) return false; soma = 0; for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i); resto = (soma * 10) % 11; if (resto === 10 || resto === 11) resto = 0; if (resto !== parseInt(cpf.substring(10, 11))) return false; return true }

const carregar = async () => {
    const timestamp = new Date().getTime()
    usuarios.value = await $fetch(`/api/users?t=${timestamp}`)
    const resExcursoes = await $fetch(`/api/excursoes?includeUsers=true&t=${timestamp}`)
    excursoes.value = resExcursoes.map(ex => {
        let val = []; let pags = {}; let det = {}; let grp = {};
        if (ex.valores) { try { val = typeof ex.valores === 'string' ? JSON.parse(ex.valores) : ex.valores } catch (e) { } }
        if (ex.pagamentosJson) { try { pags = JSON.parse(ex.pagamentosJson) } catch (e) { } }
        if (ex.contratoDetalhes) { try { det = JSON.parse(ex.contratoDetalhes) } catch (e) { } }
        if (ex.contratoGrupos) { try { grp = JSON.parse(ex.contratoGrupos) } catch (e) { } }
        return { ...ex, valores: Array.isArray(val) ? val : [], pagamentos: pags, detalhes: det, grupos: grp }
    })
    if (exSelecionada.value) { const atualizada = excursoes.value.find(e => e.id === exSelecionada.value.id); if (atualizada) exSelecionada.value = atualizada }
}

const usuariosFiltrados = computed(() => { if (!buscaUser.value) return usuarios.value; return usuarios.value.filter(u => u.nome.toLowerCase().includes(buscaUser.value.toLowerCase()) || (u.cpf && u.cpf.includes(buscaUser.value))) })
const guiasDisponiveis = computed(() => usuarios.value.filter(u => u.isGuia))

const abrirModalExcursao = () => { formEx.value = { id: null, nome: '', lugar: '', vagas: '', guiaId: null, valores: [], ativarContrato: false, aplicarParcelas: false, detalhes: { dataSaida: '', horaSaida: '', dataRetorno: '', horaRetorno: '', transporte: '', empresa: '', roteiro: '' } }; modalCriarExcursao.value = true }

const salvarExcursao = async () => {
    if (!formEx.value.nome || !formEx.value.lugar || !formEx.value.vagas || !formEx.value.valores || formEx.value.valores.length === 0) { showToast('Título, Destino, Qtd Vagas e pelo menos 1 Opção de Pagamento são obrigatórios!', 'warning'); return; }
    const method = formEx.value.id ? 'PUT' : 'POST'; const url = formEx.value.id ? `/api/excursoes/${formEx.value.id}` : '/api/excursoes'
    const payload = { ...formEx.value, valores: JSON.stringify(formEx.value.valores || []), ativarContrato: formEx.value.ativarContrato, aplicarParcelas: formEx.value.aplicarParcelas, contratoDetalhes: JSON.stringify(formEx.value.detalhes || {}) }
    try { await $fetch(url, { method, body: payload }); showToast('Sucesso!', 'success'); fecharExcursao(); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}

const confirmarDelecaoExcursao = async (id) => { try { await $fetch(`/api/excursoes/${id}`, { method: 'DELETE' }); showToast('Apagado!', 'success'); fecharExcursao(); await carregar() } catch (e) { showToast('Erro!', 'danger') } }
const abrirGerenciarExcursao = (ex) => { exSelecionada.value = excursoes.value.find(e => e.id === ex.id); modalGerenciarEx.value = true }
const fecharExcursao = () => { modalCriarExcursao.value = false; modalGerenciarEx.value = false }
const prepararEdicaoEx = (ex) => { formEx.value = { ...ex, valores: ex.valores ? [...ex.valores] : [], ativarContrato: ex.ativarContrato || false, aplicarParcelas: ex.aplicarParcelas || false, detalhes: ex.detalhes ? { ...ex.detalhes } : { dataSaida: '', horaSaida: '', dataRetorno: '', horaRetorno: '', transporte: '', empresa: '', roteiro: '' } }; modalGerenciarEx.value = false; modalCriarExcursao.value = true }

const prepararNovoUser = () => { ignorarRegras.value = false; formUser.value = { id: null, nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] }; buscaParenteModal.value = ''; modalUser.value = true }
const prepararEdicaoUser = (u) => { ignorarRegras.value = false; const listaBruta = [...(u.parentes || []), ...(u.parentesDe || [])]; const listaParentes = [...new Map(listaBruta.map(item => [item.id, item])).values()]; formUser.value = { id: u.id, nome: u.nome, email: u.email, cpf: u.cpf, orgaoExpeditor: u.orgaoExpeditor, nascimento: u.nascimento, celular: u.celular, idade: u.idade, cidade: u.cidade, endereco: u.endereco, isGuia: u.isGuia, parentesSelecionados: listaParentes }; buscaParenteModal.value = ''; modalUser.value = true }
const salvarUser = async () => { if (!ignorarRegras.value) { const campos = ['nome', 'email', 'cpf', 'nascimento', 'orgaoExpeditor', 'celular', 'cidade', 'endereco']; if (campos.some(c => !formUser.value[c])) { showToast("Preencha os campos obrigatórios (*).", "warning"); return } if (formUser.value.cpf && !validarCPF(formUser.value.cpf)) { showToast("CPF inválido!", "danger"); return } } else { if (!formUser.value.nome) { showToast("O Nome é obrigatório!", "warning"); return } } const payload = { ...formUser.value, parentesIds: formUser.value.parentesSelecionados.map(p => p.id) }; const method = formUser.value.id ? 'PUT' : 'POST'; const url = formUser.value.id ? `/api/users/${formUser.value.id}` : '/api/users'; try { await $fetch(url, { method, body: payload }); showToast('Salvo!', 'success'); modalUser.value = false; await carregar() } catch (e) { showToast('Erro!', 'danger') } }
const confirmarDelecaoUser = async (id) => { try { await $fetch(`/api/users/${id}`, { method: 'DELETE' }); showToast('Removido!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') } }

const usuariosParaParenteFiltrados = computed(() => { if (!buscaParenteModal.value) return []; return usuarios.value.filter(u => u.id !== formUser.value.id && u.nome.toLowerCase().includes(buscaParenteModal.value.toLowerCase())).map(u => ({ ...u, jaAdicionado: formUser.value.parentesSelecionados.some(p => p.id === u.id) })).slice(0, 5) })
const adicionarParenteNoForm = (user) => { if (!formUser.value.parentesSelecionados.some(p => p.id === user.id)) { formUser.value.parentesSelecionados = [...formUser.value.parentesSelecionados, user]; } }
const removerParenteDoForm = (index) => { formUser.value.parentesSelecionados.splice(index, 1) }

const parentesDoUsuarioSelecionado = computed(() => { if (!userParaVincular.value) return []; const listaBruta = [...(userParaVincular.value.parentes || []), ...(userParaVincular.value.parentesDe || [])]; const listaUnica = [...new Map(listaBruta.map(item => [item.id, item])).values()]; return listaUnica.map(p => ({ ...p, adicionado: false })) })
const abrirVincular = (u) => { userParaVincular.value = u; excursaoVinculada.value = null; excursaoSendoVinculada.value = null; opcaoPagamentoMain.value = ''; parenteSendoVinculado.value = null; opcaoPagamentoParente.value = ''; parentesAdicionadosNaSessao.value = []; modalVincular.value = true }
const fecharModalVincular = () => { modalVincular.value = false; excursaoVinculada.value = null; excursaoSendoVinculada.value = null; parenteSendoVinculado.value = null; carregar() }

const selecionarExcursaoParaVincular = (e) => { excursaoSendoVinculada.value = e; opcaoPagamentoMain.value = ''; if (!e.aplicarParcelas) vincularMainUser(userParaVincular.value.id, e) }
const vincularMainUser = async (userId, excursao) => { const op = excursao.aplicarParcelas ? opcaoPagamentoMain.value : null; if (excursao.aplicarParcelas && !op && userId !== excursao.guiaId) { showToast('Selecione a parcela!', 'warning'); return } if (excursao.guiaId === userId) { showToast('Guia da viagem!', 'warning'); return } try { await $fetch('/api/vincular', { method: 'POST', body: { userId, excursaoId: excursao.id, opcaoPagamento: op } }); excursaoVinculada.value = excursao; showToast('Adicionado!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') } }
const iniciarVinculoParente = (parente) => { if (excursaoVinculada.value.aplicarParcelas && parente.id !== excursaoVinculada.value.guiaId) { parenteSendoVinculado.value = parente; opcaoPagamentoParente.value = ''; } else { vincularParente(parente, excursaoVinculada.value.id, null); } }
const confirmarVinculoParente = () => { if (!opcaoPagamentoParente.value) { showToast('Selecione a parcela para o parente!', 'warning'); return; } vincularParente(parenteSendoVinculado.value, excursaoVinculada.value.id, opcaoPagamentoParente.value); }
const vincularParente = async (parente, excursaoId, opcaoPag) => { const op = opcaoPag || null; if (parentesAdicionadosNaSessao.value.includes(parente.id)) return; if (excursaoVinculada.value && excursaoVinculada.value.guiaId === parente.id) { showToast('É o Guia!', 'warning'); return } try { await $fetch('/api/vincular', { method: 'POST', body: { userId: parente.id, excursaoId, opcaoPagamento: op } }); parentesAdicionadosNaSessao.value.push(parente.id); parenteSendoVinculado.value = null; opcaoPagamentoParente.value = ''; showToast('Adicionado!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') } }
const removerUserDaEx = async (userId, excursaoId) => { try { await $fetch('/api/desvincular', { method: 'POST', body: { userId, excursaoId } }); await carregar(); showToast('Removido!', 'success') } catch (e) { showToast('Erro!', 'danger') } }

const abrirModalPagamento = (user, ex) => { usuarioPagamento.value = user; const atual = obterPagamento(ex, user.id); novoPagamento.value = atual === 'Pendente' ? '' : atual; modalPagamento.value = true; }
const salvarPagamentoUsuario = async () => { const ex = exSelecionada.value; const pags = { ...ex.pagamentos }; if (novoPagamento.value) { pags[usuarioPagamento.value.id] = novoPagamento.value; } else { delete pags[usuarioPagamento.value.id]; } const payload = { ...ex, valores: JSON.stringify(ex.valores || []), pagamentosJson: JSON.stringify(pags), contratoDetalhes: JSON.stringify(ex.detalhes || {}), contratoGrupos: JSON.stringify(ex.grupos || {}) }; try { await $fetch(`/api/excursoes/${ex.id}`, { method: 'PUT', body: payload }); showToast('Pagamento atualizado!', 'success'); modalPagamento.value = false; await carregar(); } catch (e) { showToast('Erro.', 'danger'); } }

const abrirModalGrupos = (excursao) => { exSelecionada.value = excursao; modalGrupos.value = true; }
const abrirModalAgrupar = () => { formGrupo.value = { liderId: null, dependentes: [] }; buscaDependente.value = ''; modalAgrupar.value = true; }
const salvarGrupo = async () => { if (!formGrupo.value.liderId || formGrupo.value.dependentes.length === 0) { showToast('Selecione o líder e os dependentes.', 'warning'); return; } const novosGrupos = { ...(exSelecionada.value.grupos || {}) }; novosGrupos[String(formGrupo.value.liderId)] = formGrupo.value.dependentes.map(String); const payload = { ...exSelecionada.value, valores: JSON.stringify(exSelecionada.value.valores), contratoDetalhes: JSON.stringify(exSelecionada.value.detalhes || {}), contratoGrupos: JSON.stringify(novosGrupos) }; try { await $fetch(`/api/excursoes/${exSelecionada.value.id}`, { method: 'PUT', body: payload }); showToast('Grupo criado!', 'success'); modalAgrupar.value = false; await carregar(); } catch (e) { showToast('Erro ao agrupar.', 'danger'); } }
const removerGrupo = async (liderId) => { const novosGrupos = { ...(exSelecionada.value.grupos || {}) }; delete novosGrupos[String(liderId)]; const payload = { ...exSelecionada.value, valores: JSON.stringify(exSelecionada.value.valores), contratoDetalhes: JSON.stringify(exSelecionada.value.detalhes || {}), contratoGrupos: JSON.stringify(novosGrupos) }; try { await $fetch(`/api/excursoes/${exSelecionada.value.id}`, { method: 'PUT', body: payload }); showToast('Grupo removido!', 'success'); await carregar(); } catch (e) { showToast('Erro.', 'danger'); } }

const iniciarGeracaoContratos = (ex) => {
    const det = ex.detalhes || {};
    if (!det.dataSaida || !det.horaSaida || !det.dataRetorno || !det.transporte || !det.empresa || !det.roteiro) {
        modalAvisoContrato.value = true;
        return;
    }
    modalConfirmarContratos.value = true;
}

const executarGeracaoContratos = (tipo) => {
    modalConfirmarContratos.value = false;
    gerarContratos(tipo);
}

const gerarHtmlContratosGeral = (tipo) => {
    const pageBreak = tipo === 'pdf' ? `<div class="html2pdf__page-break"></div>` : `<br clear="all" style="page-break-before:always" />`;

    let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Contratos - ${exSelecionada.value.nome}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px;}
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .justify { text-align: justify; }
        .clause-block { page-break-inside: avoid; margin-bottom: 12px; }
        .signature-block { page-break-inside: avoid; margin-top: 30px; }
    </style></head><body>`;

    const ex = exSelecionada.value;
    const det = ex.detalhes || {};
    const grupos = ex.grupos || {};

    const dependentesIdsSet = new Set();
    Object.values(grupos).forEach(arr => arr.forEach(id => dependentesIdsSet.add(String(id))));

    const lideres = ex.usuarios.filter(u => u.id !== ex.guiaId && !dependentesIdsSet.has(String(u.id)));

    if (lideres.length === 0) { showToast('Nenhum passageiro válido para gerar contrato.', 'warning'); return ''; }

    lideres.forEach((lider, index) => {
        const idsDependentes = (grupos[String(lider.id)] || []).map(String);
        const dependentesObjs = ex.usuarios.filter(u => idsDependentes.includes(String(u.id)));
        const grupoFamiliar = [lider, ...dependentesObjs];

        let tabelaHTML = `<table><tr><th>Nome Completo</th><th>Nascimento</th><th>CPF</th><th>Pagamento</th></tr>`;
        grupoFamiliar.forEach(m => {
            const pagamentoStr = ex.aplicarParcelas ? obterPagamento(ex, m.id) : 'À combinar';
            tabelaHTML += `<tr><td>${m.nome}</td><td>${m.nascimento || '-'}</td><td>${m.cpf || '-'}</td><td>${pagamentoStr}</td></tr>`;
        });
        tabelaHTML += `</table>`;

        const roteiroFormatado = det.roteiro ? det.roteiro.replace(/\n/g, '<br>') : '';
        const dependentesTexto = dependentesObjs.length > 0 ? `<br><br><b>ACOMPANHANTES (DEPENDENTES):</b> ${dependentesObjs.map(d => d.nome).join(', ')}.` : '';

        html += `
        <h3 class="center">CONTRATO DE AQUISIÇÃO DE PACOTE DE TURISMO</h3>
        
        <div class="clause-block">
            <p class="bold">CLÁUSULA 1 – DAS PARTES:</p>
            <p class="justify"><b>A) CONTRATANTE:</b><br>
            O(a)Sr(a). ${lider.nome}, portador(a) do RG ${lider.orgaoExpeditor || '_______________'}, inscrito no CPF/MF sob o nº ${lider.cpf || '_______________'} residente e domiciliado na ${lider.endereco || '_______________'} - ${lider.cidade || '_______________'}, celular: ${lider.celular || '_______________'}, de agora em diante denominado CONTRATANTE;${dependentesTexto}</p>
            
            <p class="justify"><b>B) CONTRATADA:</b><br>
            58.904.532 LIVIA GRAZIELA DOS SANTOS, GRAZI TURISMO, inscrita no CNPJ/MF n.º 58.904.532/0001-33, empresa Home office sediada no município de Quissamã/RJ, na Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – Rj, cep 28737-488 de agora em diante denominada CONTRATADA.</p>
            
            <p class="justify">Este Contrato é formulado à luz do Código de Defesa do Consumidor, da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de Turismo – BRAZTOA. As partes acima identificadas, entre si, justo e acertado o presente Contrato dos serviços de GRAZI TURISMO deverá ler e aceitar este Termo de Uso, todas as demais políticas e princípios que o regem, declarando ciência e concordância com as cláusulas a seguir expostas:</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 2 – DAS CONDIÇÕES E OBJETO DO PRESENTE CONTRATO</b><br>
            O presente contrato tem como OBJETO, a prestação, pela CONTRATADA, à CONTRATANTE, dos serviços na área de turismo. Os pacotes inclusos na prestação dos serviços contratados incluem a reserva e pagamento de vagas em meios de hospedagem (quando houver), transporte, contratação de serviços de recepção, transferência e assistência, segundo as especificações do pacote adquirido.<br>
            A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços, isentando sua responsabilidade por todo e qualquer problema, resultantes de casos fortuitos ou de força maior, ou seja: greves, distúrbios, quarentenas, epidemias, guerras, fenômenos naturais tais como terremotos, furacões, enchentes, avalanches, mas não limitando-se a estes, modificações, atrasos e/ou cancelamento devido a motivos técnicos, mecânicos e/ou meteorológicos, sobre os quais a operadora não possui poder de previsão ou controle.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 3 – DA CONTRATAÇÃO</b><br>
            Para aquisição dos serviços prestados pela GRAZI TURISMO, o contratante deverá escolher entre os valores constantes na descrição de serviços do presente contrato.<br>
            É lícito ao Contratante, exercer seu direito de arrependimento, desistindo da contratação dos serviços, desde que o faça em até 7 (sete) dias contados da contratação, nos moldes do artigo 49 do Código de Defesa do Consumidor (com exceção das taxas/multas impostas em virtude do cancelamento, as quais serão aplicadas).</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 4 – DO FINANCIAMENTO</b><br>
            O Contratante declara estar ciente de que após sua solicitação.<br>
            Após o envio da documentação solicitada, o contratante será notificado, em seguida, após a escolha do valor referente ao pacote selecionado, poderá efetuar o pagamento mediante pix, depósito ou transferência bancária e em dinheiro nos meses assim solicitado.<br>
            Não incidirá nenhum tipo de juros sobre o valor a ser pago para a obtenção dos créditos, independente do número de parcelas escolhidas pelo adquirente.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 5 – DO CANCELAMENTO, DA DESISTÊNCIA E DAS TAXAS</b><br>
            É lícito ao CLIENTE, requerer a desistência do contrato e solicitar o cancelamento em até 7 (sete) dias contados da contratação, nos moldes da cláusula 3, anteriormente descrita.<br>
            <b>5.1 – Condições do Cancelamento:</b><br>
            - Em pedidos de RESCISÃO com mais de 30 (trinta) dias de antecedência da data do início da viagem, a multa aplicada será de 10% (dez por cento);<br>
            - Entre 30 (trinta) a 20 (vinte) dias de antecedência da data do início da viagem, a multa aplicada será de 20% (vinte por cento);<br>
            - Entre 19 (dezenove) a 15 (quinze) dias de antecedência da data do início da viagem, a multa aplicada será de 50% (cinquenta por cento).<br>
            - Entre 14 (quatorze) a 10 (dez) dias de antecedência da data do início da viagem, a multa aplicada será de 80% (oitenta por cento).<br>
            - Em caso de RESCISÃO em menos de 9 (nove) dias de antecedência da data do início da viagem, a multa aplicada será de 100% (cem por cento), isto é, o CONTRATANTE não tem direito à restituição dos valores pagos no pacote.<br>
            <b>5.2 – Reversão do valor em crédito:</b><br>
            Com a migração para outro pacote em valor inferior, contratação futura de novo serviço ou contratação imediata de viagem disponível dentro do valor já pago. Em caso de cancelamento com reversão do valor em créditos, o contratante terá o prazo de até 12 meses para utilizar o valor disponível.<br>
            <b>5.3 – RESCISÃO da parte contratada:</b><br>
            Caso o pacote seja cancelado pela parte contratada por não atingir o número mínimo de participantes, por condições climáticas não favoráveis ou caso surjam motivos técnicos operacionais que impeçam o cumprimento total da atividade, você poderá optar por uma das três opções: Agendar a mesma viagem em outra data; Receber 100% do valor em créditos para serem usados em uma nova compra; Receber 100% através de pix, depósito ou transferência bancária.<br>
            <b>5.4 – Da inadimplência:</b><br>
            Caso o contratante deixe de efetuar o pagamento de algum dos meses solicitado, e não os atualize efetuando o pagamento do valor dentro do prazo do vencimento, considerar-se-á CANCELADO o pacote contratado.<br>
            <b>5.5 – Das taxas:</b><br>
            Todas as taxas do pacote contratado estão inclusas no valor final. Ressalvadas: Entradas a atrações turísticas que não estiverem estritamente especificadas no pacote; As despesas de caráter pessoal; As refeições não mencionadas, gorjetas, serviços de maleteiros.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 6 – DA UTILIZAÇÃO DO PACOTE ADQUIRIDO</b><br>
            O contratante poderá utilizar o pacote adquirido SOMENTE após a quitação de todas as parcelas.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 7 – CONDIÇÕES ESPECÍFICAS E OBRIGAÇÕES DA OPERADORA</b><br>
            7.1. A empresa contratada reserva-se do direito de promover as alterações que se fizerem necessárias quanto aos itinerários, hotéis, serviços, etc, sem prejuízo para o cliente.<br>
            7.2. Obriga-se a OPERADORA a: Prestar informações claras e precisas ao CLIENTE, sobre o produto adquirido e comunicar com antecedência as eventuais alterações de dias ou horários.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 8 – DA OCORRÊNCIA DE CASOS FORTUITOS E FORÇA MAIOR</b><br>
            Ocorrendo caso fortuito (fenômenos da natureza, calamidade pública, perturbação da ordem), que coloquem em risco a vida e a segurança do contratante, poderá a OPERADORA cancelar a viagem, sem acréscimo de multa, juros ou pagamento de indenização a qualquer título.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 9 – MEIOS DE TRANSPORTE</b><br>
            O contratante declara-se ciente de que a responsabilidade civil e criminal que decorra do contrato de transporte é da empresa de transporte. A OPERADORA limita-se a contratar empresas idôneas.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 10 – DOCUMENTAÇÃO DE VIAGEM</b><br>
            Adultos: Carteira de Identidade (RG), CNH, Passaporte. Crianças e Adolescentes: Certidão de Nascimento (original/autenticada), RG. É fundamental que os documentos estejam válidos e atualizados. Não são aceitos prints ou fotos.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 11 – SEGUROS DE VIAGENS NÃO INCLUSOS NO PACOTE</b><br>
            Caso o CLIENTE necessite de assistência médica ambulatorial ou hospitalar ou da ministração de remédios durante a viagem, deverá suportar as despesas deles decorrentes às suas próprias expensas.</p>
        </div>

        <div class="clause-block">
            <p class="justify"><b>CLÁUSULA 12 – ELEIÇÃO DE FORO</b><br>
            Para dirimir toda e qualquer dúvida decorrente do presente contrato, por eleição, os clientes elegem o foro da comarca de Quissamã/Carapebus/RJ.</p>
        </div>

        <div class="clause-block">
            <h4 class="center">DESCRIÇÃO DE PRESTAÇÃO DE SERVIÇO DA GRAZI TURISMO</h4>
            <p><b>Destino da viagem:</b> ${ex.lugar}<br>
            <b>Data de saída:</b> ${det.dataSaida || '__/__/____'} &nbsp;&nbsp;&nbsp;<b>Horário:</b> ${det.horaSaida || '__:__'}<br>
            <b>Data de retorno:</b> ${det.dataRetorno || '__/__/____'} &nbsp;&nbsp;&nbsp;<b>Horário:</b> ${det.horaRetorno || '__:__'}<br>
            <b>Transporte:</b> ${det.transporte || '_________________'} &nbsp;&nbsp;&nbsp;<b>Empresa:</b> ${det.empresa || '_________________'}</p>

            <p><b>DADOS DO RECEPTIVO (ROTEIRO) E SERVIÇOS PRESTADOS:</b><br>
            ${roteiroFormatado || '________________________________________________'}</p>

            <p><b>DADOS DOS PASSAGEIROS / GRUPOS:</b><br>
            ${tabelaHTML}
            </p>
        </div>

        <div class="signature-block">
            <p class="center">_________________________, ______/______/______</p>
            <p class="center">LOCAL E DATA</p>
            <br>
            <p class="center">_____________________________________________</p>
            <p class="center">CONTRATANTE: ${lider.nome}</p>
            <br>
            <p class="center">58.904.532 Livia Graziela dos Santos - GRAZI TURISMO</p>
        </div>
        `;

        if (index < lideres.length - 1) {
            html += pageBreak;
        }
    });

    html += `</body></html>`;
    return html;
}

const gerarContratos = async (tipo) => {
    if (tipo === 'doc') {
        const html = gerarHtmlContratosGeral(tipo);
        if (!html) return;

        showToast('Gerando documento DOC... Aguarde.', 'warning');
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Contratos_${exSelecionada.value.nome.replace(/\s+/g, '_')}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Contrato DOC baixado!', 'success');

    } else if (tipo === 'pdf') {
        const html = gerarHtmlContratosGeral(tipo);
        if (!html) return;

        showToast('Gerando documento PDF... Aguarde.', 'warning');
        try {
            const { jsPDF } = await import('jspdf');
            const autoTableModule = await import('jspdf-autotable');
            const autoTable = autoTableModule.default || autoTableModule;
            const doc = new jsPDF();

            const ex = exSelecionada.value;
            const det = ex.detalhes || {};
            const grupos = ex.grupos || {};

            const dependentesIdsSet = new Set();
            Object.values(grupos).forEach(arr => arr.forEach(id => dependentesIdsSet.add(String(id))));
            const lideres = ex.usuarios.filter(u => u.id !== ex.guiaId && !dependentesIdsSet.has(String(u.id)));

            lideres.forEach((lider, index) => {
                if (index > 0) doc.addPage();

                const idsDependentes = (grupos[String(lider.id)] || []).map(String);
                const dependentesObjs = ex.usuarios.filter(u => idsDependentes.includes(String(u.id)));

                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("CONTRATO DE AQUISIÇÃO DE PACOTE DE TURISMO", 105, 20, { align: "center" });

                doc.setFontSize(10);
                let textY = 30;

                const addText = (txt, isBold = false, isJustify = true, marginT = 0) => {
                    textY += marginT;
                    doc.setFont("helvetica", isBold ? "bold" : "normal");
                    const lines = doc.splitTextToSize(txt, 180);

                    if (textY + (lines.length * 5) > 280) {
                        doc.addPage();
                        textY = 20;
                    }

                    for (let i = 0; i < lines.length; i++) {
                        if (textY > 280) {
                            doc.addPage();
                            textY = 20;
                        }
                        doc.text(lines[i], 15, textY, { align: isJustify ? "justify" : "left", maxWidth: 180 });
                        textY += 5;
                    }
                };

                const dependentesTexto = dependentesObjs.length > 0 ? ` ACOMPANHANTES (DEPENDENTES): ${dependentesObjs.map(d => d.nome).join(', ')}.` : '';

                addText("CLÁUSULA 1 – DAS PARTES:", true, false, 5);
                addText(`A) CONTRATANTE: O(a)Sr(a). ${lider.nome}, portador(a) do RG ${lider.orgaoExpeditor || '_______________'}, inscrito no CPF/MF sob o nº ${lider.cpf || '_______________'} residente e domiciliado na ${lider.endereco || '_______________'} - ${lider.cidade || '_______________'}, celular: ${lider.celular || '_______________'}, de agora em diante denominado CONTRATANTE;${dependentesTexto}`);
                addText(`B) CONTRATADA: 58.904.532 LIVIA GRAZIELA DOS SANTOS, GRAZI TURISMO, inscrita no CNPJ/MF n.º 58.904.532/0001-33, empresa Home office sediada no município de Quissamã/RJ, na Estrada Roberto Pinto de Barcelos, 01, Penha, Quissamã – Rj, cep 28737-488 de agora em diante denominada CONTRATADA.`);
                addText(`Este Contrato é formulado à luz do Código de Defesa do Consumidor, da Deliberação Normativa da Embratur e texto da Associação Brasileira das Operadoras de Turismo – BRAZTOA. As partes acima identificadas, entre si, justo e acertado o presente Contrato dos serviços de GRAZI TURISMO deverá ler e aceitar este Termo de Uso, todas as demais políticas e princípios que o regem, declarando ciência e concordância com as cláusulas a seguir expostas:`);

                addText("CLÁUSULA 2 – DAS CONDIÇÕES E OBJETO DO PRESENTE CONTRATO", true, false, 5);
                addText(`O presente contrato tem como OBJETO, a prestação, pela CONTRATADA, à CONTRATANTE, dos serviços na área de turismo. Os pacotes inclusos na prestação dos serviços contratados incluem a reserva e pagamento de vagas em meios de hospedagem (quando houver), transporte, contratação de serviços de recepção, transferência e assistência, segundo as especificações do pacote adquirido. A GRAZI TURISMO atua como intermediária entre seus clientes e prestadores de serviços, isentando sua responsabilidade por todo e qualquer problema, resultantes de casos fortuitos ou de força maior, ou seja: greves, distúrbios, quarentenas, epidemias, guerras, fenômenos naturais tais como terremotos, furacões, enchentes, avalanches, mas não limitando-se a estes, modificações, atrasos e/ou cancelamento devido a motivos técnicos, mecânicos e/ou meteorológicos, sobre os quais a operadora não possui poder de previsão ou controle.`);

                addText("CLÁUSULA 3 – DA CONTRATAÇÃO", true, false, 5);
                addText(`Para aquisição dos serviços prestados pela GRAZI TURISMO, o contratante deverá escolher entre os valores constantes na descrição de serviços do presente contrato. É lícito ao Contratante, exercer seu direito de arrependimento, desistindo da contratação dos serviços, desde que o faça em até 7 (sete) dias contados da contratação, nos moldes do artigo 49 do Código de Defesa do Consumidor (com exceção das taxas/multas impostas em virtude do cancelamento, as quais serão aplicadas).`);

                addText("CLÁUSULA 4 – DO FINANCIAMENTO", true, false, 5);
                addText(`O Contratante declara estar ciente de que após sua solicitação. Após o envio da documentação solicitada, o contratante será notificado, em seguida, após a escolha do valor referente ao pacote selecionado, poderá efetuar o pagamento mediante pix, depósito ou transferência bancária e em dinheiro nos meses assim solicitado. Não incidirá nenhum tipo de juros sobre o valor a ser pago para a obtenção dos créditos, independente do número de parcelas escolhidas pelo adquirente.`);

                addText("CLÁUSULA 5 – DO CANCELAMENTO, DA DESISTÊNCIA E DAS TAXAS", true, false, 5);
                addText(`É lícito ao CLIENTE, requerer a desistência do contrato e solicitar o cancelamento em até 7 (sete) dias contados da contratação, nos moldes da cláusula 3, anteriormente descrita.`);
                addText(`5.1 – Condições do Cancelamento:`, true, false);
                addText(`- Em pedidos de RESCISÃO com mais de 30 (trinta) dias de antecedência da data do início da viagem, a multa aplicada será de 10% (dez por cento);`);
                addText(`- Entre 30 (trinta) a 20 (vinte) dias de antecedência da data do início da viagem, a multa aplicada será de 20% (vinte por cento);`);
                addText(`- Entre 19 (dezenove) a 15 (quinze) dias de antecedência da data do início da viagem, a multa aplicada será de 50% (cinquenta por cento).`);
                addText(`- Entre 14 (quatorze) a 10 (dez) dias de antecedência da data do início da viagem, a multa aplicada será de 80% (oitenta por cento).`);
                addText(`- Em caso de RESCISÃO em menos de 9 (nove) dias de antecedência da data do início da viagem, a multa aplicada será de 100% (cem por cento), isto é, o CONTRATANTE não tem direito à restituição dos valores pagos no pacote.`);
                addText(`5.2 – Reversão do valor em crédito:`, true, false);
                addText(`Com a migração para outro pacote em valor inferior, contratação futura de novo serviço ou contratação imediata de viagem disponível dentro do valor já pago. Em caso de cancelamento com reversão do valor em créditos, o contratante terá o prazo de até 12 meses para utilizar o valor disponível.`);
                addText(`5.3 – RESCISÃO da parte contratada:`, true, false);
                addText(`Caso o pacote seja cancelado pela parte contratada por não atingir o número mínimo de participantes, por condições climáticas não favoráveis ou caso surjam motivos técnicos operacionais que impeçam o cumprimento total da atividade, você poderá optar por uma das três opções: Agendar a mesma viagem em outra data; Receber 100% do valor em créditos para serem usados em uma nova compra; Receber 100% através de pix, depósito ou transferência bancária.`);
                addText(`5.4 – Da inadimplência:`, true, false);
                addText(`Caso o contratante deixe de efetuar o pagamento de algum dos meses solicitado, e não os atualize efetuando o pagamento do valor dentro do prazo do vencimento, considerar-se-á CANCELADO o pacote contratado.`);
                addText(`5.5 – Das taxas:`, true, false);
                addText(`Todas as taxas do pacote contratado estão inclusas no valor final. Ressalvadas: Entradas a atrações turísticas que não estiverem estritamente especificadas no pacote; As despesas de caráter pessoal; As refeições não mencionadas, gorjetas, serviços de maleteiros.`);

                addText("CLÁUSULA 6 – DA UTILIZAÇÃO DO PACOTE ADQUIRIDO", true, false, 5);
                addText(`O contratante poderá utilizar o pacote adquirido SOMENTE após a quitação de todas as parcelas.`);

                addText("CLÁUSULA 7 – CONDIÇÕES ESPECÍFICAS E OBRIGAÇÕES DA OPERADORA", true, false, 5);
                addText(`7.1. A empresa contratada reserva-se do direito de promover as alterações que se fizerem necessárias quanto aos itinerários, hotéis, serviços, etc, sem prejuízo para o cliente. 7.2. Obriga-se a OPERADORA a: Prestar informações claras e precisas ao CLIENTE, sobre o produto adquirido e comunicar com antecedência as eventuais alterações de dias ou horários.`);

                addText("CLÁUSULA 8 – DA OCORRÊNCIA DE CASOS FORTUITOS E FORÇA MAIOR", true, false, 5);
                addText(`Ocorrendo caso fortuito (fenômenos da natureza, calamidade pública, perturbação da ordem), que coloquem em risco a vida e a segurança do contratante, poderá a OPERADORA cancelar a viagem, sem acréscimo de multa, juros ou pagamento de indenização a qualquer título.`);

                addText("CLÁUSULA 9 – MEIOS DE TRANSPORTE", true, false, 5);
                addText(`O contratante declara-se ciente de que a responsabilidade civil e criminal que decorra do contrato de transporte é da empresa de transporte. A OPERADORA limita-se a contratar empresas idôneas.`);

                addText("CLÁUSULA 10 – DOCUMENTAÇÃO DE VIAGEM", true, false, 5);
                addText(`Adultos: Carteira de Identidade (RG), CNH, Passaporte. Crianças e Adolescentes: Certidão de Nascimento (original/autenticada), RG. É fundamental que os documentos estejam válidos e atualizados. Não são aceitos prints ou fotos.`);

                addText("CLÁUSULA 11 – SEGUROS DE VIAGENS NÃO INCLUSOS NO PACOTE", true, false, 5);
                addText(`Caso o CLIENTE necessite de assistência médica ambulatorial ou hospitalar ou da ministração de remédios durante a viagem, deverá suportar as despesas deles decorrentes às suas próprias expensas.`);

                addText("CLÁUSULA 12 – ELEIÇÃO DE FORO", true, false, 5);
                addText(`Para dirimir toda e qualquer dúvida decorrente do presente contrato, por eleição, os clientes elegem o foro da comarca de Quissamã/Carapebus/RJ.`);

                addText("DESCRIÇÃO DE PRESTAÇÃO DE SERVIÇO DA GRAZI TURISMO", true, false, 10);
                addText(`Destino da viagem: ${ex.lugar}`, false, false, 2);
                addText(`Data de saída: ${det.dataSaida || '__/__/____'}    Horário: ${det.horaSaida || '__:__'}`, false, false);
                addText(`Data de retorno: ${det.dataRetorno || '__/__/____'}    Horário: ${det.horaRetorno || '__:__'}`, false, false);
                addText(`Transporte: ${det.transporte || '_________________'}    Empresa: ${det.empresa || '_________________'}`, false, false);

                addText("DADOS DO RECEPTIVO (ROTEIRO) E SERVIÇOS PRESTADOS:", true, false, 5);
                addText(det.roteiro || '________________________________________________', false, false);

                textY += 10;
                doc.setFont("helvetica", "bold");
                doc.text("DADOS DOS PASSAGEIROS / GRUPOS:", 15, textY);
                textY += 5;

                const grupoFamiliarTabela = [lider, ...dependentesObjs];
                const head = [['Nome Completo', 'Nascimento', 'CPF', 'Pagamento']];
                const body = grupoFamiliarTabela.map(m => [m.nome, m.nascimento || '-', m.cpf || '-', ex.aplicarParcelas ? obterPagamento(ex, m.id) : 'À combinar']);

                autoTable(doc, {
                    startY: textY,
                    head: head,
                    body: body,
                    headStyles: { fillColor: [240, 240, 240], textColor: 0 },
                    styles: { fontSize: 10, cellPadding: 3, textColor: 0, font: "helvetica", lineWidth: 0.1, lineColor: 0 },
                    theme: 'grid',
                    margin: { left: 15, right: 15 }
                });

                textY = doc.lastAutoTable.finalY + 20;

                if (textY + 40 > 280) { doc.addPage(); textY = 20; }

                doc.setFont("helvetica", "normal");
                doc.text("_________________________, ______/______/______", 105, textY, { align: "center" });
                textY += 5;
                doc.text("LOCAL E DATA", 105, textY, { align: "center" });
                textY += 15;
                doc.text("_____________________________________________", 105, textY, { align: "center" });
                textY += 5;
                doc.text(`CONTRATANTE: ${lider.nome}`, 105, textY, { align: "center" });
                textY += 15;
                doc.text("58.904.532 Livia Graziela dos Santos - GRAZI TURISMO", 105, textY, { align: "center" });
            });

            doc.save(`Contratos_${exSelecionada.value.nome.replace(/\s+/g, '_')}.pdf`);
            showToast('Contrato PDF baixado com sucesso!', 'success');

        } catch (error) {
            console.error(error);
            showToast('Erro ao gerar PDF.', 'danger');
        }
    }
};

const baixarListaPDF = async (excursao) => {
    if (!import.meta.client) return;
    try {
        const { jsPDF } = await import('jspdf'); const autoTableModule = await import('jspdf-autotable'); const autoTable = autoTableModule.default || autoTableModule; const doc = new jsPDF()
        doc.setFontSize(22); doc.setTextColor(13, 110, 253); doc.text(`Lista de Passageiros`, 14, 22)
        doc.setFontSize(14); doc.setTextColor(50, 50, 50); doc.text(`Excursão: ${excursao.nome}`, 14, 32)
        doc.setFontSize(11); doc.setTextColor(100, 100, 100); doc.text(`Destino: ${excursao.lugar}`, 14, 40)
        let listaCompleta = [...excursao.usuarios]
        if (excursao.guia) { const guiaJaNaLista = listaCompleta.some(u => u.id === excursao.guia.id); if (!guiaJaNaLista) { listaCompleta.push({ ...excursao.guia, nome: `${excursao.guia.nome} (GUIA)` }) } else { const indexGuia = listaCompleta.findIndex(u => u.id === excursao.guia.id); listaCompleta[indexGuia].nome = `${listaCompleta[indexGuia].nome} (GUIA)` } }
        listaCompleta.sort((a, b) => a.nome.localeCompare(b.nome))
        const head = [['Nº', 'Nome Completo', 'CPF', 'Órgão Expeditor']];
        const dadosTabela = listaCompleta.map((user, index) => { return [index + 1, user.nome, user.cpf || '-', user.orgaoExpeditor || '-'] })
        autoTable(doc, { startY: 50, head: head, body: dadosTabela, headStyles: { fillColor: [13, 110, 253], textColor: 255 }, alternateRowStyles: { fillColor: [245, 248, 250] }, styles: { fontSize: 10, cellPadding: 4 } })
        doc.save(`Lista_${excursao.nome.replace(/\s+/g, '_')}.pdf`); showToast('Sucesso!', 'success')
    } catch (error) { showToast('Erro no PDF!', 'danger') }
}

const baixarListaExcel = (excursao) => {
    let listaCompleta = [...excursao.usuarios]
    if (excursao.guia) { const guiaJaNaLista = listaCompleta.some(u => u.id === excursao.guia.id); if (!guiaJaNaLista) { listaCompleta.push({ ...excursao.guia, nome: `${excursao.guia.nome} (GUIA)` }) } else { const indexGuia = listaCompleta.findIndex(u => u.id === excursao.guia.id); listaCompleta[indexGuia].nome = `${listaCompleta[indexGuia].nome} (GUIA)` } }
    listaCompleta.sort((a, b) => a.nome.localeCompare(b.nome))
    let csvContent = excursao.aplicarParcelas ? "\uFEFFNº;Nome Completo;CPF;Órgão Expeditor;Pagamento\n" : "\uFEFFNº;Nome Completo;CPF;Órgão Expeditor\n"
    listaCompleta.forEach((user, index) => { const nome = user.nome.replace(/;/g, ','); const cpf = user.cpf || '-'; const orgao = user.orgaoExpeditor || '-'; let linha = `${index + 1};${nome};${cpf};${orgao}`; if (excursao.aplicarParcelas) { const pg = excursao.pagamentos ? excursao.pagamentos[user.id] || 'Pendente' : 'Pendente'; linha += `;${pg}` }; csvContent += linha + "\n" })
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", `Lista_${excursao.nome.replace(/\s+/g, '_')}.csv`); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link); showToast('Planilha gerada!', 'success')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
    font-family: 'Inter', sans-serif;
    color: #334155;
}

.main-container {
    max-width: 1080px;
    margin: 0 auto;
}

/* Variáveis e Cores Customizadas */
.text-brand {
    color: #2563eb !important;
}

.bg-brand {
    background-color: #2563eb !important;
    color: white;
}

.bg-brand-light {
    background-color: #eff6ff !important;
}

.btn-brand {
    background-color: #2563eb;
    color: white;
    border: none;
}

.btn-brand:hover {
    background-color: #1d4ed8;
    color: white;
}

.btn-outline-brand {
    color: #2563eb;
    border: 1px solid #2563eb;
    background-color: transparent;
    transition: all 0.2s ease;
}

.btn-outline-brand:hover {
    background-color: transparent;
    color: #1e40af;
    border-color: #1e40af;
}

.bg-surface {
    background-color: #f8fafc !important;
}

/* Sombras e Transições */
.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
}

.shadow-hover {
    transition: all 0.2s ease;
}

.shadow-hover:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
    transform: translateY(-2px);
}

/* Ajustes de Tabela e Container */
.scrollable-table-container {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f8fafc;
}

.scrollable-table-container::-webkit-scrollbar {
    width: 8px;
}

.scrollable-table-container::-webkit-scrollbar-track {
    background: #f8fafc;
}

.scrollable-table-container::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
}

.scrollable-table-container::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

.table-fixed-header thead th {
    position: sticky;
    top: 0;
    background-color: #f8fafc;
    z-index: 2;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border-bottom: 2px solid #e2e8f0 !important;
}

.table-row-hover:hover td {
    background-color: #f1f5f9;
}

/* Inputs e Botões */
.input-search-wrapper input {
    transition: all 0.2s ease;
}

.input-search-wrapper input:focus {
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
    border-color: #93c5fd !important;
}

.tracking-tight {
    letter-spacing: -0.025em;
}

.cursor-pointer {
    cursor: pointer;
}

.border-dashed {
    border-style: dashed !important;
    border-color: #cbd5e1 !important;
}

/* Animações e Detalhes */
.action-btn {
    transition: transform 0.15s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}
</style>