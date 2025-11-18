const tableBody = document.querySelector('#official-table tbody');
const downloadBtn = document.getElementById('download-official');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

const renderTable = (list) => {
  if (!list.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhuma confirmação registrada ainda.</td></tr>';
    return;
  }

  const rows = list.map(item => `
    <tr>
      <td>${item.nome}</td>
      <td>${item.adultos}</td>
      <td>${item.criancas}</td>
      <td>${item.whatsapp || '-'}</td>
      <td>${item.observacao || '-'}</td>
    </tr>
  `).join('');

  tableBody.innerHTML = rows;
};

const fetchConfirmados = async () => {
  try {
    const response = await fetch('data/confirmados.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Falha ao buscar confirmados');
    const data = await response.json();
    renderTable(data);
    return data;
  } catch (err) {
    console.error(err);
    renderTable([]);
    return [];
  }
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
  const officialData = await fetchConfirmados();

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
