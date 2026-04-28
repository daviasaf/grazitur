```markdown
# 🚍 GraziTur - Guia de Comandos e Manutenção

Este repositório contém o sistema da **GraziTur**, desenvolvido com **Nuxt 3**, **Prisma ORM** e **Tailwind CSS**.

O projeto utiliza um banco de dados **PostgreSQL** (Supabase) e está configurado para deploy no **Render**.

---

# 🛠️ Comandos de Instalação e Desenvolvimento

Sempre que baixar o projeto em uma nova máquina ou iniciar o dia de trabalho:

## 1️⃣ Instalar Dependências

    npm install

---

## 2️⃣ Rodar em Ambiente Local

Inicia o servidor local com atualização em tempo real.

    npm run dev

O sistema estará disponível em:

    http://localhost:3000

---

## 3️⃣ Gerar Build de Produção (Teste Local)

Cria a versão otimizada do site para o servidor.

    npm run build

---

# 🗄️ Gerenciamento do Banco de Dados (Prisma)

Sempre que você alterar o arquivo:

`prisma/schema.prisma`

(como adicionar novos campos de valores ou contrato), siga esta ordem de comandos:

---

## 1️⃣ Sincronizar o Banco de Dados

Envia as mudanças feitas no arquivo local diretamente para o banco de dados do Supabase.

    npx prisma db push

---

## 2️⃣ Atualizar o Cliente do Prisma

Reconstrói a biblioteca interna para que o código Nuxt reconheça as novas colunas e tabelas.

    npx prisma generate

---

## 3️⃣ Abrir o Prisma Studio (Visualizador)

Abre uma interface no navegador para ver, editar ou apagar dados das tabelas manualmente.

    npx prisma studio

---

# 🚀 Configuração de Deploy (Render.com)

No painel do **Render**, utilize os seguintes comandos **exatos** para garantir que o site e o banco funcionem corretamente:

---

## 🔧 Build Command (Comando de Construção)

    npm install && npx prisma generate && npx prisma db push && npm run build

---

## ▶️ Start Command (Comando de Inicialização)

    node .output/server/index.mjs

---

# 🔑 Variáveis de Ambiente (.env)

Certifique-se de que o seu arquivo `.env` contenha as seguintes chaves
(tanto localmente quanto no painel do Render):

    # Link de conexão principal do Supabase
    DATABASE_URL="sua_url_aqui"

    # Link de conexão direta do Supabase
    DIRECT_URL="sua_url_direta_aqui"

    # Senha definida para o painel /admin
    ADMIN_PASSWORD="sua_senha_aqui"

---

# 📁 Estrutura de Pastas Relevantes

## /pages
Onde ficam as telas principais
(`index.vue` e `admin.vue`).

## /server/api
Lógica de backend para usuários, excursões e vínculos.

## /prisma
Configuração da estrutura do banco de dados
(`schema.prisma`).
```
