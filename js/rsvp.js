const storageKey = 'benicioConfirmadosLocal';
const form = document.getElementById("rsvp-form");
const msg = document.getElementById("rsvp-msg");
const tableBody = document.querySelector("#confirmed-table tbody");
const downloadBtn = document.getElementById("download-list");
let oficialList = [];

const getLocalList = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (err) {
    console.error('Erro ao ler confirmações locais', err);
    return [];
  }
};

const saveLocalList = (list) => {
  localStorage.setItem(storageKey, JSON.stringify(list));
};

const renderTable = () => {
  const localList = getLocalList();
  const combined = [...oficialList, ...localList];

  if (!combined.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Nenhuma confirmação registrada ainda.</td></tr>';
    return;
  }

  const rows = combined.map(item => `
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

const fetchOficialList = async () => {
  try {
    const response = await fetch('data/confirmados.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar a lista oficial.');
    oficialList = await response.json();
    renderTable();
  } catch (err) {
    console.error(err);
    oficialList = [];
    renderTable();
  }
};

const handleDownload = () => {
  const localList = getLocalList();
  const combined = [...oficialList, ...localList];
  if (!combined.length) return;

  const header = ['Nome', 'Adultos', 'Criancas', 'WhatsApp', 'Observacao'];
  const csvRows = [
    header.join(',')
  ];

  combined.forEach(item => {
    csvRows.push([
      `"${item.nome}"`,
      item.adultos,
      item.criancas,
      `"${item.whatsapp || ''}"`,
      `"${item.observacao || ''}"`
    ].join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'confirmados-benicio.csv';
  link.click();
  URL.revokeObjectURL(link.href);
};

form.addEventListener("submit", function(e){
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const adultos = parseInt(document.getElementById("adultos").value, 10) || 0;
  const criancas = parseInt(document.getElementById("criancas").value, 10) || 0;
  const whatsapp = document.getElementById("whatsapp").value.trim();

  if (!nome) {
    msg.innerText = "Informe o nome para confirmar.";
    return;
  }

  const novoRegistro = {
    nome,
    adultos,
    criancas,
    whatsapp,
    observacao: 'Confirmação registrada pelo site'
  };

  const locais = getLocalList();
  locais.push(novoRegistro);
  saveLocalList(locais);
  renderTable();

  msg.innerText = `Presença confirmada! ${adultos} adulto(s) e ${criancas} criança(s).`;
  form.reset();
});

downloadBtn?.addEventListener('click', handleDownload);

fetchOficialList();
