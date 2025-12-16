// API de autenticación - genera token JWT
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    // Validar contraseña
    if (password === ADMIN_PASSWORD) {
        // Generar token JWT válido por 24 horas
        const token = jwt.sign(
            { admin: true },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            success: true,
            token
        });
    }

    return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta'
    });
}
