<template>
    <div>
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
            <div v-for="t in toasts" :key="t.id"
                class="toast show align-items-center text-white border-0 mb-2 shadow-lg rounded-3"
                :class="`bg-${t.type}`" role="alert">
                <div class="d-flex">
                    <div class="toast-body fw-bold">
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
        <div v-if="!logado" class="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-3">
            <div class="card border-0 shadow-lg p-4 p-md-5 text-center w-100 rounded-4" style="max-width: 400px;">
                <div class="mb-4 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                        class="bi bi-lock-fill mb-3" viewBox="0 0 16 16">
                        <path
                            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                    <h3 class="fw-bold text-dark">Acesso Restrito</h3>
                </div>
                <input v-model="senha" type="password"
                    class="form-control form-control-lg mb-3 text-center fs-6 bg-light border-0 rounded-3"
                    placeholder="Digite a senha" @keyup.enter="fazerLogin">
                <button class="btn btn-primary btn-lg w-100 fw-bold fs-6 rounded-3 py-3 shadow-sm"
                    @click="fazerLogin">Entrar no Painel</button>
            </div>
        </div>
        <div v-else class="min-vh-100 bg-white pb-5">
            <nav class="navbar bg-white shadow-sm sticky-top px-3 py-3 mb-4 mb-md-5 border-bottom">
                <div class="container-fluid p-0 d-flex justify-content-between align-items-center">
                    <h1 class="fw-bold text-primary fs-4 m-0">GraziTur <span class="text-dark">Admin</span></h1>
                    <button class="btn btn-outline-danger btn-sm px-4 fw-bold rounded-pill"
                        @click="fazerLogout">Sair</button>
                </div>
            </nav>
            <div class="container px-3 px-md-4">
                <div class="bg-light p-3 p-md-4 rounded-4 mb-5 border">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4 class="text-dark fw-bold mb-0 fs-5">Excursões Ativas</h4>
                        <button class="btn btn-success btn-sm shadow-sm px-3 py-2 fw-bold rounded-3"
                            @click="abrirModalExcursao()">
                            <span class="d-none d-sm-inline">+ Nova Excursão</span>
                            <span class="d-inline d-sm-none">+ Nova</span>
                        </button>
                    </div>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                        <div v-for="ex in excursoes" :key="ex.id" class="col">
                            <div class="card h-100 shadow-sm border-0 btn-card bg-white rounded-4"
                                @click="abrirGerenciarExcursao(ex)">
                                <div class="card-body p-4 d-flex flex-column">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <h5 class="card-title text-primary fw-bold fs-5 mb-0">{{ ex.nome }}</h5>
                                    </div>
                                    <p class="card-text text-muted small mb-4"><svg xmlns="http://www.w3.org/2000/svg"
                                            width="12" height="12" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                                            <path
                                                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                        </svg> {{ ex.lugar }}</p>
                                    <div class="mt-auto bg-light p-3 rounded-3 border-0">
                                        <div class="small d-flex justify-content-between align-items-center mb-2">
                                            <span class="text-muted small">Guia:</span>
                                            <span :class="ex.guia ? 'text-dark fw-bold' : 'text-danger fw-bold'">{{
                                                ex.guia?.nome || 'Pendente' }}</span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar rounded-pill"
                                                :class="ex._count.usuarios >= ex.vagas ? 'bg-danger' : 'bg-primary'"
                                                :style="{ width: (ex._count.usuarios / ex.vagas * 100) + '%' }"></div>
                                        </div>
                                        <div class="text-end mt-2">
                                            <span class="fw-bold small text-muted" style="font-size: 0.75rem;">{{
                                                ex._count.usuarios }} / {{ ex.vagas }} vagas ocupadas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="excursoes.length === 0" class="col-12 text-center py-5">
                            <p class="text-muted mb-0">Nenhuma excursão cadastrada no momento.</p>
                        </div>
                    </div>
                </div>
                <div class="bg-light p-3 p-md-4 rounded-4 border mb-5">
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                        <h4 class="text-dark fw-bold mb-0 fs-5">Base de Passageiros</h4>
                        <div class="d-flex gap-2 w-100 w-sm-auto">
                            <input v-model="buscaUser" type="text"
                                class="form-control form-control-sm border shadow-sm rounded-3 px-3"
                                placeholder="Buscar por nome ou CPF...">
                            <button class="btn btn-primary btn-sm fw-bold px-3 shadow-sm text-nowrap rounded-3"
                                @click="prepararNovoUser">
                                + Cadastro
                            </button>
                        </div>
                    </div>
                    <div class="d-none d-lg-block border shadow-sm rounded-4 overflow-hidden bg-white">
                        <div class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light text-muted small text-uppercase">
                                    <tr>
                                        <th class="ps-4 py-3 fw-bold border-0 text-start w-50">Nome do Passageiro</th>
                                        <th class="py-3 fw-bold border-0 text-center w-25">Documento (CPF)</th>
                                        <th class="pe-4 py-3 fw-bold border-0 text-end w-25">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="u in usuariosFiltrados" :key="u.id" style="cursor: pointer;">
                                        <td class="ps-4 py-3 text-start" @click="abrirVincular(u)">
                                            <div class="fw-bold text-dark d-flex align-items-center gap-2">
                                                {{ u.nome }}
                                                <span v-if="u.isGuia" class="badge bg-warning text-dark py-1 px-2"
                                                    style="font-size: 0.65rem;">GUIA</span>
                                            </div>
                                        </td>
                                        <td class="py-3 text-muted small text-center" @click="abrirVincular(u)">{{ u.cpf
                                            || '-' }}</td>
                                        <td class="pe-4 py-3 text-end text-nowrap">
                                            <button class="btn btn-sm btn-light text-primary px-3 me-2 rounded-3"
                                                @click.stop="prepararEdicaoUser(u)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                    <path
                                                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                                </svg>
                                            </button>
                                            <button class="btn btn-sm btn-light text-danger px-3 rounded-3"
                                                @click.stop="pedirConfirmacao('user', u.id, 'Excluir', 'Deseja excluir permanentemente?')">
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
                                        <td colspan="3" class="text-center text-muted py-5 p-4">Nenhum passageiro
                                            encontrado.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="d-block d-lg-none">
                        <div v-for="u in usuariosFiltrados" :key="u.id"
                            class="card border shadow-sm rounded-4 mb-3 bg-white">
                            <div class="card-body p-4">
                                <div class="d-flex justify-content-between align-items-start mb-3"
                                    @click="abrirVincular(u)">
                                    <div>
                                        <h6 class="fw-bold text-dark mb-1 fs-6">{{ u.nome }}</h6>
                                        <p class="text-muted small mb-0">CPF: {{ u.cpf || '-' }}</p>
                                    </div>
                                    <span v-if="u.isGuia" class="badge bg-warning text-dark rounded-pill"
                                        style="font-size: 0.7rem;">GUIA</span>
                                </div>
                                <div class="d-flex gap-2 mt-3 pt-3 border-top">
                                    <button class="btn btn-outline-primary flex-fill rounded-3 py-2 fw-bold small"
                                        @click="prepararEdicaoUser(u)">Editar</button>
                                    <button class="btn btn-primary flex-fill rounded-3 py-2 fw-bold small"
                                        @click="abrirVincular(u)">Add Viagem</button>
                                    <button class="btn btn-outline-danger px-3 rounded-3 py-2 fw-bold"
                                        @click="pedirConfirmacao('user', u.id, 'Excluir', 'Deseja excluir permanentemente?')">Apagar</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="usuariosFiltrados.length === 0"
                            class="text-center text-muted py-5 bg-white rounded-4 border">
                            <p class="small mb-0">Nenhum passageiro encontrado.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="modalUser" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-xl modal-dialog-scrollable px-2">
                    <div class="modal-content border-0 shadow-lg rounded-4 bg-light">
                        <div class="modal-header bg-primary text-white p-3 p-md-4 border-0">
                            <h5 class="modal-title fw-bold fs-5">{{ formUser.id ? 'Editar Cadastro' : 'Novo Cadastro' }}
                            </h5>
                            <button class="btn-close btn-close-white" @click="modalUser = false"></button>
                        </div>
                        <div class="modal-body p-3 p-md-4">
                            <div class="row g-4">
                                <div class="col-lg-6">
                                    <div class="bg-white p-4 rounded-4 shadow-sm border h-100">
                                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-4">Dados Pessoais</h6>
                                        <div class="mb-3">
                                            <label class="form-label small fw-bold text-muted">Nome Completo *</label>
                                            <input v-model="formUser.nome" type="text"
                                                class="form-control bg-light border-0 rounded-3">
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label small fw-bold text-muted">E-mail</label>
                                            <input v-model="formUser.email" type="email"
                                                class="form-control bg-light border-0 rounded-3">
                                        </div>
                                        <div class="row g-3">
                                            <div class="col-12 col-md-6">
                                                <label class="form-label small fw-bold text-muted">CPF *</label>
                                                <input v-model="formUser.cpf" type="text"
                                                    class="form-control bg-light border-0 rounded-3"
                                                    placeholder="Apenas números">
                                            </div>
                                            <div class="col-12 col-md-6">
                                                <label
                                                    class="form-label small fw-bold text-muted d-flex justify-content-between">Nascimento
                                                    *</label>
                                                <input v-model="formUser.nascimento" @input="formatarData" type="text"
                                                    maxlength="10" class="form-control bg-light border-0 rounded-3"
                                                    placeholder="DD/MM/AAAA">
                                            </div>
                                            <div class="col-12">
                                                <label class="form-label small fw-bold text-muted">Órgão Expeditor
                                                    *</label>
                                                <input v-model="formUser.orgaoExpeditor" type="text"
                                                    class="form-control bg-light border-0 rounded-3"
                                                    placeholder="Ex: Detran">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column">
                                        <h6 class="text-primary fw-bold border-bottom pb-2 mb-4">Contato e Sistema</h6>
                                        <div class="mb-3">
                                            <label class="form-label small fw-bold text-muted">Celular *</label>
                                            <input v-model="formUser.celular" type="text"
                                                class="form-control bg-light border-0 rounded-3">
                                        </div>
                                        <div class="row g-3 mb-4">
                                            <div class="col-12 col-sm-8">
                                                <label class="form-label small fw-bold text-muted">Endereço Completo
                                                    *</label>
                                                <input v-model="formUser.endereco" type="text"
                                                    class="form-control bg-light border-0 rounded-3">
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <label class="form-label small fw-bold text-muted">Cidade *</label>
                                                <input v-model="formUser.cidade" type="text"
                                                    class="form-control bg-light border-0 rounded-3">
                                            </div>
                                        </div>
                                        <div
                                            class="mt-auto p-3 bg-warning bg-opacity-10 rounded-3 border border-warning mb-3">
                                            <div class="form-check form-switch m-0 d-flex align-items-center">
                                                <input class="form-check-input fs-3 m-0 me-3 shadow-none cursor-pointer"
                                                    type="checkbox" v-model="formUser.isGuia" id="guiaSwitch">
                                                <label
                                                    class="form-check-label fw-bold text-dark mb-0 cursor-pointer lh-sm"
                                                    for="guiaSwitch">Habilitar como GUIA</label>
                                            </div>
                                        </div>
                                        <div class="p-3 bg-danger bg-opacity-10 rounded-3 border border-danger">
                                            <div class="form-check form-switch m-0 d-flex align-items-center">
                                                <input class="form-check-input fs-4 m-0 me-3 shadow-none cursor-pointer"
                                                    type="checkbox" v-model="ignorarRegras" id="ignorarSwitch">
                                                <label
                                                    class="form-check-label fw-bold text-danger mb-0 cursor-pointer lh-sm"
                                                    for="ignorarSwitch">
                                                    IGNORAR REGRAS <br>
                                                    <span class="fw-normal text-muted small d-block mt-1">Salvar sem
                                                        campos obrigatórios.</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-12 mb-3">
                                    <h5 class="text-dark fw-bold mb-0 fs-5">Grupo Familiar</h5>
                                </div>
                                <div class="col-lg-6 mb-4 mb-lg-0">
                                    <div class="bg-white p-4 rounded-4 shadow-sm border h-100">
                                        <label class="form-label small fw-bold text-muted">Pesquisar Passageiro:</label>
                                        <input v-model="buscaParenteModal" type="text"
                                            class="form-control bg-light border-0 mb-3 rounded-3"
                                            placeholder="Digite o nome...">
                                        <div class="d-flex flex-column gap-2"
                                            style="max-height: 200px; overflow-y: auto;">
                                            <div v-for="u in usuariosParaParenteFiltrados" :key="u.id"
                                                class="p-3 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 border bg-light"
                                                :class="{ 'border-success bg-success bg-opacity-10': u.jaAdicionado }">
                                                <span class="fw-bold text-dark text-truncate w-100"
                                                    :class="{ 'text-success': u.jaAdicionado }">{{ u.nome }}</span>
                                                <button class="btn btn-sm fw-bold w-100 w-sm-auto rounded-pill px-3"
                                                    :class="u.jaAdicionado ? 'btn-success' : 'btn-primary'"
                                                    :disabled="u.jaAdicionado" @click="adicionarParenteNoForm(u)">{{
                                                    u.jaAdicionado ? '✔' : 'Adicionar' }}</button>
                                            </div>
                                            <div v-if="usuariosParaParenteFiltrados.length === 0 && buscaParenteModal"
                                                class="text-muted small p-4 bg-light text-center border border-dashed rounded-3">
                                                Nenhum resultado.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div
                                        class="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-25 h-100">
                                        <label class="form-label small fw-bold text-primary">Parentes
                                            Vinculados:</label>
                                        <div class="d-flex flex-column gap-2">
                                            <div v-for="(p, index) in formUser.parentesSelecionados" :key="index"
                                                class="bg-white p-3 rounded-3 shadow-sm border-0 d-flex justify-content-between align-items-center">
                                                <span class="fw-bold text-dark text-truncate pe-2">{{ p.nome }}</span>
                                                <button
                                                    class="btn btn-sm btn-light text-danger fw-bold rounded-pill px-3"
                                                    @click="removerParenteDoForm(index)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                        fill="currentColor" viewBox="0 0 16 16">
                                                        <path
                                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fill-rule="evenodd"
                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg> Remover
                                                </button>
                                            </div>
                                            <div v-if="formUser.parentesSelecionados.length === 0"
                                                class="text-center p-4 bg-white rounded-3 opacity-75 border border-dashed">
                                                <p class="text-muted small mb-0 fw-bold">Lista vazia.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="modal-footer bg-white p-3 p-md-4 border-top d-flex flex-column flex-sm-row gap-2 rounded-bottom-4">
                            <button
                                class="btn btn-light text-secondary fw-bold border w-100 w-sm-auto me-sm-auto py-3 rounded-3"
                                @click="modalUser = false">Cancelar</button>
                            <button class="btn btn-primary fw-bold w-100 w-sm-auto py-3 shadow-sm rounded-3 px-5"
                                @click="salvarUser">Salvar Cadastro</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="modalConfirm" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.7); overflow-y: auto; z-index: 1060;">
                <div class="modal-dialog modal-dialog-centered px-3" style="max-width: 400px;">
                    <div class="modal-content shadow-lg border-0 rounded-4">
                        <div class="modal-body p-4 p-md-5 text-center bg-white rounded-4">
                            <div class="text-danger mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                            </div>
                            <h5 class="fw-bold text-dark mb-2 fs-5">{{ confirmTitle }}</h5>
                            <p class="text-muted small mb-4">{{ confirmText }}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-light fw-bold flex-fill rounded-3 py-2 border shadow-sm"
                                    @click="modalConfirm = false">Cancelar</button>
                                <button class="btn btn-danger fw-bold flex-fill rounded-3 py-2 shadow-sm"
                                    @click="executarConfirmacao">Sim, Apagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="modalCriarExcursao" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-dialog-centered px-2">
                    <div class="modal-content border-0 shadow-lg rounded-4 bg-light">
                        <div class="modal-header bg-white p-4 border-bottom rounded-top-4">
                            <h5 class="modal-title fw-bold text-dark fs-5">{{ formEx.id ? 'Editar Excursão' : 'Nova Excursão' }}</h5>
                            <button class="btn-close" @click="fecharExcursao"></button>
                        </div>
                        <div class="modal-body p-4 bg-white">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label small text-muted mb-1 fw-bold">Título</label>
                                    <input v-model="formEx.nome"
                                        class="form-control form-control-sm bg-light border-0 rounded-3"
                                        placeholder="Ex: Beto Carrero">
                                </div>
                                <div class="col-12 col-md-8">
                                    <label class="form-label small text-muted mb-1 fw-bold">Destino</label>
                                    <input v-model="formEx.lugar"
                                        class="form-control form-control-sm bg-light border-0 rounded-3"
                                        placeholder="Local de destino">
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label small text-muted mb-1 fw-bold">Qtd Vagas</label>
                                    <input v-model="formEx.vagas" type="number"
                                        class="form-control form-control-sm bg-light border-0 rounded-3">
                                </div>
                                <div class="col-12 mt-4 p-3 bg-light rounded-3 border">
                                    <label class="form-label small fw-bold text-dark mb-2">Opções de Pagamento</label>
                                    <div class="d-flex flex-column flex-sm-row gap-2 mb-3">
                                        <input v-model="novoValor" type="number" class="form-control bg-white border"
                                            placeholder="Valor total (Ex: 1800)">
                                        <input v-model="novasVezes" type="number" class="form-control bg-white border"
                                            placeholder="Qtd de Vezes (Ex: 3)">
                                        <button class="btn btn-primary fw-bold px-4 rounded-3"
                                            @click="adicionarValorExcursao">Adicionar</button>
                                    </div>
                                    <ul class="list-group list-group-flush border rounded-3 overflow-hidden"
                                        v-if="formEx.valores && formEx.valores.length > 0">
                                        <li v-for="(v, index) in formEx.valores" :key="index"
                                            class="list-group-item d-flex justify-content-between align-items-center py-2 px-3 bg-white">
                                            <span class="small fw-bold text-dark">{{ v.vezes }}x de R$ {{ v.valor
                                                }}</span>
                                            <button class="btn btn-sm text-danger p-1 border-0 bg-transparent"
                                                @click="removerValorExcursao(index)"><svg
                                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    fill="currentColor" viewBox="0 0 16 16">
                                                    <path
                                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                    <path fill-rule="evenodd"
                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                </svg></button>
                                        </li>
                                    </ul>
                                </div>
                                <div
                                    class="col-12 mt-4 p-3 bg-primary bg-opacity-10 rounded-3 border border-primary border-opacity-25">
                                    <label class="form-label small fw-bold text-primary mb-1">Guia Responsável</label>
                                    <select v-model="formEx.guiaId"
                                        class="form-select form-select-lg border-primary fw-bold text-primary bg-white rounded-3">
                                        <option :value="null">-- Não escolhido --</option>
                                        <option v-for="g in guiasDisponiveis" :key="g.id" :value="g.id">{{ g.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer p-4 bg-light border-top d-flex gap-2 rounded-bottom-4">
                            <button v-if="formEx.id"
                                class="btn btn-outline-danger fw-bold rounded-3 py-3 w-100 w-sm-auto me-sm-auto px-4"
                                @click="pedirConfirmacao('excursao', formEx.id, 'Apagar Excursão', 'Deseja continuar?')">Apagar</button>
                            <button class="btn btn-primary fw-bold px-5 py-3 w-100 w-sm-auto rounded-3 shadow-sm"
                                @click="salvarExcursao">Salvar Excursão</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="modalGerenciarEx" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable px-2">
                    <div class="modal-content border-0 shadow-lg rounded-4 bg-light">
                        <div class="modal-header bg-primary text-white p-4 border-0 rounded-top-4">
                            <h5 class="modal-title fw-bold mb-0 fs-5">{{ exSelecionada.nome }}</h5>
                            <button class="btn-close btn-close-white" @click="modalGerenciarEx = false"></button>
                        </div>
                        <div class="modal-body p-3 p-md-4 bg-white">
                            <div v-if="exSelecionada.valores && exSelecionada.valores.length > 0"
                                class="mb-4 p-3 bg-light rounded-3 border border-light text-center text-sm-start">
                                <h6 class="small fw-bold text-secondary text-uppercase mb-2">Opções de Pagamento</h6>
                                <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-start">
                                    <span v-for="(v, i) in exSelecionada.valores" :key="i"
                                        class="badge bg-success text-white px-3 py-2 fs-6 rounded-pill shadow-sm">
                                        {{ v.vezes }}x de R$ {{ v.valor }}
                                    </span>
                                </div>
                            </div>
                            <div
                                class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-3 bg-white rounded-3 shadow-sm border gap-3">
                                <span class="small fw-bold text-secondary text-center w-100 text-md-start">{{
                                    exSelecionada.usuarios.length }} / {{ exSelecionada.vagas }} vagas ocupadas</span>
                                <div class="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                                    <button
                                        class="btn btn-success fw-bold flex-fill rounded-3 px-4 py-2 text-nowrap shadow-sm"
                                        @click="baixarListaPDF(exSelecionada)"
                                        :disabled="exSelecionada.usuarios.length === 0 || !exSelecionada.guiaId">Baixar
                                        PDF</button>
                                    <button
                                        class="btn btn-outline-success fw-bold flex-fill rounded-3 px-4 py-2 text-nowrap"
                                        @click="baixarListaExcel(exSelecionada)"
                                        :disabled="exSelecionada.usuarios.length === 0 || !exSelecionada.guiaId">Baixar
                                        Excel</button>
                                </div>
                            </div>
                            <div v-if="!exSelecionada.guiaId"
                                class="alert alert-danger small fw-bold py-2 px-3 text-center mb-4 border-0 rounded-3">
                                *Vincule um Guia para liberar os downloads</div>
                            <div class="table-responsive border rounded-4 bg-white shadow-sm">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light text-muted small text-uppercase">
                                        <tr>
                                            <th class="ps-4 py-3 border-0 text-start" style="width: 45%;">Nome</th>
                                            <th class="py-3 border-0 text-center" style="width: 35%;">CPF</th>
                                            <th class="pe-4 py-3 border-0 text-end" style="width: 20%;">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="p in exSelecionada.usuarios" :key="p.id">
                                            <td class="ps-4 py-3 fw-bold text-dark small text-start">{{ p.nome }}</td>
                                            <td class="text-muted small py-3 text-center">{{ p.cpf || '-' }}</td>
                                            <td class="pe-4 py-3 text-end">
                                                <button class="btn btn-sm btn-light text-danger rounded-3 px-3 fw-bold"
                                                    @click="removerUserDaEx(p.id, exSelecionada.id)"
                                                    title="Remover da Viagem">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                        fill="currentColor" viewBox="0 0 16 16">
                                                        <path
                                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fill-rule="evenodd"
                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr v-if="exSelecionada.usuarios.length === 0">
                                            <td colspan="3" class="text-center text-muted py-5 small">Nenhum passageiro
                                                na lista.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer p-4 bg-light border-top rounded-bottom-4">
                            <button class="btn btn-outline-primary fw-bold w-100 py-3 rounded-3"
                                @click="prepararEdicaoEx(exSelecionada)">Editar Dados da Viagem</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="modalVincular" class="modal fade show d-block"
                style="background: rgba(0,0,0,0.6); overflow-y: auto;">
                <div class="modal-dialog modal-dialog-centered px-2">
                    <div class="modal-content shadow-lg border-0 rounded-4 bg-light">
                        <div class="modal-header bg-white p-4 border-bottom rounded-top-4">
                            <h5 class="modal-title fw-bold fs-5 text-dark">Adicionar <span class="text-primary">{{
                                    userParaVincular.nome }}</span></h5>
                            <button class="btn-close align-self-start" @click="modalVincular = false"></button>
                        </div>
                        <div class="modal-body p-4 bg-white">
                            <div v-if="!excursaoVinculada">
                                <p class="text-muted small fw-bold mb-3">Escolha a excursão:</p>
                                <div class="d-flex flex-column gap-2">
                                    <button v-for="e in excursoes" :key="e.id"
                                        @click="vincularMainUser(userParaVincular.id, e)"
                                        class="btn btn-white text-start p-3 rounded-3 border shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center bg-white"
                                        :disabled="e._count.usuarios >= e.vagas">
                                        <div><strong class="text-dark d-block mb-1">{{ e.nome }}</strong><small
                                                class="text-muted">{{ e.lugar }}</small></div>
                                        <span class="badge mt-2 mt-sm-0 rounded-pill px-3 py-2"
                                            :class="e._count.usuarios >= e.vagas ? 'bg-danger' : 'bg-primary bg-opacity-10 text-primary'">{{
                                            e._count.usuarios }}/{{ e.vagas }}</span>
                                    </button>
                                </div>
                            </div>
                            <div v-else>
                                <div
                                    class="alert alert-success py-3 mb-4 fw-bold text-center border-0 rounded-3 shadow-sm">
                                    ✔ Adicionado!</div>
                                <div v-if="parentesDoUsuarioSelecionado.length > 0">
                                    <h6 class="fw-bold mb-3 text-secondary">Adicionar parentes também?</h6>
                                    <div class="d-flex flex-column gap-2">
                                        <div v-for="parente in parentesDoUsuarioSelecionado" :key="parente.id"
                                            class="p-3 bg-white rounded-3 shadow-sm border d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3"
                                            :class="{ 'border-success bg-success bg-opacity-10': parentesAdicionadosNaSessao.includes(parente.id) }">
                                            <div><span class="fw-bold d-block"
                                                    :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'text-success' : 'text-dark'">{{
                                                    parente.nome }}</span><small class="text-muted">CPF: {{ parente.cpf
                                                    || '-' }}</small></div>
                                            <button class="btn btn-sm fw-bold rounded-3 px-4 py-2 w-100 w-sm-auto"
                                                :class="parentesAdicionadosNaSessao.includes(parente.id) ? 'btn-success' : 'btn-outline-primary'"
                                                :disabled="parentesAdicionadosNaSessao.includes(parente.id)"
                                                @click="vincularParente(parente, excursaoVinculada.id)">{{
                                                parentesAdicionadosNaSessao.includes(parente.id) ? '✔' : 'Add'
                                                }}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer bg-light p-4 border-top rounded-bottom-4" v-if="excursaoVinculada">
                            <button class="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm"
                                @click="fecharModalVincular">Concluir</button>
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
const pedirConfirmacao = (tipo, id, titulo, texto) => {
    confirmType.value = tipo; confirmId.value = id; confirmTitle.value = titulo; confirmText.value = texto; modalConfirm.value = true
}
const executarConfirmacao = async () => {
    modalConfirm.value = false; if (confirmType.value === 'excursao') { await confirmarDelecaoExcursao(confirmId.value) } else if (confirmType.value === 'user') { await confirmarDelecaoUser(confirmId.value) }
}
const logado = ref(false)
const senha = ref('')
const erroLogin = ref('')
onMounted(() => {
    if (import.meta.client && localStorage.getItem('graziTurAdmin') === 'true') { logado.value = true; carregar() }
})
const fazerLogin = async () => {
    erroLogin.value = ''
    try {
        await $fetch('/api/auth', { method: 'POST', body: { password: senha.value } })
        logado.value = true; if (import.meta.client) localStorage.setItem('graziTurAdmin', 'true'); carregar()
    } catch (e) { erroLogin.value = e.data?.message || 'Senha incorreta.' }
}
const fazerLogout = () => {
    logado.value = false; senha.value = ''; if (import.meta.client) localStorage.removeItem('graziTurAdmin')
    usuarios.value = []; excursoes.value = []
}
const usuarios = ref([])
const excursoes = ref([])
const buscaUser = ref('')
const modalCriarExcursao = ref(false)
const modalGerenciarEx = ref(false)
const modalVincular = ref(false)
const modalUser = ref(false)
const formEx = ref({ id: null, nome: '', lugar: '', vagas: '', guiaId: null, valores: [] })
const exSelecionada = ref(null)
const userParaVincular = ref(null)
const excursaoVinculada = ref(null)
const parentesAdicionadosNaSessao = ref([])
const ignorarRegras = ref(false)
const formUser = ref({ id: null, nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] })
const buscaParenteModal = ref('')
const novoValor = ref('')
const novasVezes = ref('')
const adicionarValorExcursao = () => {
    if (novoValor.value && novasVezes.value) {
        if (!formEx.value.valores) formEx.value.valores = []
        formEx.value.valores = [...formEx.value.valores, { valor: parseFloat(novoValor.value), vezes: parseInt(novasVezes.value) }]
        novoValor.value = ''; novasVezes.value = ''
    }
}
const removerValorExcursao = (index) => { formEx.value.valores = formEx.value.valores.filter((_, i) => i !== index) }
const formatarData = (event) => {
    let v = event.target.value.replace(/\D/g, '')
    if (v.length >= 5) { v = v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3') }
    else if (v.length >= 3) { v = v.replace(/(\d{2})(\d{1,4})/, '$1/$2') }
    formUser.value.nascimento = v
}
const validarCPF = (cpf) => {
    if (!cpf) return true;
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
    let soma = 0, resto
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false
    soma = 0
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11))) return false
    return true
}
const carregar = async () => {
    const timestamp = new Date().getTime()
    usuarios.value = await $fetch(`/api/users?t=${timestamp}`)
    const resExcursoes = await $fetch(`/api/excursoes?includeUsers=true&t=${timestamp}`)
    excursoes.value = resExcursoes.map(ex => {
        let val = []
        if (ex.valores) { try { val = typeof ex.valores === 'string' ? JSON.parse(ex.valores) : ex.valores } catch (e) { } }
        return { ...ex, valores: Array.isArray(val) ? val : [] }
    })
    if (exSelecionada.value) {
        const atualizada = excursoes.value.find(e => e.id === exSelecionada.value.id)
        if (atualizada) exSelecionada.value = atualizada
    }
}
const usuariosFiltrados = computed(() => {
    if (!buscaUser.value) return usuarios.value
    return usuarios.value.filter(u => u.nome.toLowerCase().includes(buscaUser.value.toLowerCase()) || (u.cpf && u.cpf.includes(buscaUser.value)))
})
const guiasDisponiveis = computed(() => usuarios.value.filter(u => u.isGuia))
const abrirModalExcursao = () => { formEx.value = { id: null, nome: '', lugar: '', vagas: '', guiaId: null, valores: [] }; modalCriarExcursao.value = true }
const salvarExcursao = async () => {
    const method = formEx.value.id ? 'PUT' : 'POST'; const url = formEx.value.id ? `/api/excursoes/${formEx.value.id}` : '/api/excursoes'
    const payload = { ...formEx.value, valores: JSON.stringify(formEx.value.valores || []) }
    try { await $fetch(url, { method, body: payload }); showToast('Sucesso!', 'success'); fecharExcursao(); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const confirmarDelecaoExcursao = async (id) => {
    try { await $fetch(`/api/excursoes/${id}`, { method: 'DELETE' }); showToast('Apagado!', 'success'); fecharExcursao(); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const abrirGerenciarExcursao = (ex) => { exSelecionada.value = excursoes.value.find(e => e.id === ex.id); modalGerenciarEx.value = true }
const fecharExcursao = () => { modalCriarExcursao.value = false; modalGerenciarEx.value = false }
const prepararEdicaoEx = (ex) => { formEx.value = { ...ex, valores: ex.valores ? [...ex.valores] : [] }; modalGerenciarEx.value = false; modalCriarExcursao.value = true }
const prepararNovoUser = () => {
    ignorarRegras.value = false; formUser.value = { id: null, nome: '', email: '', cpf: '', orgaoExpeditor: '', nascimento: '', celular: '', cidade: '', endereco: '', idade: '', isGuia: false, parentesSelecionados: [] }; buscaParenteModal.value = ''; modalUser.value = true
}
const prepararEdicaoUser = (u) => {
    ignorarRegras.value = false
    const listaBruta = [...(u.parentes || []), ...(u.parentesDe || [])]; const listaParentes = [...new Map(listaBruta.map(item => [item.id, item])).values()]
    formUser.value = { id: u.id, nome: u.nome, email: u.email, cpf: u.cpf, orgaoExpeditor: u.orgaoExpeditor, nascimento: u.nascimento, celular: u.celular, idade: u.idade, cidade: u.cidade, endereco: u.endereco, isGuia: u.isGuia, parentesSelecionados: listaParentes }; buscaParenteModal.value = ''; modalUser.value = true
}
const salvarUser = async () => {
    if (!ignorarRegras.value) {
        const campos = ['nome', 'email', 'cpf', 'nascimento', 'orgaoExpeditor', 'celular', 'cidade', 'endereco']
        if (campos.some(c => !formUser.value[c])) { showToast("Preencha os campos obrigatórios (*).", "warning"); return }
        if (formUser.value.cpf && !validarCPF(formUser.value.cpf)) { showToast("CPF inválido!", "danger"); return }
    } else {
        if (!formUser.value.nome) { showToast("O Nome é obrigatório!", "warning"); return }
    }
    const payload = { ...formUser.value, parentesIds: formUser.value.parentesSelecionados.map(p => p.id) }
    const method = formUser.value.id ? 'PUT' : 'POST'; const url = formUser.value.id ? `/api/users/${formUser.value.id}` : '/api/users'
    try { await $fetch(url, { method, body: payload }); showToast('Salvo!', 'success'); modalUser.value = false; await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const confirmarDelecaoUser = async (id) => {
    try { await $fetch(`/api/users/${id}`, { method: 'DELETE' }); showToast('Removido!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const usuariosParaParenteFiltrados = computed(() => {
    if (!buscaParenteModal.value) return []
    return usuarios.value.filter(u => u.id !== formUser.value.id && u.nome.toLowerCase().includes(buscaParenteModal.value.toLowerCase())).map(u => ({ ...u, jaAdicionado: formUser.value.parentesSelecionados.some(p => p.id === u.id) })).slice(0, 5)
})
const adicionarParenteNoForm = (user) => { if (!formUser.value.parentesSelecionados.some(p => p.id === user.id)) { formUser.value.parentesSelecionados = [...formUser.value.parentesSelecionados, user]; } }
const removerParenteDoForm = (index) => { formUser.value.parentesSelecionados.splice(index, 1) }
const parentesDoUsuarioSelecionado = computed(() => {
    if (!userParaVincular.value) return []
    const listaBruta = [...(userParaVincular.value.parentes || []), ...(userParaVincular.value.parentesDe || [])]; const listaUnica = [...new Map(listaBruta.map(item => [item.id, item])).values()]
    return listaUnica.map(p => ({ ...p, adicionado: false }))
})
const abrirVincular = (u) => { userParaVincular.value = u; excursaoVinculada.value = null; parentesAdicionadosNaSessao.value = []; modalVincular.value = true }
const fecharModalVincular = () => { modalVincular.value = false; excursaoVinculada.value = null; carregar() }
const vincularMainUser = async (userId, excursao) => {
    if (excursao.guiaId === userId) { showToast('Guia da viagem!', 'warning'); return }
    try { await $fetch('/api/vincular', { method: 'POST', body: { userId, excursaoId: excursao.id } }); excursaoVinculada.value = excursao; showToast('Adicionado!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const vincularParente = async (parente, excursaoId) => {
    if (parentesAdicionadosNaSessao.value.includes(parente.id)) return
    if (excursaoVinculada.value && excursaoVinculada.value.guiaId === parente.id) { showToast('É o Guia!', 'warning'); return }
    try { await $fetch('/api/vincular', { method: 'POST', body: { userId: parente.id, excursaoId } }); parentesAdicionadosNaSessao.value.push(parente.id); showToast('Adicionado!', 'success'); await carregar() } catch (e) { showToast('Erro!', 'danger') }
}
const removerUserDaEx = async (userId, excursaoId) => {
    try { await $fetch('/api/desvincular', { method: 'POST', body: { userId, excursaoId } }); await carregar(); showToast('Removido!', 'success') } catch (e) { showToast('Erro!', 'danger') }
}
const baixarListaPDF = async (excursao) => {
    if (!import.meta.client) return;
    try {
        const { jsPDF } = await import('jspdf'); const autoTableModule = await import('jspdf-autotable'); const autoTable = autoTableModule.default || autoTableModule; const doc = new jsPDF()
        doc.setFontSize(22); doc.setTextColor(13, 110, 253); doc.text(`Lista de Passageiros`, 14, 22)
        doc.setFontSize(14); doc.setTextColor(50, 50, 50); doc.text(`Excursão: ${excursao.nome}`, 14, 32)
        doc.setFontSize(11); doc.setTextColor(100, 100, 100); doc.text(`Destino: ${excursao.lugar}`, 14, 40)
        let listaCompleta = [...excursao.usuarios]
        if (excursao.guia) {
            const guiaJaNaLista = listaCompleta.some(u => u.id === excursao.guia.id)
            if (!guiaJaNaLista) { listaCompleta.push({ ...excursao.guia, nome: `${excursao.guia.nome} (GUIA)` }) }
            else { const indexGuia = listaCompleta.findIndex(u => u.id === excursao.guia.id); listaCompleta[indexGuia].nome = `${listaCompleta[indexGuia].nome} (GUIA)` }
        }
        listaCompleta.sort((a, b) => a.nome.localeCompare(b.nome))
        const dadosTabela = listaCompleta.map((user, index) => [index + 1, user.nome, user.cpf || '-', user.orgaoExpeditor || '-'])
        autoTable(doc, { startY: 50, head: [['Nº', 'Nome Completo', 'CPF', 'Órgão Expeditor']], body: dadosTabela, headStyles: { fillColor: [13, 110, 253], textColor: 255 }, alternateRowStyles: { fillColor: [245, 248, 250] }, styles: { fontSize: 10, cellPadding: 4 } })
        doc.save(`Lista_${excursao.nome.replace(/\s+/g, '_')}.pdf`); showToast('Sucesso!', 'success')
    } catch (error) { showToast('Erro no PDF!', 'danger') }
}
const baixarListaExcel = (excursao) => {
    let listaCompleta = [...excursao.usuarios]
    if (excursao.guia) {
        const guiaJaNaLista = listaCompleta.some(u => u.id === excursao.guia.id)
        if (!guiaJaNaLista) { listaCompleta.push({ ...excursao.guia, nome: `${excursao.guia.nome} (GUIA)` }) }
        else { const indexGuia = listaCompleta.findIndex(u => u.id === excursao.guia.id); listaCompleta[indexGuia].nome = `${listaCompleta[indexGuia].nome} (GUIA)` }
    }
    listaCompleta.sort((a, b) => a.nome.localeCompare(b.nome))
    let csvContent = "\uFEFFNº;Nome Completo;CPF;Órgão Expeditor\n"
    listaCompleta.forEach((user, index) => {
        const nome = user.nome.replace(/;/g, ','); const cpf = user.cpf || '-'; const orgao = user.orgaoExpeditor || '-'
        csvContent += `${index + 1};${nome};${cpf};${orgao}\n`
    })
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); const url = URL.createObjectURL(blob); link.setAttribute("href", url); link.setAttribute("download", `Lista_${excursao.nome.replace(/\s+/g, '_')}.csv`); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link); showToast('Planilha gerada!', 'success')
}
</script>
<style scoped>
.btn-card {
    transition: transform 0.2s ease;
    cursor: pointer;
    border-width: 1px !important;
}

.btn-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 .25rem .5rem rgba(0, 0, 0, .08) !important;
    border-color: #0d6efd !important;
}

.cursor-pointer {
    cursor: pointer;
}

.border-dashed {
    border-style: dashed !important;
}
</style>