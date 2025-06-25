const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadProjects(filters = {}) {
  const container = document.getElementById('projects-container');
  container.innerHTML = '<p>Загрузка...</p>';

  let query = supabase.from('projects').select('*');

  // Фильтры
  if (filters.type) query = query.ilike('type', `%${filters.type}%`);
  if (filters.material) query = query.ilike('material', `%${filters.material}%`);
  if (filters.area) query = query.lte('area', filters.area);
  if (filters.price) query = query.lte('price', filters.price);

  const { data, error } = await query;

  if (error) {
    container.innerHTML = '<p>Ошибка при загрузке проектов.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    container.innerHTML = '<p>Проекты не найдены по заданным параметрам.</p>';
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
      <button class="btn" onclick="openModal('${project.id}', '${project.title}')">Оставить заявку</button>
    </div>
  `).join('');
}

// Загрузка при запуске
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});

// Обработка фильтра
document.getElementById('filters-form').addEventListener('submit', e => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const material = document.getElementById('material').value;
  const area = document.getElementById('area').value;
  const price = document.getElementById('price').value;

  loadProjects({ type, material, area, price });
});

// Модальное окно
function openModal(id, title) {
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('project-id').value = id;
  document.getElementById('selected-title').textContent = title;
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Отправка заявки
document.getElementById('apply-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const comment = document.getElementById('comment').value.trim();
  const projectId = document.getElementById('project-id').value;

  const { error } = await supabase.from('applications').insert([
    { name, phone, comment, project_id: projectId }
  ]);

  if (error) {
    alert('Ошибка при отправке заявки.');
    console.error(error);
  } else {
    alert('Заявка отправлена!');
    document.getElementById('apply-form').reset();
    document.getElementById('modal').classList.add('hidden');
  }
});
