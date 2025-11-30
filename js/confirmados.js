const tableBody = document.querySelector('#official-table tbody');
const downloadBtn = document.getElementById('download-official');
const storageKey = 'confirmados_local';

const loadLocalConfirmados = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

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

  tableBody.innerHTML = list
    .map(
      (item) => `
        <tr>
          <td>${formatInitials(item.nome)}</td>
          <td>${item.adultos}</td>
          <td>${item.criancas}</td>
          <td>${item.whatsapp || '-'}</td>
          <td>${item.observacao || '-'}</td>
        </tr>
      `
    )
    .join('');
};

const toCSV = (list) => {
  const header = ['Nome', 'Adultos', 'Criancas', 'WhatsApp', 'Observacao'];
  const rows = list.map((item) => [
    `"${item.nome}"`,
    item.adultos,
    item.criancas,
    `"${item.whatsapp || ''}"`,
    `"${item.observacao || ''}"`
  ].join(','));
  return [header.join(','), ...rows].join('\n');
};

const init = async () => {
  const officialData = loadLocalConfirmados();
  renderTable(officialData);

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
