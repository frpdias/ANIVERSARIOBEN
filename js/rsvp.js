import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

const SUPABASE_URL = 'https://eeymxqucqverretdhcjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleW14cXVjcXZlcnJldGRoY2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTA0MTMsImV4cCI6MjA3OTAyNjQxM30.bxNCgrqD3XlegugXAjyjFav3LlSOoncAZOSijkhxD0E';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const convidadosBase = [
  { telefone: '(33-98751-4845)', convidados: ['Edlamar', 'Edson'] },
  { telefone: '(33-99959-3177)', convidados: ['Tatiana', 'Marido', 'Talita', 'Dani', 'Robson'] },
  { telefone: '(94-99177-5601)', convidados: ['Robinho', 'Guilherme', 'Lara'] },
  { telefone: '(33-99989-8109)', convidados: ['Julio', 'Alessandra', 'Ronaldo', 'Julia'] },
  { telefone: '(33-98418-6823)', convidados: ['Andreia', 'Jose', 'Luis', 'Alexandre', 'Luiz', 'Henrique'] },
  { telefone: '(33-99103-2147)', convidados: ['lsabela', 'Nilton'] },
  { telefone: '(33-99128-7142)', convidados: ['Somara', 'Ricordo', 'Ana', 'koroline', 'Maria', 'julia'] },
  { telefone: '(73-99167-1399)', convidados: ['Lena', 'Klecio', 'Gabriela', 'Rafael'] },
  { telefone: '(33-99981-2656)', convidados: ['Luzimar', 'Valter', 'Matheus'] },
  { telefone: '(21-97999-5100)', convidados: ['Janaina', 'Eduardo', 'Liz'] },
  { telefone: '(91-98174-9200)', convidados: ['Fernando', 'Camila'] },
  { telefone: '(21-99893-5477)', convidados: ['Gustavo'] },
  { telefone: '(33-99193-5787)', convidados: ['Bruno', 'carol', 'filho 1', 'filho 2', 'filho 3'] },
  { telefone: '(27-98141-4959)', convidados: ['Renata', 'Thiago', 'Alicia'] },
  { telefone: '(33-98405-6349)', convidados: ['Otho', 'Rosangela', 'Tai', 'Vilma'] },
  { telefone: '(33--99998-2028)', convidados: ['Thais', 'Matozinho', 'Marcia', 'Alair', 'Júnior'] },
  { telefone: '(33--93505-1620)', convidados: ['Sergio', 'Marilda', 'Matheus', 'Maria', 'luiza'] },
  { telefone: '(33-98756-1874)', convidados: ['Lúcio', 'Bruna', 'Caio'] },
  { telefone: '(33-98834-3614)', convidados: ['Adriano', 'Gina', 'Santiago', 'Laura'] },
  { telefone: '(33-99136-9389)', convidados: ['Maxwell', 'Livia', 'Laura', 'Helena'] },
  { telefone: '(48-99118-0028)', convidados: ['Libny', 'Marido', 'Lívia', 'Letícia'] },
  { telefone: '(33-99907-4655)', convidados: ['Vó', 'Bia', 'Ilda'] },
  { telefone: '(33-99929-3721)', convidados: ['Tio Agnaldo', 'Esposa', 'Filho 1', 'Filho 2', 'Filho 3'] },
  { telefone: '(33-99979-7345)', convidados: ['Tia Aparecida', 'filho 1'] },
  { telefone: '(33-98407-5597)', convidados: ['Julia', 'Fernando'] },
  { telefone: '(3399140-7435)', convidados: ['Najara', 'Joba', 'Laura'] },
  { telefone: '(33-99965-6970)', convidados: ['Itamara', 'Marcelo', 'Eva'] },
  { telefone: '(3399873-8728)', convidados: ['Deliane'] },
  { telefone: '(33-988076807)', convidados: ['Hebert', 'Gustavo', 'Filho'] },
  { telefone: '(33-99163-6363)', convidados: ['Raifa'] },
  { telefone: '(33-99909)', convidados: ['Amanda', 'Elena'] },
  { telefone: '(33-99979-0069)', convidados: ['Val Porto'] },
  { telefone: '(33-99918-1871)', convidados: ['Rodrigo'] },
  { telefone: '(33-99922-0239)', convidados: ['Zanetti', 'Dayse'] },
  { telefone: '(33-99191-5282)', convidados: ['Ana Clara', 'Vinicius', 'Davi', 'Lara'] },
  { telefone: '(33-99150-9206)', convidados: ['Sandro', 'Nayane', 'Ana', 'Elise', 'Joao', 'Henrique'] },
  { telefone: '(33-98421-2881)', convidados: ['Wallace'] },
  { telefone: '(37-99924-0227)', convidados: ['Dani'] },
  { telefone: '(33-99812-0605)', convidados: ['Brandon', 'Natalia', 'Joao', 'Vitor', 'Pedro'] },
  { telefone: '(33-98432-5547)', convidados: ['Heitor', 'Emília'] },
  { telefone: '(33-99824-2335)', convidados: ['Natalia', 'Renato', 'Julia'] },
  { telefone: '(33-99971-4524)', convidados: ['Vania', 'Bruno', 'Theo'] },
  { telefone: '(33-99906-3755)', convidados: ['Isabella', 'Doula'] },
  { telefone: '(33-99112-9783)', convidados: ['Laiz', 'Alvaro', 'Augusto'] },
  { telefone: '(31-98385-6350)', convidados: ['Marcelinho'] },
  { telefone: '(33-99978-2204)', convidados: ['Camila', 'Esposo', 'Caetano', 'Frencisco'] },
  { telefone: '(33-99131-3866)', convidados: ['Kissila', 'Saul'] },
  { telefone: '(33-99133-3644)', convidados: ['Bruna', 'Gabriel'] },
  { telefone: '(33-99988-2505)', convidados: ['Thais', 'Creusa'] },
  { telefone: '(33-99114-9914)', convidados: ['Dina', 'Gustavo'] },
  { telefone: '(33-98873-5858)', convidados: ['Lili'] },
  { telefone: '(33-99902-1434)', convidados: ['Aline', 'Diguin', 'Conceição', 'Lara', 'Luna'] },
  { telefone: '(33-99849-1198)', convidados: ['Dila'] },
  { telefone: '(33-98419-3581)', convidados: ['Ketsia', 'Esposo', 'filho 1', 'filho 2'] },
  { telefone: '(31-99406-3003)', convidados: ['Patricia', 'Esposo'] },
  { telefone: '(33-99708-5482)', convidados: ['Vinicius', 'Dani', 'Antonela', 'Jose', 'Neto'] },
  { telefone: '(33-99985-5486)', convidados: ['Grazielle', 'Temponi', 'Leonardo', 'Luca', 'Miguel'] },
  { telefone: '(33-99818-0301)', convidados: ['Grazy Bitencourt', 'Maria Clara', 'Arthur'] },
  { telefone: '(3398448-3088)', convidados: ['Ketila', 'Lalo'] },
  { telefone: '(33-99954-2972)', convidados: ['Andrea', 'Elcio'] }
];

const normalizePhone = (value = '') => value.replace(/\D+/g, '');
const convidadosList = convidadosBase.map((item) => ({
  ...item,
  telefoneDigits: normalizePhone(item.telefone)
}));

const form = document.getElementById('rsvp-form');
const telefoneInput = document.getElementById('telefone');
const buscarBtn = document.getElementById('buscar-convidados');
const guestListEl = document.getElementById('guest-list');
const guestActionsEl = document.getElementById('guest-actions');
const selecionarTodosBtn = document.getElementById('selecionar-todos');
const baixarConvidadosBtn = document.getElementById('baixar-convidados');
const messageEl = document.getElementById('rsvp-msg');
const tableBody = document.querySelector('#confirmed-table tbody');
const downloadBtn = document.getElementById('download-list');
const confirmedCountEl = document.getElementById('confirmedCount');
const attendanceCanvas = document.getElementById('attendanceChart');

let confirmadosData = [];
let attendanceChart;
let convidadosSelecionados = [];
let convidadosAtuais = null;

const formatInitials = (name) => {
  if (!name) return '-';
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('');
};

const setMessage = (text = '', type = 'success') => {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.style.color = type === 'error' ? '#ff5252' : '#0bb07b';
};

const renderTable = (list) => {
  if (!tableBody) return;

  if (!list.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhuma confirmação registrada ainda.</td></tr>';
    return;
  }

  tableBody.innerHTML = list
    .map(
      (item) => `
      <tr>
        <td>${formatInitials(item.nome)}</td>
        <td>${item.adultos}</td>
        <td>${item.criancas}</td>
        <td>${item.whatsapp || '-'}</td>
        <td>${item.observacao || '-'}</td>
      </tr>`
    )
    .join('');
};

const renderChart = (adultos, criancas) => {
  const confirmados = adultos + criancas;
  confirmedCountEl.textContent = confirmados;

  const data = {
    labels: ['Adultos', 'Crianças'],
    datasets: [
      {
        data: [adultos, criancas],
        backgroundColor: ['#ff5964', '#36c5ff'],
        hoverOffset: 8,
        borderWidth: 0
      }
    ]
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#031737',
          font: { family: 'Racing Sans One' }
        }
      }
    }
  };

  if (!attendanceCanvas) return;

  if (!attendanceChart) {
    attendanceChart = new Chart(attendanceCanvas, {
      type: 'doughnut',
      data,
      options
    });
  } else {
    attendanceChart.data = data;
    attendanceChart.options = options;
    attendanceChart.update();
  }
};

const updateDashboard = (list) => {
  confirmadosData = list;
  renderTable(list);
  const totals = list.reduce(
    (acc, item) => {
      acc.adultos += item.adultos || 0;
      acc.criancas += item.criancas || 0;
      return acc;
    },
    { adultos: 0, criancas: 0 }
  );
  renderChart(totals.adultos, totals.criancas);
};

const fetchConfirmados = async () => {
  const { data, error } = await supabase
    .from('confirmados')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Erro ao buscar confirmados', error);
    setMessage('Não foi possível carregar a lista agora. Tente novamente em instantes.', 'error');
    return [];
  }

  return data || [];
};

const toCSV = (list) => {
  const header = ['Nome', 'Adultos', 'Criancas', 'WhatsApp', 'Observacao'];
  const rows = list.map((item) =>
    [
      `"${item.nome}"`,
      item.adultos,
      item.criancas,
      `"${item.whatsapp || ''}"`,
      `"${item.observacao || ''}"`
    ].join(',')
  );
  return [header.join(','), ...rows].join('\n');
};

const downloadConvidadosBase = () => {
  const header = ['Telefone', 'Nome'];
  const rows = convidadosBase.flatMap((item) =>
    (item.convidados || []).filter(Boolean).map((nome) => [`"${item.telefone}"`, `"${nome}"`].join(','))
  );
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'lista-convidados-base.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

const renderGuestChecklist = (entry) => {
  convidadosAtuais = entry;
  convidadosSelecionados = [];

  if (!entry) {
    guestListEl.innerHTML = '<p class="guest-hint">Telefone não encontrado na lista. Confira e tente novamente.</p>';
    guestActionsEl.hidden = true;
    return;
  }

  const linhas = entry.convidados
    .filter((nome) => nome && nome.trim())
    .map((nome, index) => {
      const id = `guest-check-${index}`;
      return `
        <div class="guest-row">
          <span class="guest-number">${index + 1}</span>
          <input type="text" value="${nome}" readonly>
          <label class="confirm-switch" for="${id}">
            <input type="checkbox" id="${id}" data-nome="${nome}" checked>
            <span>Confirmar</span>
          </label>
        </div>
      `;
    })
    .join('');

  guestListEl.innerHTML = linhas
    ? `
      <p class="guest-note">Encontramos ${entry.convidados.length} nome(s) para o telefone ${entry.telefone}.</p>
      <div class="guest-grid">${linhas}</div>
    `
    : '<p class="guest-hint">Nenhum convidado vinculado a este telefone.</p>';

  guestActionsEl.hidden = !linhas;
};

const findGuestsByPhone = (phoneRaw) => {
  const digits = normalizePhone(phoneRaw);
  if (!digits) return null;
  return (
    convidadosList.find((item) => item.telefoneDigits === digits) ||
    convidadosList.find((item) => digits.endsWith(item.telefoneDigits)) ||
    null
  );
};

const handleLookup = () => {
  setMessage('');
  const entry = findGuestsByPhone(telefoneInput.value);
  renderGuestChecklist(entry);
};

const selecionarTodos = (marcar) => {
  guestListEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = marcar;
  });
};

buscarBtn?.addEventListener('click', handleLookup);
telefoneInput?.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    handleLookup();
  }
});
selecionarTodosBtn?.addEventListener('click', () => selecionarTodos(true));
baixarConvidadosBtn?.addEventListener('click', downloadConvidadosBase);

downloadBtn?.addEventListener('click', () => {
  if (!confirmadosData.length) return;
  const csv = toCSV(confirmadosData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'convidados-confirmados.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage('');

  const entry = convidadosAtuais;
  if (!entry) {
    setMessage('Busque pelo telefone para confirmar.', 'error');
    return;
  }

  const selecionados = Array.from(guestListEl.querySelectorAll('input[type="checkbox"]'))
    .filter((cb) => cb.checked)
    .map((cb) => cb.getAttribute('data-nome'))
    .filter(Boolean);

  if (!selecionados.length) {
    setMessage('Selecione ao menos um convidado para confirmar.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';
  }

  const telefoneLimpo = normalizePhone(entry.telefone);
  const payload = selecionados.map((nome) => ({
    nome,
    adultos: 1,
    criancas: 0,
    whatsapp: telefoneLimpo || null,
    observacao: `Telefone de acesso: ${entry.telefone}`
  }));

  const { error } = await supabase.from('confirmados').insert(payload).select();

  if (error) {
    console.error('Erro ao salvar confirmação', error);
    setMessage(`Não foi possível salvar agora: ${error.message || 'tente novamente.'}`, 'error');
  } else {
    setMessage(`Presença confirmada para ${selecionados.length} convidado(s)! 🏁`, 'success');
    const data = await fetchConfirmados();
    updateDashboard(data);
    selecionarTodos(true);
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar confirmações';
  }
};

form?.addEventListener('submit', handleSubmit);

const init = async () => {
  const data = await fetchConfirmados();
  updateDashboard(data);
};

init();
