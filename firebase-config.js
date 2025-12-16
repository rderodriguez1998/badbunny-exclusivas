// Configuración de almacenamiento en la nube usando JSONBin.io
const JSONBIN_API_KEY = '$2a$10$xhO7YP0rz7RBPZz5BvgHPuGx5vC.L5R9kKqNZH3nFzJnkQc0RYzBi';
const JSONBIN_BIN_ID = '676a5c4be41b4d34e46cc5f8'; // Se creará automáticamente

// API para guardar/cargar datos
const dbAPI = {
    async loadSongs() {
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
