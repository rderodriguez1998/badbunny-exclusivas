// Configuración de almacenamiento en la nube usando JSONBin.io
// IMPORTANTE: Reemplaza esta API key con tu propia key de https://jsonbin.io
const JSONBIN_API_KEY = '$2a$10$bz94lPavce.zJgp43Q98L.H8vWDoYQYcT5lC/RWmQ5VvIoqZ1Y/IW';
// ID del bin compartido - IMPORTANTE: copia aquí el ID del bin que ya creaste
const JSONBIN_BIN_ID = '6940a420ae596e708f9c9cf7'; // Reemplaza con tu bin ID real

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
            // Actualizar el bin existente
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ songs: songs })
            });

            if (!response.ok) {
                console.error('Error al guardar:', await response.text());
            }
            return response.ok;
        } catch (error) {
            console.error('Error guardando canciones:', error);
            return false;
        }
    }
};
