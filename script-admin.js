// Array para almacenar las canciones
let songs = [];

// Mapa de países a códigos ISO (para banderas)
const countryToISO = {
    'puerto rico': 'pr',
    'usa': 'us',
    'estados unidos': 'us',
    'méxico': 'mx',
    'mexico': 'mx',
    'colombia': 'co',
    'argentina': 'ar',
    'chile': 'cl',
    'españa': 'es',
    'espana': 'es',
    'perú': 'pe',
    'peru': 'pe',
    'república dominicana': 'do',
    'republica dominicana': 'do',
    'costa rica': 'cr',
    'panamá': 'pa',
    'panama': 'pa',
    'brasil': 'br',
    'ecuador': 'ec',
    'venezuela': 've',
    'uruguay': 'uy',
    'paraguay': 'py',
    'guatemala': 'gt',
    'honduras': 'hn',
    'el salvador': 'sv',
    'nicaragua': 'ni',
    'cuba': 'cu',
    'bolivia': 'bo',
    'canadá': 'ca',
    'canada': 'ca'
};

function getCountryFlag(country) {
    const normalizedCountry = country.toLowerCase().trim();
    const isoCode = countryToISO[normalizedCountry] || 'xx';
    return `<span class="fi fi-${isoCode}" style="font-size: 1.3em; margin-right: 8px;"></span>`;
}

// Cargar datos de la nube al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await loadFromCloud();
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

async function addSong() {
    const songName = document.getElementById('songName').value.trim();
    const date = document.getElementById('date').value;
    const city = document.getElementById('city').value.trim();
    const spotifyLink = document.getElementById('spotifyLink').value.trim();
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
                    city: city,
                    spotifyLink: spotifyLink || ''
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
                city: city,
                spotifyLink: spotifyLink || ''
            };
            songs.push(song);
            showNotification('¡Canción agregada exitosamente!');
        }

        await saveToCloud();
        renderTable();
        updateStats();

        // Limpiar formulario
        document.getElementById('songForm').reset();
    }
}

async function deleteSong(id) {
    if (confirm('¿Estás seguro de eliminar esta canción?')) {
        songs = songs.filter(song => song.id !== id);
        await saveToCloud();
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
        document.getElementById('spotifyLink').value = song.spotifyLink || '';

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
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #999;">No hay canciones registradas</td></tr>';
        return;
    }

    sortedSongs.forEach((song, index) => {
        const row = document.createElement('tr');

        // Formatear fecha con mes abreviado
        const dateObj = new Date(song.date + 'T00:00:00');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = monthNames[dateObj.getMonth()];
        const year = dateObj.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Generar enlace de Spotify
        const spotifyIcon = song.spotifyLink
            ? `<a href="${song.spotifyLink}" target="_blank" rel="noopener noreferrer" title="Escuchar en Spotify">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1DB954" style="vertical-align: middle;">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>`
            : '<span style="color: #999;">-</span>';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${song.name}</strong></td>
            <td>${formattedDate}</td>
            <td>${getCountryFlag(song.city)} ${song.city}</td>
            <td style="text-align: center;">${spotifyIcon}</td>
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

async function saveToCloud() {
    await dbAPI.saveSongs(songs);
}

async function loadFromCloud() {
    songs = await dbAPI.loadSongs();
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
            }).catch(() => { });
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
