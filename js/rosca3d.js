import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { Chart } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

const SUPABASE_URL = 'https://eeymxqucqverretdhcjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVleW14cXVjcXZlcnJldGRoY2p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTA0MTMsImV4cCI6MjA3OTAyNjQxM30.bxNCgrqD3XlegugXAjyjFav3LlSOoncAZOSijkhxD0E';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const capacity = 120;
const totalEl = document.getElementById('roscaTotal');
const adultosEl = document.getElementById('roscaAdultos');
const criancasEl = document.getElementById('roscaCriancas');
const vagasEl = document.getElementById('roscaVagas');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
let roscaChart;

const pluginDepth = {
  id: 'roscaDepth',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    const offset = 10;
    ctx.translate(0, offset);
    chart.draw();
    ctx.restore();
  }
};

const renderChart = (adultos, criancas) => {
  const confirmados = adultos + criancas;
  const vagas = Math.max(0, capacity - confirmados);
  totalEl.textContent = confirmados;
  adultosEl.textContent = adultos;
  criancasEl.textContent = criancas;
  vagasEl.textContent = vagas;

  const labels = ['Adultos', 'Crianças'];
  const data = [adultos, criancas];
  const colors = ['#ff6363', '#36d6ff'];
  if (vagas > 0) {
    labels.push('Vagas');
    data.push(vagas);
    colors.push('rgba(255,255,255,0.2)');
  }

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
              font: { family: 'Magneto' }
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
  const { data, error } = await supabase
    .from('confirmados')
    .select('adultos, criancas');
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
