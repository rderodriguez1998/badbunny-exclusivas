// Configuración de almacenamiento en la nube usando JSONBin.io
const JSONBIN_API_KEY = '$2a$10$xhO7YP0rz7RBPZz5BvgHPuGx5vC.L5R9kKqNZH3nFzJnkQc0RYzBi';
let JSONBIN_BIN_ID = localStorage.getItem('jsonbin_id') || null;

// API para guardar/cargar datos
const dbAPI = {
    async loadSongs() {
        if (!JSONBIN_BIN_ID) {
            return [];
        }

        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.record.songs || [];
            }
            return [];
        } catch (error) {
            console.log('Error cargando canciones:', error);
            return [];
        }
    },

    async saveSongs(songs) {
        try {
            // Si no existe el bin, créalo
            if (!JSONBIN_BIN_ID) {
                const response = await fetch('https://api.jsonbin.io/v3/b', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': JSONBIN_API_KEY,
                        'X-Bin-Name': 'badbunny-exclusivas'
                    },
                    body: JSON.stringify({ songs: songs })
                });

                if (response.ok) {
                    const data = await response.json();
                    JSONBIN_BIN_ID = data.metadata.id;
                    localStorage.setItem('jsonbin_id', JSONBIN_BIN_ID);
                    return true;
                }
                return false;
            }

            // Si ya existe, actualízalo
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ songs: songs })
            });

            return response.ok;
        } catch (error) {
            console.error('Error guardando canciones:', error);
            return false;
        }
    }
};
