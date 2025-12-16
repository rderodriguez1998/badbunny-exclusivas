// API protegida para operaciones admin (POST, PUT, DELETE)
const jwt = require('jsonwebtoken');

// Verificar token JWT
function verifyToken(req) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = async function handler(req, res) {
    // Verificar autenticación
    const user = verifyToken(req);

    if (!user || !user.admin) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
    const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

    // GET - Obtener canciones (para admin)
    if (req.method === 'GET') {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });

            if (response.ok) {
                const data = await response.json();
                return res.status(200).json({ songs: data.record.songs || [] });
            }

            return res.status(500).json({ error: 'Error al cargar datos' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Error del servidor' });
        }
    }

    // POST - Guardar canciones
    if (req.method === 'POST') {
        const { songs } = req.body;

        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ songs })
            });

            if (response.ok) {
                return res.status(200).json({ success: true });
            }

            return res.status(500).json({ error: 'Error al guardar datos' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Error del servidor' });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
