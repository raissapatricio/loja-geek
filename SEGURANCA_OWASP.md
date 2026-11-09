# SecureCommerce — Documentação de Segurança & OWASP Top 10

Este documento detalha todos os mecanismos de segurança implementados no sistema **SecureCommerce**, correlacionando cada um deles com as diretrizes do **OWASP Top 10 (2021)**.

---

## 1. A01:2021 — Broken Access Control (Controle de Acesso Quebrado)

### O Problema
Falhas que permitem que usuários acessem recursos ou executem ações além das suas permissões (ex: ver pedidos de outro usuário, acessar rotas de admin).

### Implementação no SecureCommerce
1. **RBAC (Role-Based Access Control):** Dois papéis distintos: `USER` e `ADMIN`.
2. **Middleware `requireAdmin`:** Bloqueia qualquer requisição para `/api/admin/*` feita por usuários comuns:
   ```typescript
   export const requireAdmin = (req, res, next) => {
     if (!req.user || req.user.role !== 'ADMIN') {
       return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
     }
     next();
   };
   ```
3. **Verificação de Propriedade de Recursos:**
   - Ao buscar um pedido (`GET /api/orders/:id`), o backend força a cláusula:
     ```typescript
     where: { id, userId: req.user.id } // Impossível ver o pedido de outro usuário
     ```
   - No checkout, o backend verifica se o endereço fornecido pertence ao usuário autenticado:
     ```typescript
     where: { id: data.addressId, userId }
     ```

---

## 2. A02:2021 — Cryptographic Failures (Falhas Criptográficas)

### O Problema
Armazenamento inadequado de senhas, exposição de dados de cartão e dados sensíveis em trânsito.

### Implementação no SecureCommerce
1. **Hash de Senhas:** Utiliza **bcrypt** com fator de custo `12` (`SALT_ROUNDS = 12`).
   - Senhas **nunca** são salvas em texto puro.
   - O campo `passwordHash` nunca é retornado em respostas da API (usando `select` explícito do Prisma).
2. **Proteção de Dados de Cartão de Crédito:**
   - **CVV:** Nunca é persistido no banco de dados.
   - **Número Completo:** Nunca é salvo no banco de dados.
   - **Armazenado apenas:** Bandeira (ex: Visa) e últimos 4 dígitos (`lastFour`) para exibição em comprovantes.
3. **Cookies HttpOnly:** O token JWT é transmitido exclusivamente via cookie HttpOnly:
   ```typescript
   res.cookie('token', token, {
     httpOnly: true,  // Inacessível via JavaScript (mitiga XSS)
     secure: isProduction, // HTTPS em produção
     sameSite: 'lax', // Proteção contra CSRF
     maxAge: 7 * 24 * 60 * 60 * 1000,
   });
   ```

---

## 3. A03:2021 — Injection (Injeção de Código e SQL)

### O Problema
Entrada de dados não sanitizada é executada diretamente pelo interpretador SQL.

### Implementação no SecureCommerce
1. **ORM Prisma:** Todas as consultas utilizam queries parametrizadas nativamente, impossibilitando SQL Injection tradicional:
   ```typescript
   await prisma.user.findFirst({ where: { email } }); // Parametrizado automaticamente
   ```
2. **Validação de Entrada com Zod:** Todas as rotas passam por esquemas estritos de validação antes de qualquer processamento:
   - Tamanhos mínimos e máximos.
   - Validação de tipos (números, strings, datas).
   - Formatos específicos (e-mail, CPF com dígitos verificadores).

---

## 4. A04:2021 — Insecure Design (Design Inseguro)

### O Problema
Vulnerabilidades na lógica de negócios, como confiar em dados enviados pelo cliente para cálculos financeiros.

### Implementação no SecureCommerce
1. **Recálculo no Servidor:**
   - O frontend envia apenas os `id`s dos produtos e as quantidades.
   - O backend busca os preços atualizados e o estoque diretamente no banco de dados.
   - **O preço enviado pelo cliente é completamente ignorado.**
2. **Transação Atômica no Pedido:**
   - A criação do pedido, o registro dos itens e o decremento do estoque são executados dentro de um `prisma.$transaction`.
   - Se qualquer etapa falhar, nenhuma alteração é persistida (evita pedidos sem estoque ou estados inconsistentes).

---

## 5. A05:2021 — Security Misconfiguration (Configuração Insegura)

### O Problema
Headers HTTP ausentes, mensagens de erro detalhadas expondo o stack trace, CORS permissivo.

### Implementação no SecureCommerce
1. **Helmet.js:** Configura headers HTTP essenciais:
   - `X-Content-Type-Options: nosniff` (impede MIME sniffing).
   - `X-Frame-Options: DENY` (previne Clickjacking).
   - `Strict-Transport-Security` (força HTTPS).
2. **CORS Restrito:** Permite apenas a origem do frontend configurada via variável de ambiente:
   ```typescript
   cors({ origin: process.env.FRONTEND_URL, credentials: true });
   ```
3. **Tratamento de Erros Seguro:** O middleware de erro global nunca expõe traces ou mensagens internas para o cliente:
   ```typescript
   res.status(500).json({ error: 'Erro interno do servidor. Tente novamente mais tarde.' });
   ```

---

## 6. A07:2021 — Identification and Authentication Failures (Falhas de Autenticação)

### O Problema
Ataques de força bruta, enumeração de usuários, senhas fracas.

### Implementação no SecureCommerce
1. **Rate Limiting no Login:**
   - Máximo de **5 tentativas de login por IP a cada 15 minutos**:
   ```typescript
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5,
     message: { error: 'Muitas tentativas de login. Aguarde 15 minutos.' }
   });
   ```
2. **Prevenção de Enumeração de Usuários:**
   - Tanto para usuário inexistente quanto para senha incorreta, a resposta é idêntica: `"Credenciais inválidas."`
   - O tempo de resposta para usuários inexistentes inclui um hash fictício para evitar **timing attacks**.
3. **Política de Senhas Fortes:**
   - Mínimo de 8 caracteres.
   - Obrigatoriedade de letra maiúscula e número.
   - Validação tanto no formulário (frontend) quanto no schema Zod (backend).
4. **Validação de CPF Real:**
   - Algoritmo dos dígitos verificadores implementado no frontend e backend.
   - Rejeição de CPFs inválidos ou sequenciais (ex: 111.111.111-11).

---

## 7. Mascaramento de Dados Sensíveis (LGPD / Privacidade)

- **CPF:** Exibido sempre mascarado em telas de perfil e painel administrativo:
  - Formato exibido: `***.***.123-45`
- **Cartão de Crédito:** Exibido apenas como:
  - `•••• •••• •••• 1234`

