document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // PRÉ-SELECIONAR PERFIL / FORMATO
  // conforme o botão clicado (ex.: "Quero ser parceiro",
  // "Quero personalizar")
  // ===============================
  const perfilSelect  = document.getElementById('evtPerfil');
  const formatoSelect = document.getElementById('evtFormato');

  document.querySelectorAll('[data-evt-perfil], [data-evt-formato]').forEach(btn => {
    btn.addEventListener('click', () => {
      const perfil  = btn.getAttribute('data-evt-perfil');
      const formato = btn.getAttribute('data-evt-formato');

      if (perfil === 'parceiro' && perfilSelect) {
        perfilSelect.value = 'Organizador/cerimonialista';
      }
      if (formato === 'galao' && formatoSelect) {
        formatoSelect.value = 'Galão de 10 litros';
      }
      if (formato === 'garrafinha' && formatoSelect) {
        formatoSelect.value = 'Garrafinhas personalizadas de 300 ml';
      }
    });
  });

  // ===============================
  // MÁSCARA TELEFONE
  // ===============================
  const evtTelefone = document.getElementById('evtTelefone');

  if (evtTelefone) {
    evtTelefone.addEventListener('input', (e) => {
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
  // FORMULÁRIO DE ORÇAMENTO
  //
  // Não existe backend próprio para esta página ainda.
  // Assim como o formulário de pedidos da home, este
  // formulário monta uma mensagem e abre o WhatsApp com
  // os dados preenchidos. Para receber os pedidos também
  // por e-mail ou planilha, conecte aqui o mesmo tipo de
  // serviço já usado no formulário da home (ex.: Google
  // Apps Script) — ver instruções de integração.
  // ===============================
  const evtForm        = document.getElementById('evtForm');
  const evtSuccessBox   = document.getElementById('evtFormSuccess');
  const evtNovaBtn      = document.getElementById('evtNovaSolicitacao');
  const evtSubmitBtn    = document.getElementById('evtSubmitBtn');
  const evtBtnText      = document.getElementById('evtBtnText');

  if (evtForm && evtSuccessBox) {

    evtForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const campos = {
        perfil:      document.getElementById('evtPerfil'),
        tipoEvento:  document.getElementById('evtTipoEvento'),
        cidade:      document.getElementById('evtCidade'),
        formato:     document.getElementById('evtFormato'),
        nome:        document.getElementById('evtNome'),
        telefone:    document.getElementById('evtTelefone'),
      };

      let valido = true;
      evtForm.querySelectorAll('.form__error').forEach(el => el.textContent = '');
      evtForm.querySelectorAll('.form__input').forEach(el => el.classList.remove('error'));

      if (!campos.perfil.value) {
        document.getElementById('evtErroPerfil').textContent = 'Selecione uma opção';
        campos.perfil.classList.add('error');
        valido = false;
      }
      if (!campos.tipoEvento.value) {
        document.getElementById('evtErroTipoEvento').textContent = 'Selecione o tipo de evento';
        campos.tipoEvento.classList.add('error');
        valido = false;
      }
      if (!campos.cidade.value.trim()) {
        document.getElementById('evtErroCidade').textContent = 'Informe a cidade';
        campos.cidade.classList.add('error');
        valido = false;
      }
      if (!campos.formato.value) {
        document.getElementById('evtErroFormato').textContent = 'Selecione o formato de interesse';
        campos.formato.classList.add('error');
        valido = false;
      }
      if (!campos.nome.value.trim()) {
        document.getElementById('evtErroNome').textContent = 'Digite seu nome';
        campos.nome.classList.add('error');
        valido = false;
      }
      if (campos.telefone.value.replace(/\D/g, '').length < 10) {
        document.getElementById('evtErroTelefone').textContent = 'Telefone inválido';
        campos.telefone.classList.add('error');
        valido = false;
      }

      if (!valido) return;

      evtSubmitBtn.disabled = true;
      evtBtnText.innerHTML = '<span class="btn-spinner"></span> Enviando...';

      const data = {
        perfil:          campos.perfil.value,
        tipoEvento:      campos.tipoEvento.value,
        data:            document.getElementById('evtData').value || 'Não informada',
        cidade:          campos.cidade.value,
        convidados:      document.getElementById('evtConvidados').value || 'Não informado',
        formato:         campos.formato.value,
        personalizacao:  document.getElementById('evtPersonalizacao').value || 'Não informado',
        nome:            campos.nome.value,
        telefone:        campos.telefone.value,
        email:           document.getElementById('evtEmail').value || 'Não informado',
        mensagem:        document.getElementById('evtMensagem').value || 'Nenhuma',
      };

      const texto = `
Olá! Gostaria de solicitar um orçamento para um evento 🍊

Contato como: ${data.perfil}
Tipo de evento: ${data.tipoEvento}
Data: ${data.data}
Cidade: ${data.cidade}
Convidados (aprox.): ${data.convidados}
Formato de interesse: ${data.formato}
Personalização: ${data.personalizacao}

Nome: ${data.nome}
Telefone: ${data.telefone}
E-mail: ${data.email}
Mensagem: ${data.mensagem}

Vim pela página de Eventos do site 😊
`;

      window.open(`https://wa.me/5517997368540?text=${encodeURIComponent(texto)}`, '_blank');

      evtSubmitBtn.disabled = false;
      evtBtnText.innerHTML = 'Solicitar orçamento';

      evtForm.style.display = 'none';
      evtSuccessBox.removeAttribute('hidden');
    });

    if (evtNovaBtn) {
      evtNovaBtn.addEventListener('click', () => {
        evtForm.reset();
        evtForm.style.display = 'flex';
        evtSuccessBox.setAttribute('hidden', '');
      });
    }
  }

});
