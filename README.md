# Bad Bunny - Canciones Exclusivas en Conciertos 🐰

Aplicación web para registrar y gestionar canciones exclusivas que Bad Bunny ha cantado en sus conciertos.

## 🌟 Características

- **Agregar canciones**: Registra nuevas canciones con nombre, fecha y ciudad
- **Editar/Eliminar**: Modifica o elimina canciones existentes
- **Búsqueda**: Filtra canciones por nombre, fecha o ciudad
- **Responsive**: Funciona perfectamente en móvil y escritorio
- **Almacenamiento local**: Los datos se guardan automáticamente en el navegador

## 📱 Despliegue en un Dominio

### Opción 1: GitHub Pages (GRATIS)

1. **Crear repositorio en GitHub**
   - Ve a [GitHub](https://github.com) y crea una cuenta (si no tienes)
   - Crea un nuevo repositorio público
   - Sube todos los archivos del proyecto

2. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - En "Source", selecciona "main" branch
   - Guarda los cambios
   - Tu sitio estará disponible en: `https://tuusuario.github.io/nombre-repositorio`

3. **Dominio personalizado (opcional)**
   - Compra un dominio en Namecheap, GoDaddy, etc.
   - En GitHub Pages settings, agrega tu dominio personalizado
   - Configura los DNS en tu proveedor de dominio

### Opción 2: Netlify (GRATIS)

1. **Crear cuenta en [Netlify](https://www.netlify.com)**
2. **Método de arrastrar y soltar**:
   - Arrastra la carpeta completa del proyecto a Netlify
   - Tu sitio se desplegará automáticamente
   - URL: `https://nombre-aleatorio.netlify.app`

3. **Dominio personalizado**:
   - En Site settings → Domain management
   - Agrega tu dominio personalizado

### Opción 3: Vercel (GRATIS)

1. **Crear cuenta en [Vercel](https://vercel.com)**
2. **Importar proyecto**:
   - Conecta tu repositorio de GitHub
   - O arrastra la carpeta del proyecto
   - Se desplegará automáticamente

3. **Dominio personalizado**:
   - En Project Settings → Domains
   - Agrega tu dominio

### Opción 4: Hosting tradicional

Si tienes un hosting con cPanel:
1. Sube los archivos vía FTP
2. Colócalos en la carpeta `public_html`
3. Accede desde tu dominio

## 🚀 Cómo usar

1. **Agregar canción**: Llena el formulario y presiona "Agregar Canción"
2. **Buscar**: Usa el campo de búsqueda para filtrar canciones
3. **Editar**: Haz clic en "Editar" para modificar una canción
4. **Eliminar**: Haz clic en "Eliminar" para quitar una canción

## 💾 Datos

Los datos se guardan automáticamente en el navegador usando localStorage. Si quieres exportar/importar datos o compartirlos entre dispositivos, puedes modificar el código para usar una base de datos online (Firebase, Supabase, etc.).

## 📁 Estructura de archivos

```
exclusivasBad/
├── index.html      # Página principal
├── styles.css      # Estilos y diseño responsive
├── script.js       # Funcionalidad de la aplicación
└── README.md       # Este archivo
```

## 🎨 Personalización

Puedes personalizar:
- Colores en `styles.css` (gradientes, botones)
- Textos y títulos en `index.html`
- Funcionalidad en `script.js`

## 📞 Soporte

Si necesitas ayuda para desplegar o personalizar la aplicación, consulta:
- [Documentación de GitHub Pages](https://pages.github.com)
- [Documentación de Netlify](https://docs.netlify.com)
- [Documentación de Vercel](https://vercel.com/docs)

---

Hecho con ❤️ para los fans de Bad Bunny 🐰
