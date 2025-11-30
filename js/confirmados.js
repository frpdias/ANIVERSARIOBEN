import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://fjudsjzfnysaztcwlwgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdWRzanpmbnlzYXp0Y3dsd2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDA3NjAsImV4cCI6MjA4MDExNjc2MH0.RVfvnu7Cp9X5wXefvXtwOu20hSsR4B6mGkypssMtUyE';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const tableBody = document.querySelector('#official-table tbody');
const downloadBtn = document.getElementById('download-official');
let officialData = [];

const formatInitials = (name) => {
  if (!name) return '-';
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('');
  return initials || '-';
};

const renderTable = (list) => {
  if (!list.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhuma confirmação registrada ainda.</td></tr>';
    return;
  }

  tableBody.innerHTML = list.map(item => `
    <tr>
      <td>${formatInitials(item.nome)}</td>
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
    renderTable([]);
    return [];
  }

  renderTable(data || []);
  return data || [];
};

const toCSV = (list) => {
  const header = ['Nome', 'Adultos', 'Criancas', 'WhatsApp', 'Observacao'];
  const rows = list.map(item => [
    `"${item.nome}"`,
    item.adultos,
    item.criancas,
    `"${item.whatsapp || ''}"`,
    `"${item.observacao || ''}"`
  ].join(','));
  return [header.join(','), ...rows].join('\n');
};

const init = async () => {
  officialData = await fetchConfirmados();

  downloadBtn?.addEventListener('click', () => {
    if (!officialData.length) return;
    const csv = toCSV(officialData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'convidados-confirmados.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', (!expanded).toString());
      navMenu.classList.toggle('open');
    });
  }
};

init();
