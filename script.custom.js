const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...'; // укорочено для примера
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const container = document.getElementById('projects-container');
const form = document.getElementById('filters-form');

async function fetchProjects(filters = {}) {
  let query = supabase.from('projects').select('*');

  if (filters.type) query = query.eq('type', filters.type);
  if (filters.material) query = query.eq('material', filters.material);
  if (filters.area) query = query.lte('area', filters.area);
  if (filters.price) query = query.lte('price', filters.price);

  const { data, error } = await query;

  if (error) {
    container.innerHTML = '<p>Ошибка загрузки проектов</p>';
    console.error(error);
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p>Ничего не найдено по выбранным параметрам</p>';
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
      <button class="btn apply-btn" data-id="${p.id}" data-title="${p.title}">Оставить заявку</button>
    </div>
  `).join('');
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const filters = {
    type: document.getElementById('type').value,
    material: document.getElementById('material').value,
    area: parseFloat(document.getElementById('area').value) || null,
    price: parseFloat(document.getElementById('price').value) || null
  };
  fetchProjects(filters);
});

// ==== Заявка ====
document.addEventListener('click', e => {
  if (e.target.classList.contains('apply-btn')) {
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('project-id').value = e.target.dataset.id;
    document.getElementById('selected-title').textContent = e.target.dataset.title;
  }
});

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('apply-form').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    project_id: document.getElementById('project-id').value,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    comment: document.getElementById('comment').value,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('applications').insert([payload]);

  if (error) {
    alert('Ошибка при отправке');
    console.error(error);
  } else {
    alert('Заявка отправлена!');
    document.getElementById('modal').classList.add('hidden');
    e.target.reset();
  }
});

// Начальная загрузка
document.addEventListener('DOMContentLoaded', () => fetchProjects());
