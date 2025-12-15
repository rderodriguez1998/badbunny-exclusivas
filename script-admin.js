// Array para almacenar las canciones
let songs = [];

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderTable();
    updateStats();
    setupMusicPlayer();
});

// Manejar el formulario de agregar canción
document.getElementById('songForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addSong();
});

// Manejar búsqueda
document.getElementById('searchInput').addEventListener('input', (e) => {
    filterTable(e.target.value);
});

function addSong() {
    const songName = document.getElementById('songName').value.trim();
    const date = document.getElementById('date').value;
    const city = document.getElementById('city').value.trim();
    const form = document.getElementById('songForm');
    const editingId = form.dataset.editingId;

    if (songName && date && city) {
        if (editingId) {
            // Modo edición - actualizar canción existente
            const songIndex = songs.findIndex(s => s.id === parseInt(editingId));
            if (songIndex !== -1) {
                songs[songIndex] = {
                    id: parseInt(editingId),
                    name: songName,
                    date: date,
                    city: city
                };
                showNotification('¡Canción actualizada exitosamente!');
            }

            // Resetear modo edición
            delete form.dataset.editingId;
            const submitBtn = form.querySelector('.btn-add');
            submitBtn.textContent = 'Agregar Canción';
            submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else {
            // Modo agregar - crear nueva canción
            const song = {
                id: Date.now(),
                name: songName,
                date: date,
                city: city
            };
            songs.push(song);
            showNotification('¡Canción agregada exitosamente!');
        }

        saveToLocalStorage();
        renderTable();
        updateStats();

        // Limpiar formulario
        document.getElementById('songForm').reset();
    }
}

function deleteSong(id) {
    if (confirm('¿Estás seguro de eliminar esta canción?')) {
        songs = songs.filter(song => song.id !== id);
        saveToLocalStorage();
        renderTable();
        updateStats();
        showNotification('Canción eliminada');
    }
}

function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (song) {
        document.getElementById('songName').value = song.name;
        document.getElementById('date').value = song.date;
        document.getElementById('city').value = song.city;

        // Marcar que estamos editando
        const form = document.getElementById('songForm');
        form.dataset.editingId = id;

        const submitBtn = form.querySelector('.btn-add');
        submitBtn.textContent = 'Actualizar Canción';
        submitBtn.style.background = 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';

        // Scroll al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function renderTable(filteredSongs = null) {
    const tableBody = document.getElementById('tableBody');
    const songsToRender = filteredSongs || songs;

    // Ordenar por orden de agregación (primera agregada primero)
    const sortedSongs = [...songsToRender].sort((a, b) => a.id - b.id);

    tableBody.innerHTML = '';

    if (sortedSongs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #999;">No hay canciones registradas</td></tr>';
        return;
    }

    sortedSongs.forEach((song, index) => {
        const row = document.createElement('tr');

        // Formatear fecha
        const dateObj = new Date(song.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${song.name}</strong></td>
            <td>${formattedDate}</td>
            <td>${song.city}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editSong(${song.id})">Editar</button>
                <button class="btn-delete" onclick="deleteSong(${song.id})">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function filterTable(searchTerm) {
    const filtered = songs.filter(song => {
        const searchLower = searchTerm.toLowerCase();
        return song.name.toLowerCase().includes(searchLower) ||
            song.city.toLowerCase().includes(searchLower) ||
            song.date.includes(searchTerm);
    });

    renderTable(filtered);
}

function updateStats() {
    document.getElementById('totalSongs').textContent = songs.length;
}

function saveToLocalStorage() {
    localStorage.setItem('badBunnySongs', JSON.stringify(songs));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('badBunnySongs');
    if (saved) {
        songs = JSON.parse(saved);
    }
}

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Configurar reproductor de música
function setupMusicPlayer() {
    const music = document.getElementById('bgMusic');
    const toggleBtn = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    if (!music || !toggleBtn) return;

    let isPlaying = false;
    let hasInteracted = false;
    
    // Función para activar la música
    const startMusic = () => {
        if (!hasInteracted) {
            music.play().then(() => {
                isPlaying = true;
                hasInteracted = true;
                musicIcon.textContent = '🔊';
                toggleBtn.classList.add('playing');
            }).catch(() => {});
        }
    };
    
    // Intentar reproducir al cargar
    music.play().then(() => {
        isPlaying = true;
        hasInteracted = true;
        musicIcon.textContent = '🔊';
        toggleBtn.classList.add('playing');
    }).catch(() => {
        // Si falla, activar con el primer clic/toque en cualquier parte
        document.body.addEventListener('click', startMusic, { once: true });
        document.body.addEventListener('touchstart', startMusic, { once: true });
    });
    
    // Botón para pausar/reproducir
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            music.pause();
            musicIcon.textContent = '🎵';
            toggleBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            music.play().catch(err => {
                console.log('No se pudo reproducir la música:', err);
            });
            musicIcon.textContent = '🔊';
            toggleBtn.classList.add('playing');
            isPlaying = true;
        }
        hasInteracted = true;
    });
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
