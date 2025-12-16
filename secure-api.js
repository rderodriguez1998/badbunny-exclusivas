// Cliente API seguro - todas las credenciales están en el servidor
const secureAPI = {
    // Obtener token del localStorage
    getToken() {
        return localStorage.getItem('admin_token');
    },

    // Guardar token
    setToken(token) {
        localStorage.setItem('admin_token', token);
    },

    // Eliminar token
    clearToken() {
        localStorage.removeItem('admin_token');
    },

    // Login - validar contraseña y obtener token
    async login(password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                this.setToken(data.token);
                return { success: true };
            }

            return { success: false, error: data.error };
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: 'Error de conexión' };
        }
    },

    // Cargar canciones (público)
    async loadSongs() {
        try {
            const response = await fetch('/api/songs');
            const data = await response.json();
            return data.songs || [];
        } catch (error) {
            console.error('Error cargando canciones:', error);
            return [];
        }
    },

    // Cargar canciones (admin con autenticación)
    async loadSongsAdmin() {
        const token = this.getToken();

        if (!token) {
            return [];
        }

        try {
            const response = await fetch('/api/admin-songs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                // Token inválido o expirado
                this.clearToken();
                return [];
            }

            const data = await response.json();
            return data.songs || [];
        } catch (error) {
            console.error('Error cargando canciones:', error);
            return [];
        }
    },

    // Guardar canciones (solo admin)
    async saveSongs(songs) {
        const token = this.getToken();

        if (!token) {
            throw new Error('No autorizado');
        }

        try {
            const response = await fetch('/api/admin-songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ songs })
            });

            if (response.status === 401) {
                // Token inválido o expirado
                this.clearToken();
                throw new Error('Sesión expirada');
            }

            const data = await response.json();

            if (data.success) {
                return true;
            }

            throw new Error(data.error || 'Error al guardar');
        } catch (error) {
            console.error('Error guardando canciones:', error);
            throw error;
        }
    }
};

// Mantener compatibilidad con código existente
const dbAPI = {
    loadSongs: () => secureAPI.loadSongs(),
    saveSongs: (songs) => secureAPI.saveSongs(songs)
};
