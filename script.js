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
  // ADICIONAR / REMOVER ITEM DE QUANTIDADE
  // ===============================
  const btnAddItem = document.getElementById('btnAddItem');
  const btnRemoveItem = document.getElementById('btnRemoveItem');
  const item2 = document.getElementById('item2');

  if (btnAddItem && btnRemoveItem && item2) {
    btnAddItem.addEventListener('click', () => {
      item2.removeAttribute('hidden');
      btnAddItem.style.display = 'none';
    });

    btnRemoveItem.addEventListener('click', () => {
      item2.setAttribute('hidden', '');
      btnAddItem.style.display = '';
      document.getElementById('qtd2').value = '';
      document.getElementById('tipo2').selectedIndex = 0;
    });
  }

  // ===============================
  // FORMULÁRIO
  // ===============================
  const form = document.getElementById('orderForm');
  const successBox = document.getElementById('formSuccess');
  const novoPedidoBtn = document.getElementById('novoPedido');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (form && successBox) {

    successBox.removeAttribute('hidden');
    successBox.setAttribute('hidden', '');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = form.nome;
      const telefone = form.telefone;
      const observacoes = form.observacoes;
      const qtd1 = document.getElementById('qtd1');
      const tipo1 = document.getElementById('tipo1');
      const qtd2 = document.getElementById('qtd2');
      const tipo2 = document.getElementById('tipo2');

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

      const item1valido = qtd1.value && tipo1.value;
      const item2visivel = item2 && !item2.hasAttribute('hidden');
      const item2valido = !item2visivel || (qtd2.value && tipo2.value);

      if (!item1valido || !item2valido) {
        document.getElementById('erroQuantidade').textContent =
          'Preencha a quantidade e a embalagem de cada item';
        valido = false;
      }

      if (!valido) return;

      // Monta string de quantidade para a planilha
      let quantidadeTexto = `${qtd1.value}x ${tipo1.value}`;
      if (item2visivel && qtd2.value && tipo2.value) {
        quantidadeTexto += ` + ${qtd2.value}x ${tipo2.value}`;
      }

      // BLOQUEAR BOTÃO + LOADING
      submitBtn.disabled = true;
      btnText.innerHTML = '<span class="btn-spinner"></span> Enviando...';

      const data = {
        tipoContato: 'Pedido',
        nome: nome.value,
        telefone: telefone.value,
        quantidade: quantidadeTexto,
        observacoes: observacoes.value,
        data: new Date().toLocaleString()
      };

      // GOOGLE SHEETS
      try {
        await fetch('https://script.google.com/macros/s/AKfycbzIMUTYSZ9yleabhrE8B2kZKUPbVZaN9XLtvMnp3wA33dvc8P2O_6bOsZIN1VyP4_jwqw/exec', {
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

      window.open(`https://wa.me/5517997368540?text=${encodeURIComponent(mensagem)}`, '_blank');

      // RESTAURAR BOTÃO
      submitBtn.disabled = false;
      btnText.innerHTML = 'Enviar pedido 🍊';

      // MOSTRAR SUCESSO
      form.style.display = 'none';
      successBox.removeAttribute('hidden');
    });

    // NOVO PEDIDO
    if (novoPedidoBtn) {
      novoPedidoBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'flex';
        successBox.setAttribute('hidden', '');

        // Resetar item2 também
        if (item2) {
          item2.setAttribute('hidden', '');
          document.getElementById('qtd2').value = '';
          document.getElementById('tipo2').selectedIndex = 0;
        }
        if (btnAddItem) btnAddItem.style.display = '';
      });
    }
  }

  // ===============================
  // FORMULÁRIO DE EVENTOS
  // ===============================
  const evtForm = document.getElementById('evtForm');
  const evtFormSuccess = document.getElementById('evtFormSuccess');
  const evtNovaSolicitacao = document.getElementById('evtNovaSolicitacao');
  const evtSubmitBtn = document.getElementById('evtSubmitBtn');
  const evtBtnText = document.getElementById('evtBtnText');

  // ===============================
  // MÁSCARA TELEFONE - EVENTOS
  // ===============================
  const evtTelefone = document.getElementById('evtTelefone');

  if (evtTelefone) {
    evtTelefone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 11) {
        value = value.slice(0, 11);
      }

      if (value.length > 6) {
        value = value.replace(
          /^(\d{2})(\d{5})(\d+)/,
          '($1) $2-$3'
        );
      } else if (value.length > 2) {
        value = value.replace(
          /^(\d{2})(\d+)/,
          '($1) $2'
        );
      } else {
        value = value.replace(
          /^(\d*)/,
          '($1'
        );
      }

      e.target.value = value;
    });
  }

  // ===============================
  // FORMULÁRIO DE EVENTOS
  // ===============================
  if (evtForm && evtFormSuccess) {

    // Garante que a mensagem de sucesso comece escondida
    evtFormSuccess.setAttribute('hidden', '');

    evtForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // ===============================
      // CAPTURA DOS CAMPOS
      // ===============================
      const perfil = document.getElementById('evtPerfil');
      const tipoEvento = document.getElementById('evtTipoEvento');
      const dataEvento = document.getElementById('evtData');
      const cidade = document.getElementById('evtCidade');
      const convidados = document.getElementById('evtConvidados');
      const formato = document.getElementById('evtFormato');
      const personalizacao = document.getElementById('evtPersonalizacao');
      const nome = document.getElementById('evtNome');
      const telefone = document.getElementById('evtTelefone');
      const email = document.getElementById('evtEmail');
      const mensagem = document.getElementById('evtMensagem');

      let valido = true;

      // ===============================
      // LIMPAR ERROS
      // ===============================
      document.querySelectorAll('#evtForm .form__error').forEach(el => {
        el.textContent = '';
      });

      document.querySelectorAll('#evtForm .form__input').forEach(el => {
        el.classList.remove('error');
      });

      // ===============================
      // VALIDAÇÕES
      // ===============================

      // Perfil
      if (!perfil.value) {
        document.getElementById('evtErroPerfil').textContent =
          'Selecione uma opção';
        perfil.classList.add('error');
        valido = false;
      }

      // Tipo de evento
      if (!tipoEvento.value) {
        document.getElementById('evtErroTipoEvento').textContent =
          'Selecione o tipo de evento';
        tipoEvento.classList.add('error');
        valido = false;
      }

      // Cidade
      if (!cidade.value.trim()) {
        document.getElementById('evtErroCidade').textContent =
          'Digite a cidade do evento';
        cidade.classList.add('error');
        valido = false;
      }

      // Formato
      if (!formato.value) {
        document.getElementById('evtErroFormato').textContent =
          'Selecione uma opção';
        formato.classList.add('error');
        valido = false;
      }

      // Nome
      if (!nome.value.trim()) {
        document.getElementById('evtErroNome').textContent =
          'Digite seu nome';
        nome.classList.add('error');
        valido = false;
      }

      // Telefone
      if (telefone.value.replace(/\D/g, '').length < 10) {
        document.getElementById('evtErroTelefone').textContent =
          'Telefone inválido';
        telefone.classList.add('error');
        valido = false;
      }

      // Se houver algum erro, não envia
      if (!valido) {
        return;
      }

      // ===============================
      // FORMATAÇÃO DA DATA
      // ===============================
      let dataEventoFormatada = 'Não informada';

      if (dataEvento.value) {
        const partes = dataEvento.value.split('-');

        if (partes.length === 3) {
          dataEventoFormatada =
            `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
      }

      // ===============================
      // DADOS PARA O GOOGLE SHEETS
      // ===============================
      const data = {
        tipoContato: 'Evento',
        perfil: perfil.value,
        tipoEvento: tipoEvento.value,
        dataEvento: dataEventoFormatada,
        cidade: cidade.value.trim(),
        convidados: convidados.value || '',
        formato: formato.value,
        personalizacao: personalizacao.value || '',
        nome: nome.value.trim(),
        telefone: telefone.value.trim(),
        email: email.value.trim(),
        mensagem: mensagem.value.trim(),
        data: new Date().toLocaleString('pt-BR')
      };

      // ===============================
      // BLOQUEAR BOTÃO + LOADING
      // ===============================
      evtSubmitBtn.disabled = true;

      evtBtnText.innerHTML =
        '<span class="btn-spinner"></span> Enviando...';

      // ===============================
      // GOOGLE SHEETS
      // ===============================
      try {

        await fetch(
          'https://script.google.com/macros/s/AKfycbzIMUTYSZ9yleabhrE8B2kZKUPbVZaN9XLtvMnp3wA33dvc8P2O_6bOsZIN1VyP4_jwqw/exec',
          {
            method: 'POST',
            body: JSON.stringify(data)
          }
        );

      } catch (error) {

        console.warn(
          'Erro ao salvar solicitação de evento:',
          error
        );

      }

      // ===============================
      // WHATSAPP
      // ===============================
      const mensagemWhatsApp = `
Olá! Gostaria de solicitar um orçamento para um evento. 🍊

*Perfil:* ${data.perfil}
*Tipo de evento:* ${data.tipoEvento}
*Data:* ${data.dataEvento}
*Cidade:* ${data.cidade}
*Convidados:* ${data.convidados || 'Não informado'}
*Formato de interesse:* ${data.formato}
*Personalização:* ${data.personalizacao || 'Não informado'}

*Nome:* ${data.nome}
*Telefone:* ${data.telefone}
*E-mail:* ${data.email || 'Não informado'}

*Detalhes do evento:*
${data.mensagem || 'Nenhum detalhe adicional informado.'}

Vim pelo site da Magaroti Sucos. 🍊
`;

      window.open(
        `https://wa.me/5517997368540?text=${encodeURIComponent(
          mensagemWhatsApp
        )}`,
        '_blank'
      );

      // ===============================
      // RESTAURAR BOTÃO
      // ===============================
      evtSubmitBtn.disabled = false;

      evtBtnText.textContent =
        'Solicitar orçamento';

      // ===============================
      // MOSTRAR SUCESSO
      // ===============================
      evtForm.style.display = 'none';
      evtFormSuccess.removeAttribute('hidden');
    });

    // ===============================
    // NOVA SOLICITAÇÃO
    // ===============================
    if (evtNovaSolicitacao) {

      evtNovaSolicitacao.addEventListener('click', () => {

        evtForm.reset();

        evtForm.style.display = 'flex';

        evtFormSuccess.setAttribute('hidden', '');

        // Limpar erros
        document
          .querySelectorAll('#evtForm .form__error')
          .forEach(el => {
            el.textContent = '';
          });

        document
          .querySelectorAll('#evtForm .form__input')
          .forEach(el => {
            el.classList.remove('error');
          });

      });
    }
  }

});