import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

const SUPABASE_URL = 'https://eeymxqucqverretdhcjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleW14cXVjcXZlcnJldGRoY2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTA0MTMsImV4cCI6MjA3OTAyNjQxM30.bxNCgrqD3XlegugXAjyjFav3LlSOoncAZOSijkhxD0E';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('rsvp-form');
const nomeInput = document.getElementById('nome');
const whatsappInput = document.getElementById('whatsapp');
const messageEl = document.getElementById('rsvp-msg');
const tableBody = document.querySelector('#confirmed-table tbody');
const downloadBtn = document.getElementById('download-list');
const confirmedCountEl = document.getElementById('confirmedCount');
const attendanceCanvas = document.getElementById('attendanceChart');

const guestFields = Array.from({ length: 5 }, (_, index) => ({
  name: document.getElementById(`guest-${index + 1}-name`),
  type: document.getElementById(`guest-${index + 1}-type`)
}));

const typeGroups = document.querySelectorAll('.guest-type');

const setTypeSelection = (group, value = 'adulto') => {
  if (!group) return;
  const targetId = group.getAttribute('data-target');
  const hiddenInput = targetId ? document.getElementById(targetId) : null;
  group.querySelectorAll('.type-option').forEach((btn) => {
    const isActive = btn.dataset.value === value;
    btn.classList.toggle('active', isActive);
  });
  if (hiddenInput) {
    hiddenInput.value = value;
  }
};

typeGroups.forEach((group) => {
  const targetId = group.getAttribute('data-target');
  const hiddenInput = targetId ? document.getElementById(targetId) : null;
  const defaultValue = hiddenInput?.value || 'adulto';
  setTypeSelection(group, defaultValue);
  group.addEventListener('click', (event) => {
    const button = event.target.closest('.type-option');
    if (!button) return;
    setTypeSelection(group, button.dataset.value);
  });
});

if (guestFields[0]?.name) {
  guestFields[0].name.readOnly = true;
  guestFields[0].name.placeholder = 'Responsável (Convidado 1)';
}

const updateResponsavelGuest = () => {
  if (!guestFields[0]?.name) return;
  guestFields[0].name.value = nomeInput?.value.trim() || '';
};

['input', 'change', 'blur', 'keyup'].forEach((evt) => {
  nomeInput?.addEventListener(evt, () => {
    requestAnimationFrame(updateResponsavelGuest);
  });
});
window.addEventListener('pageshow', updateResponsavelGuest);
const responsavelSync = setInterval(updateResponsavelGuest, 600);
window.addEventListener('beforeunload', () => clearInterval(responsavelSync));

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

const resetFormState = () => {
  typeGroups.forEach((group) => setTypeSelection(group, 'adulto'));
  updateResponsavelGuest();
};

const handleSubmit = async (event) => {
  event.preventDefault();
  setMessage('');

  const responsavel = nomeInput?.value.trim();
  const whatsapp = whatsappInput?.value.trim();
  const convidadosExtras = guestFields
    .slice(1)
    .map(({ name, type }) => ({
      nome: name?.value?.trim() ?? '',
      tipo: type?.value || 'adulto'
    }))
    .filter((guest) => guest.nome);

  if (!responsavel) {
    setMessage('Informe o nome do responsável.', 'error');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const convidados = [
    { nome: responsavel, tipo: 'adulto', isResponsavel: true },
    ...convidadosExtras
  ];

  const payload = convidados.map((guest) => ({
    nome: guest.nome,
    adultos: guest.tipo === 'adulto' ? 1 : 0,
    criancas: guest.tipo === 'crianca' ? 1 : 0,
    whatsapp: whatsapp || null,
    observacao: guest.isResponsavel ? 'Responsável do convite' : `Responsável: ${responsavel}`
  }));

  const { error } = await supabase.from('confirmados').insert(payload);

  if (error) {
    console.error('Erro ao salvar confirmação', error);
    setMessage('Não foi possível salvar agora. Tente novamente.', 'error');
  } else {
    setMessage('Presença confirmada! Nos vemos na pista! 🏁', 'success');
    form.reset();
    resetFormState();
    const data = await fetchConfirmados();
    updateDashboard(data);
  }

  submitBtn.disabled = false;
  submitBtn.textContent = 'Confirmar';
};

form?.addEventListener('submit', handleSubmit);

const init = async () => {
  updateResponsavelGuest();
  const data = await fetchConfirmados();
  updateDashboard(data);
};

init();
