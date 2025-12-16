// API pública para obtener canciones (solo lectura)
export default async function handler(req, res) {
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
    const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

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
