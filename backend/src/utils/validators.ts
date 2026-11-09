// Validação de CPF brasileiro com dígitos verificadores
export function validateCPF(cpf: string): boolean {
  // Remove formatação
  const cleaned = cpf.replace(/[^\d]/g, '');

  if (cleaned.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10])) return false;

  return true;
}

// Formata CPF para armazenamento (apenas dígitos)
export function cleanCPF(cpf: string): string {
  return cpf.replace(/[^\d]/g, '');
}

// Mascara CPF para exibição (somente os últimos 4 dígitos visíveis)
export function maskCPF(cpf: string): string {
  const cleaned = cleanCPF(cpf);
  return `***.***.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

// Gera código de rastreamento fictício
export function generateTrackingCode(): string {
  const prefix = 'SC';
  const numbers = Math.floor(Math.random() * 900000000 + 100000000).toString();
  const suffix = 'BR';
  return `${prefix}${numbers}${suffix}`;
}

