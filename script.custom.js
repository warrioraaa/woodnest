
const supabaseUrl = 'https://suxdmfaephdlrjqxrgfs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eGRtZmFlcGhkbHJqcXhyZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzQ5MjgsImV4cCI6MjA2NjQ1MDkyOH0.4GcTn76XxkxIfxpXbZZvdchMnqNoy8PZG2U1u-XymiQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('projects-container');
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
        container.innerHTML = '<p>Ошибка при загрузке проектов</p>';
        console.error(error);
        return;
    }

    container.innerHTML = data.map(project => `
        <div class="project-card">
            <img src="${project.image_url}" alt="${project.title}" class="project-img">
            <h3>${project.title}</h3>
            <p><strong>Тип:</strong> ${project.type}</p>
            <p><strong>Материал:</strong> ${project.material}</p>
            <p><strong>Площадь:</strong> ${project.area} м²</p>
            <p><strong>Цена:</strong> ${project.price.toLocaleString()} ₽</p>
            <p>${project.description}</p>
        </div>
    `).join('');
});
