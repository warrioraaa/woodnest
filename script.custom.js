const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const container = document.getElementById('projects-container');
const form = document.getElementById('filters-form');

let allProjects = [];

document.addEventListener('DOMContentLoaded', async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) {
    container.innerHTML = '<p>Ошибка при загрузке проектов</p>';
    console.error(error);
    return;
  }
  allProjects = data;
  renderProjects(data);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const material = document.getElementById('material').value;
  const area = parseFloat(document.getElementById('area').value);
  const price = parseFloat(document.getElementById('price').value);

  const filtered = allProjects.filter(p => {
    return (!type || p.type === type) &&
           (!material || p.material === material) &&
           (!area || p.area <= area) &&
           (!price || p.price <= price);
  });

  renderProjects(filtered);
});

function renderProjects(projects) {
  if (!projects.length) {
    container.innerHTML = '<p>Ничего не найдено</p>';
    return;
  }

  container.innerHTML = projects.map(project => `
    <div class="project-card">
      <img src="${project.image_url}" alt="${project.title}" class="project-img">
      <h3>${project.title}</h3>
      <p><strong>Тип:</strong> ${project.type}</p>
      <p><strong>Материал:</strong> ${project.material}</p>
      <p><strong>Площадь:</strong> ${project.area} м²</p>
      <p><strong>Цена:</strong> ${project.price.toLocaleString()} ₽</p>
      <p>${project.description || ''}</p>
      <button class="btn" onclick="openModal('${project.id}', '${project.title}')">Оставить заявку</button>
    </div>
  `).join('');
}

// --- Модальное окно
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('modal-close');
const applyForm = document.getElementById('apply-form');
const selectedTitle = document.getElementById('selected-title');
const projectIdInput = document.getElementById('project-id');

window.openModal = (id, title) => {
  modal.classList.remove('hidden');
  selectedTitle.textContent = title;
  projectIdInput.value = id;
};

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

applyForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const comment = document.getElementById('comment').value;
  const project_id = document.getElementById('project-id').value;

  const { error } = await supabase.from('applications').insert([
    { name, phone, comment, project_id }
  ]);

  if (error) {
    alert('Ошибка при отправке');
    console.error(error);
  } else {
    alert('Заявка отправлена');
    modal.classList.add('hidden');
    applyForm.reset();
  }
});
