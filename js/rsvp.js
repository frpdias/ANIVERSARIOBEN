import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

const SUPABASE_URL = 'https://eeymxqucqverretdhcjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleW14cXVjcXZlcnJldGRoY2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTA0MTMsImV4cCI6MjA3OTAyNjQxM30.bxNCgrqD3XlegugXAjyjFav3LlSOoncAZOSijkhxD0E';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('rsvp-form');
const nomeInput = document.getElementById('nome');
const whatsappInput = document.getElementById('whatsapp');
const guestNameInput = document.getElementById('guest-name');
const guestTypeSelect = document.getElementById('guest-type');
const addGuestBtn = document.getElementById('add-guest');
const guestListEl = document.getElementById('guest-list');
const messageEl = document.getElementById('rsvp-msg');
const tableBody = document.querySelector('#confirmed-table tbody');
const downloadBtn = document.getElementById('download-list');
const confirmedCountEl = document.getElementById('confirmedCount');
const attendanceCanvas = document.getElementById('attendanceChart');

let pendingGuests = [];
let confirmadosData = [];
let attendanceChart;

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

const renderGuestList = () => {
  if (!guestListEl) return;

  if (!pendingGuests.length) {
    guestListEl.innerHTML = '<li class="guest-empty">Adicione os convidados usando o campo acima.</li>';
    return;
  }

  guestListEl.innerHTML = pendingGuests
    .map(
      (guest, index) => `
      <li>
        <span>${guest.nome} <small>(${guest.tipo === 'adulto' ? 'Adulto' : 'Criança'})</small></span>
        <button type="button" class="guest-remove" data-index="${index}">Remover</button>
      </li>`
    )
    .join('');
};

const addGuest = () => {
  const guestName = guestNameInput?.value.trim();
  const guestType = guestTypeSelect?.value || 'adulto';

  if (!guestName) {
    setMessage('Informe o nome do convidado antes de adicionar.', 'error');
    return;
  }

  pendingGuests.push({ nome: guestName, tipo: guestType });
  guestNameInput.value = '';
  guestTypeSelect.value = 'adulto';
  renderGuestList();
  setMessage('');
};

guestListEl?.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('.guest-remove')) {
    const idx = Number(target.getAttribute('data-index'));
    pendingGuests.splice(idx, 1);
    renderGuestList();
  }
});

addGuestBtn?.addEventListener('click', (event) => {
  event.preventDefault();
  addGuest();
});

guestNameInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addGuest();
  }
});

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

  if (!pendingGuests.length) {
    setMessage('Adicione pelo menos um convidado antes de confirmar.', 'error');
    return;
  }

  const responsavel = nomeInput?.value.trim();
  const whatsapp = whatsappInput?.value.trim();

  if (!responsavel || !whatsapp) {
    setMessage('Informe seu nome e WhatsApp para concluirmos.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const payload = pendingGuests.map((guest) => ({
    nome: guest.nome,
    adultos: guest.tipo === 'adulto' ? 1 : 0,
    criancas: guest.tipo === 'crianca' ? 1 : 0,
    whatsapp,
    observacao: `Responsável: ${responsavel}`
  }));

  const { error } = await supabase.from('confirmados').insert(payload);

  if (error) {
    console.error('Erro ao salvar confirmação', error);
    setMessage('Não foi possível salvar agora. Tente novamente.', 'error');
  } else {
    setMessage('Presença confirmada! Nos vemos na pista! 🏁', 'success');
    pendingGuests = [];
    form.reset();
    renderGuestList();
    const data = await fetchConfirmados();
    updateDashboard(data);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirmar';
};

form?.addEventListener('submit', handleSubmit);

const init = async () => {
  renderGuestList();
  const data = await fetchConfirmados();
  updateDashboard(data);
};

init();
