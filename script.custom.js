
const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const container = document.getElementById('projects-container');

  async function fetchAndRenderProjects(filters = {}) {
    container.innerHTML = '<p>Загрузка...</p>';

    let query = client.from('projects').select('*');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.material) query = query.eq('material', filters.material);
    if (filters.area) query = query.lte('area', parseFloat(filters.area));
    if (filters.price) query = query.lte('price', parseFloat(filters.price));

    const { data, error } = await query;

    if (error) {
      console.error(error);
      container.innerHTML = '<p>Ошибка при загрузке проектов</p>';
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = '<p>Проекты не найдены</p>';
      return;
    }

container.innerHTML = data.map(project => `
  <div class="project-card">
    <img src="${project.image_url}" alt="${project.title}" class="project-img">
    <h3>${project.title}</h3>
    <p><strong>Тип:</strong> ${project.type}</p>
    <p><strong>Материал:</strong> ${project.material}</p>
    <p><strong>Площадь:</strong> ${project.area} м²</p>
    <p><strong>Цена:</strong> ${Number(project.price).toLocaleString()} ₽</p>
    <p>${project.description}</p>
    <button class="btn-apply" data-id="${project.id}" data-title="${project.title}">Оставить заявку</button>
  </div>
`).join('');
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const filters = {
      type: document.getElementById('type').value,
      material: document.getElementById('material').value,
      area: document.getElementById('area').value,
      price: document.getElementById('price').value,
    };
    fetchAndRenderProjects(filters);
  });

  fetchAndRenderProjects(); // начальная загрузка без фильтров
});
// Обработка модального окна
document.addEventListener('click', e => {
  if (e.target.classList.contains('btn-apply')) {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('selected-title').textContent = e.target.dataset.title;
    document.getElementById('project-id').value = e.target.dataset.id;
  }
});

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('apply-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const project_id = document.getElementById('project-id').value;

  const { error } = await client.from('applications').insert([
    { name, phone, comment, project_id }
  ]);

  if (error) {
    alert('Ошибка при отправке заявки');
    console.error(error);
  } else {
    alert('Заявка отправлена!');
    document.getElementById('apply-form').reset();
    document.getElementById('modal').classList.add('hidden');
  }
});
