// ✅ Supabase подключается ТОЛЬКО после того, как загружена библиотека supabase-js
const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ'; // Твой ключ
const client = window.supabase.createClient(supabaseUrl, supabaseKey); // ⬅️ ключевой момент

const container = document.getElementById('projects-container');
const form = document.getElementById('filters-form');
const resetBtn = document.getElementById('reset-filters');

// Загрузка проектов
async function loadProjects(filters = {}) {
  container.innerHTML = '<p>Загрузка проектов...</p>';

  let query = client.from('projects').select('*');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.material) query = query.eq('material', filters.material);
  if (Number.isFinite(filters.area)) query = query.lte('area', filters.area);
  if (Number.isFinite(filters.price)) query = query.lte('price', filters.price);

  const { data, error } = await query;

  if (error || !data) {
    container.innerHTML = '<p>Ошибка при загрузке проектов.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Проекты не найдены по заданным параметрам.</p>';
    return;
  }

  container.innerHTML = data.map(p => `
    <div class="project-card">
      <img src="${p.image_url}" alt="${p.title}" class="project-img" />
      <h3>${p.title}</h3>
      <p><strong>Тип:</strong> ${p.type}</p>
      <p><strong>Материал:</strong> ${p.material}</p>
      <p><strong>Площадь:</strong> ${p.area} м²</p>
      <p><strong>Цена:</strong> ${p.price.toLocaleString()} ₽</p>
      <p>${p.description}</p>
    </div>
  `).join('');
}

// Отправка фильтров
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const filters = {
    type: document.getElementById('type').value.trim(),
    material: document.getElementById('material').value.trim(),
    area: parseFloat(document.getElementById('area').value),
    price: parseFloat(document.getElementById('price').value)
  };

  if (isNaN(filters.area)) delete filters.area;
  if (isNaN(filters.price)) delete filters.price;

  await loadProjects(filters);
});

// Сброс фильтров
resetBtn.addEventListener('click', async () => {
  form.reset();
  await loadProjects(); // Показать все
});

// Загрузка всех проектов при старте
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});
