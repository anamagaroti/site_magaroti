// ===============================
// MENU MOBILE
// ===============================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

// ===============================
// HEADER SCROLL
// ===============================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===============================
// SCROLL SUAVE (âncoras)
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }

    // Fecha menu mobile ao clicar
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});


// ===============================
// ANO AUTOMÁTICO
// ===============================
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// ===============================
// MÁSCARA TELEFONE
// ===============================
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
  } else {
    value = value.replace(/^(\d*)/, '($1');
  }

  e.target.value = value;
});

// ===============================
// FORMULÁRIO (VERSÃO CORRETA)
// ===============================
const form = document.getElementById('orderForm');
const successBox = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = form.nome;
  const telefone = form.telefone;
  const quantidade = form.quantidade;
  const observacoes = form.observacoes;

  let valido = true;

  // LIMPAR ERROS
  document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form__input').forEach(el => el.classList.remove('error'));

  // VALIDAÇÃO
  if (!nome.value.trim()) {
    document.getElementById('erroNome').textContent = 'Digite seu nome';
    nome.classList.add('error');
    valido = false;
  }

  if (telefone.value.replace(/\D/g, '').length < 10) {
    document.getElementById('erroTelefone').textContent = 'Telefone inválido';
    telefone.classList.add('error');
    valido = false;
  }

  if (!quantidade.value) {
    document.getElementById('erroQuantidade').textContent = 'Selecione a quantidade';
    quantidade.classList.add('error');
    valido = false;
  }

  if (!valido) return;

  const data = {
    nome: nome.value,
    telefone: telefone.value,
    quantidade: quantidade.value,
    observacoes: observacoes.value,
    data: new Date().toLocaleString()
  };

  // ===============================
  // ENVIAR PARA GOOGLE SHEETS
  // ===============================
  try {
    await fetch('https://script.google.com/macros/s/AKfycbwq0E6di0uCT1zYWVJ0ZySDf470xlVkkVbF75M140-TRRBD0Uk01DWvd50l7H_aWEpspg/exec', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.warn("Erro ao salvar na planilha:", error);
  }

  // ===============================
  // MONTAR WHATSAPP
  // ===============================
  const mensagem = `
Olá! Quero fazer um pedido de suco de laranja 🍊

Nome: ${data.nome}
Telefone: ${data.telefone}
Quantidade: ${data.quantidade}
Observações: ${data.observacoes || 'Nenhuma'}

Vim pelo site 😊
`;

  const numero = "5517996700461"; // SEU NÚMERO

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, '_blank');

  // FEEDBACK VISUAL
  form.style.display = 'none';
  successBox.hidden = false;
});

// ===============================
// NOVO PEDIDO
// ===============================
document.getElementById('novoPedido').addEventListener('click', () => {
  form.reset();
  form.style.display = 'flex';
  successBox.hidden = true;
});