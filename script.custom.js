const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadProjects(filters = {}) {
  const container = document.getElementById('projects-container');
  container.innerHTML = '<p>Загрузка проектов...</p>';

  let query = supabase.from('projects').select('*');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.material) query = query.eq('material', filters.material);
  if (filters.area) query = query.lte('area', filters.area);
  if (filters.price) query = query.lte('price', filters.price);

  const { data, error } = await query;

  if (error) {
    container.innerHTML = '<p>Ошибка при загрузке проектов.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Проекты не найдены.</p>';
    return;
  }

  container.innerHTML = data.map(project => `
    <div class="project-card">
      <img src="${project.image_url}" alt="${project.title}" class="project-img" />
      <h3>${project.title}</h3>
      <p><strong>Тип:</strong> ${project.type}</p>
      <p><strong>Материал:</strong> ${project.material}</p>
      <p><strong>Площадь:</strong> ${project.area} м²</p>
      <p><strong>Цена:</strong> ${project.price.toLocaleString()} ₽</p>
      <p>${project.description}</p>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();

  const form = document.getElementById('filters-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const material = document.getElementById('material').value;
    const area = parseInt(document.getElementById('area').value);
    const price = parseInt(document.getElementById('price').value);

    await loadProjects({
      type,
      material,
      area: isNaN(area) ? null : area,
      price: isNaN(price) ? null : price
    });
  });
});
