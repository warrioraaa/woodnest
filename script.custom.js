const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...'; // ключ обрезан
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('projects-container');
  const { data, error } = await supabase.from('projects').select('*');

  if (error) {
    container.innerHTML = 'Ошибка загрузки данных';
    console.error(error);
    return;
  }

  container.innerHTML = data.map(p => `
    <div class="project-card">
      <img src="${p.image_url}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.type} · ${p.material} · ${p.area} м² · ${p.price} ₽</p>
      <p>${p.description}</p>
    </div>
  `).join('');
});
