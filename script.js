document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // MENU MOBILE
  // ===============================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // ===============================
  // HEADER SCROLL
  // ===============================
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // ===============================
  // SCROLL SUAVE
  // ===============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }

      if (navLinks && hamburger) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  });

  // ===============================
  // ANO AUTOMÁTICO
  // ===============================
  const ano = document.getElementById('anoAtual');
  if (ano) {
    ano.textContent = new Date().getFullYear();
  }

  // ===============================
  // MÁSCARA TELEFONE
  // ===============================
  const telefoneInput = document.getElementById('telefone');

  if (telefoneInput) {
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
  }

  // ===============================
  // FORMULÁRIO
  // ===============================
  const form = document.getElementById('orderForm');
  const successBox = document.getElementById('formSuccess');
  const novoPedidoBtn = document.getElementById('novoPedido');

  if (form && successBox) {

    // GARANTE que começa escondido
    successBox.hidden = true;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = form.nome;
      const telefone = form.telefone;
      const quantidade = form.quantidade;
      const observacoes = form.observacoes;

      let valido = true;

      document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
      document.querySelectorAll('.form__input').forEach(el => el.classList.remove('error'));

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

      // GOOGLE SHEETS
      try {
        await fetch('https://script.google.com/macros/s/AKfycbwq0E6di0uCT1zYWVJ0ZySDf470xlVkkVbF75M140-TRRBD0Uk01DWvd50l7H_aWEpspg/exec', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.warn("Erro ao salvar:", error);
      }

      // WHATSAPP
      const mensagem = `
Olá! Quero fazer um pedido de suco 🍊

Nome: ${data.nome}
Telefone: ${data.telefone}
Quantidade: ${data.quantidade}
Observações: ${data.observacoes || 'Nenhuma'}

Vim pelo site 😊
`;

      window.open(`https://wa.me/5517996700461?text=${encodeURIComponent(mensagem)}`, '_blank');

      // MOSTRAR SUCESSO
      form.style.display = 'none';
      successBox.hidden = false;
    });

    // NOVO PEDIDO
    if (novoPedidoBtn) {
      novoPedidoBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'flex';
        successBox.hidden = true;
      });
    }
  }

});