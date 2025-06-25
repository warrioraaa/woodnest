const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const container = document.getElementById('projects-container');
const form = document.getElementById('filters-form');
const resetBtn = document.getElementById('reset-filters');

// Загружает проекты с учётом фильтров (или без)
async function loadProjects(filters = {}) {
  container.innerHTML = '<p>Загрузка проектов...</p>';

  let query = supabase.from('projects').select('*');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.material) query = query.eq('material', filters.material);
  if (filters.area) query = query.lte('area', filters.area);
  if (filters.price) query = query.lte('price', filters.price);

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

// Обработчик отправки фильтров
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const filters = {
    type: document.getElementById('type').value.trim(),
    material: document.getElementById('material').value.trim(),
    area: parseInt(document.getElementById('area').value) || null,
    price: parseInt(document.getElementById('price').value) || null
  };

  await loadProjects(filters);
});

// Сброс фильтров
resetBtn.addEventListener('click', async () => {
  document.getElementById('type').value = '';
  document.getElementById('material').value = '';
  document.getElementById('area').value = '';
  document.getElementById('price').value = '';
  await loadProjects(); // Загрузить все проекты
});

// При загрузке страницы — показать все проекты
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});
