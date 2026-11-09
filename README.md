# SecureCommerce — E-commerce Seguro com Boas Práticas OWASP

Sistema completo de e-commerce desenvolvido com foco em segurança da informação, arquitetura em camadas e prevenção de vulnerabilidades do **OWASP Top 10**.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, React Hot Toast
- **Backend:** Node.js, Express, TypeScript, Helmet, CORS, Cookie-Parser, Express Rate Limit
- **Banco de Dados Relacional:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT armazenado em cookies `HttpOnly` e `SameSite`
- **Validação de Dados:** Zod
- **Criptografia de Senhas:** Bcrypt (12 salt rounds)

---

## 🚀 Como Instalar e Rodar na Máquina da Faculdade (Passo a Passo)

Siga este roteiro na máquina onde você for apresentar o projeto:

### 1. Pré-requisitos
Certifique-se de que a máquina possui:
- **Node.js** (versão 18 ou superior) 👉 [Baixar Node.js](https://nodejs.org/)
- **Git** 👉 [Baixar Git](https://git-scm.com/)
- **PostgreSQL** e **pgAdmin 4** 👉 [Baixar PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

---

### 2. Clonar o Repositório
Abra o **Prompt de Comando (CMD)** ou **PowerShell** e rode:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd atividade_loja
```

---

### 3. Configurar o Banco de Dados no pgAdmin 4
1. Abra o **pgAdmin 4** e conecte-se ao seu servidor PostgreSQL.
2. Crie uma nova base de dados chamada:
   ```text
   securecommerce
   ```

---

### 4. Configurar e Inicializar o Backend

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o arquivo `.env`:
   - Copie o arquivo `.env.example` para `.env` (ou crie um arquivo chamado `.env` dentro da pasta `backend`).
   - Ajuste com a senha que você colocou no PostgreSQL da máquina:
     ```env
     DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/securecommerce"
     JWT_SECRET="chave_secreta_jwt_para_fins_academicos_2026_segura"
     JWT_EXPIRES_IN="7d"
     PORT=3001
     NODE_ENV=development
     FRONTEND_URL="http://localhost:5173"
     RATE_LIMIT_WINDOW_MS=900000
     RATE_LIMIT_MAX_REQUESTS=100
     LOGIN_RATE_LIMIT_MAX=5
     ```

4. Crie as tabelas em português no banco de dados:
   ```bash
   npx prisma db push
   ```

5. Popule o banco com produtos fictícios e contas de teste:
   ```bash
   npx ts-node prisma/seed.ts
   ```

6. Inicie o servidor backend:
   ```bash
   npm run dev
   ```
   *(O backend estará rodando em `http://localhost:3001`)*

---

### 5. Configurar e Inicializar o Frontend

Abra um **segundo terminal** (mantenha o backend rodando no primeiro):

```bash
cd atividade_loja/frontend
npm install
npm run dev
```

Abra o navegador no endereço: **http://localhost:5173**

---

## 🔑 Credenciais Padrão de Teste

| Perfil | E-mail | Senha | Acesso |
|---|---|---|---|
| **Administrador** | `admin@securecommerce.com` | `Admin@123456` | Painel `/admin` completo (produtos, pedidos, status, usuários) |
| **Cliente de Teste** | `joao@teste.com` | `User@123456` | Loja virtual, carrinho individual, checkout e `/orders` |

---

## 🧪 Roteiro de Testes para o Professor

Durante a avaliação prática, você demonstrará as 3 etapas solicitadas:

### Etapa 1: Criar um Usuário Real
1. No site, clique em **Criar conta** (`http://localhost:5173/register`).
2. Digite dados de teste:
   - **Nome:** Nome do Professor ou do Aluno
   - **CPF:** `529.982.247-25` *(validação de algoritmo de CPF real ativo)*
   - **CEP:** `01310-100` *(autocompleta o logradouro via CEP)*
   - **Senha:** `Teste@123456`
3. Clique em **Criar Conta** (o login será automático).

---

### Etapa 2: Realizar uma Transação (Compra)
1. Escolha qualquer produto na vitrine e clique em **Adicionar ao Carrinho**.
2. Abra o carrinho no topo direito e clique em **Finalizar Compra**.
3. Na simulação de pagamento:
   - **Nome no cartão:** `TESTE PROFESSOR`
   - **Número do cartão:** `4111 1111 1111 1234`
   - **Mês / Ano:** `12 / 2029`
   - **CVV:** `123`
4. Clique em **Confirmar Pedido**.
5. O pedido será registrado com status `PAGAMENTO APROVADO` e código de rastreamento fictício gerado!

---

### Etapa 3: Consultar os Dados Diretamente no pgAdmin 4
Abra a **Query Tool** no banco `securecommerce` e rode as queries abaixo para demonstrar a segurança ao professor:

```sql
-- 1. Ver os usuários e a senha criptografada em Bcrypt (OWASP A02)
SELECT id, nome, email, cpf, senha_hash, perfil, criado_em 
FROM usuarios;

-- 2. Ver a transação e o pedido realizado
SELECT p.id, u.nome, p.total, p.status_pedido, p.status_pagamento, p.codigo_rastreio
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id;

-- 3. Ver proteção dos dados de cartão (OWASP A02 / PCI-DSS)
-- Não existe coluna de CVV e o número completo nunca é armazenado
SELECT bandeira, ultimos_quatro_digitos, mes_validade, ano_validade
FROM informacoes_cartao;

-- 4. Ver itens adquiridos na compra
SELECT pr.nome, ip.quantidade, ip.preco_unitario
FROM itens_pedido ip
JOIN produtos pr ON ip.produto_id = pr.id;

-- 5. Ver endereços de entrega
SELECT u.nome, e.logradouro, e.numero, e.bairro, e.cidade, e.estado, e.cep
FROM enderecos e
JOIN usuarios u ON e.usuario_id = u.id;
```

---

## 🛡️ Mecanismos de Segurança Implementados (OWASP Top 10)

- **A01: Broken Access Control:** Rotas privadas protegidas via middleware com RBAC (`ADMIN` vs `USER`). Verificação estrita de propriedade (um usuário só visualiza seus próprios pedidos).
- **A02: Cryptographic Failures:** Senhas protegidas com `bcrypt` (12 salt rounds). CVV e número de 16 dígitos do cartão nunca são persistidos. Cookies de sessão com flags `HttpOnly` e `SameSite`.
- **A03: Injection:** Consultas no banco via ORM Prisma com parâmetros sanitizados (blindagem contra SQL Injection). Validações estritas de schema via `Zod`.
- **A04: Insecure Design:** Carrinho individual por usuário logado. Recálculo integral de preços e frete no servidor (o frontend nunca define o valor total).
- **A05: Security Misconfiguration:** Headers de segurança ativados via `Helmet`. CORS restrito à origem do frontend.
- **A07: Identification & Auth Failures:** Rate limiting no login (máximo 5 tentativas/15 min) para mitigação de força bruta. Mensagens de erro padronizadas para evitar enumeração de contas.
