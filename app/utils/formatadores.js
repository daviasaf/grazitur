export const mascaraData = (v) => {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if (v.length >= 5) return v.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
  if (v.length >= 3) return v.replace(/(\d{2})(\d{1,4})/, "$1/$2");
  return v;
};

export const mascaraHora = (v) => {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if (v.length > 4) v = v.substring(0, 4);
  if (v.length > 2) v = v.replace(/(\d{2})(\d{1,2})/, "$1:$2");
  return v;
};

export const mascaraCPF = (v) => {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
};

export const validarCPF = (cpf) => {
  if (!cpf) return true;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf === "" || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export const mascaraRG = (v) => {
  if (!v) return "";
  v = v.replace(/\D/g, "");
  if (v.length > 9) v = v.substring(0, 9);
  // Formato: 00.000.000-0
  return v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/, "$1.$2.$3-$4");
};