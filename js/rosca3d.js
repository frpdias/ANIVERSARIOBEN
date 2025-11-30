import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

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

const totalEl = document.getElementById('roscaTotal');
const adultosEl = document.getElementById('roscaAdultos');
const criancasEl = document.getElementById('roscaCriancas');
let roscaChart;

const pluginDepth = {
  id: 'roscaDepth',
  afterDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.restore();
  }
};

const renderChart = (adultos, criancas) => {
  const confirmados = adultos + criancas;
  if (totalEl) totalEl.textContent = confirmados;
  if (adultosEl) adultosEl.textContent = adultos;
  if (criancasEl) criancasEl.textContent = criancas;

  const labels = ['Adultos', 'Crianças'];
  const data = [adultos, criancas];
  const colors = ['#ff6363', '#36d6ff'];

  const ctx = document.getElementById('roscaChart');
  if (!ctx) return;

  if (!roscaChart) {
    roscaChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
          cutout: '55%'
        }]
      },
      options: {
        responsive: true,
        rotation: -90,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#f8fbff',
              font: { family: 'Racing Sans One' }
            }
          }
        }
      },
      plugins: [pluginDepth]
    });
  } else {
    roscaChart.data.labels = labels;
    roscaChart.data.datasets[0].data = data;
    roscaChart.data.datasets[0].backgroundColor = colors;
    roscaChart.update();
  }
};

const fetchData = () => {
  const data = loadLocalConfirmados();
  const totals = data.reduce((acc, item) => {
    acc.adultos += item.adultos || 0;
    acc.criancas += item.criancas || 0;
    return acc;
  }, { adultos: 0, criancas: 0 });
  renderChart(totals.adultos, totals.criancas);
};

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', (!expanded).toString());
    navMenu.classList.toggle('open');
  });
}

fetchData();
