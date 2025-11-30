import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const SUPABASE_URL = 'https://fjudsjzfnysaztcwlwgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdWRzanpmbnlzYXp0Y3dsd2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDA3NjAsImV4cCI6MjA4MDExNjc2MH0.RVfvnu7Cp9X5wXefvXtwOu20hSsR4B6mGkypssMtUyE';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const fetchData = async () => {
  const { data, error } = await supabase.from('confirmados').select('adultos, criancas');
  if (error) {
    console.error(error);
    renderChart(0, 0);
    return;
  }
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
