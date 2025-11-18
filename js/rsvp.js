import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://eeymxqucqverretdhcjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleW14cXVjcXZlcnJldGRoY2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTA0MTMsImV4cCI6MjA3OTAyNjQxM30.bxNCgrqD3XlegugXAjyjFav3LlSOoncAZOSijkhxD0E';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('rsvp-form');
const msg = document.getElementById('rsvp-msg');
const tableBody = document.querySelector('#confirmed-table tbody');
const downloadBtn = document.getElementById('download-list');
let currentList = [];

const renderTable = (list, emptyMessage = 'Nenhuma confirmação registrada ainda.') => {
  if (!list.length) {
    tableBody.innerHTML = `<tr><td colspan="5">${emptyMessage}</td></tr>`;
    return;
  }

  tableBody.innerHTML = list.map(item => `
    <tr>
      <td>${item.nome ? item.nome.charAt(0).toUpperCase() : '-'}</td>
      <td>${item.adultos}</td>
      <td>${item.criancas}</td>
      <td>${item.whatsapp || '-'}</td>
      <td>${item.observacao || '-'}</td>
    </tr>
  `).join('');
};

const fetchConfirmados = async () => {
  const { data, error } = await supabase
    .from('confirmados')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    msg.innerText = 'Não foi possível carregar os confirmados.';
    renderTable([], 'Não foi possível carregar as confirmações agora.');
    return;
  }

  currentList = data || [];
  renderTable(currentList);
};

const handleDownload = () => {
  if (!currentList.length) return;
  const header = ['Nome', 'Adultos', 'Criancas', 'WhatsApp', 'Observacao'];
  const rows = currentList.map(item => [
    `"${item.nome}"`,
    item.adultos,
    item.criancas,
    `"${item.whatsapp || ''}"`,
    `"${item.observacao || ''}"`
  ].join(','));
  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'confirmados-benicio.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const adultos = parseInt(document.getElementById('adultos').value, 10) || 0;
  const criancas = parseInt(document.getElementById('criancas').value, 10) || 0;
  const whatsapp = document.getElementById('whatsapp').value.trim();

  if (!nome) {
    msg.innerText = 'Informe o nome para confirmar.';
    return;
  }

  const { error } = await supabase.from('confirmados').insert([{
    nome,
    adultos,
    criancas,
    whatsapp,
    observacao: 'Confirmação registrada pelo site'
  }]);

  if (error) {
    console.error(error);
    msg.innerText = 'Não foi possível registrar agora. Tente novamente.';
    return;
  }

  msg.innerText = `Presença confirmada! ${adultos} adulto(s) e ${criancas} criança(s).`;
  form.reset();
  fetchConfirmados();
});

downloadBtn?.addEventListener('click', handleDownload);

fetchConfirmados();
