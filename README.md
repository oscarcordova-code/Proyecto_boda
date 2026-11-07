# Invitación de boda | Paty & Eddy

Sitio estático hecho con HTML, CSS y JavaScript. Está preparado para GitHub Pages y no necesita frameworks ni instalación de dependencias. Incluye una pantalla inicial con el botón **Descubrir invitación**, partículas discretas al abrir, estela suave del cursor/dedo, animaciones al desplazarse, indicador de progreso, botón flotante para volver al inicio y diseño adaptable a móviles, tabletas y escritorio. También incluye un reproductor compacto con playlist, anterior/siguiente, pausa, silencio y volumen.

## Estructura

```text
Proyecto_boda/
├── index.html
├── css/estilo.css
├── js/config.js
├── js/main.js
└── assets/
    ├── images/galeria/
    └── audio/
```

## Personalizar la invitación

Edita `js/config.js`. Ahí se concentran los datos que pueden cambiar:

- Nombres.
- Fecha y hora de la boda.
- Horarios, lugares, direcciones y enlaces de mapas.
- Código de vestimenta.
- Número de WhatsApp.
- Música y fotografías de la galería.

Los datos desconocidos se dejan vacíos. La cuenta regresiva y la confirmación por WhatsApp se activan cuando agregues los datos correspondientes.

### Fecha

Usa el formato local ISO `AAAA-MM-DDTHH:MM:SS`, por ejemplo `2027-06-12T16:00:00`. El ejemplo es ilustrativo, no es la fecha real.

### WhatsApp

Escribe el número con lada internacional, solo dígitos, sin `+`, espacios ni guiones. Para México normalmente comienza con `52`.

### Fotos

Copia las imágenes a `assets/images/galeria/` y agrega cada ruta al arreglo `gallery` en `js/config.js`:

```js
gallery: [
  { src: "assets/images/galeria/foto-1.jpg", alt: "Un recuerdo especial" },
  { src: "assets/images/galeria/foto-2.jpg", alt: "Otro recuerdo" },
];
```

### Música

Coloca los audios en `assets/audio/` y configura una lista de canciones:

```js
musicPlaylist: [
  { title: "Nuestra canción", src: "assets/audio/cancion-1.mp3" },
  { title: "Un recuerdo", src: "assets/audio/cancion-2.mp3" },
  { title: "Para bailar", src: "assets/audio/cancion-3.mp3" },
];
```

Puedes usar una, dos o varias canciones. El reproductor incluye anterior, siguiente, reproducir/pausar, silenciar y volumen. La reproducción comienza únicamente cuando el visitante pulsa reproducir, porque los navegadores bloquean normalmente el audio automático. El campo antiguo `music` sigue funcionando para una sola pista.

**Ideas musicales:** para una atmósfera elegante, prueba una versión instrumental de _Gymnopédie No. 1_ (Erik Satie); para algo más clásico, _Canon en re mayor_ (Pachelbel); y para un ambiente delicado, _Clair de Lune_ (Debussy). Las composiciones pueden ser de dominio público según el país, pero una grabación concreta puede seguir protegida por derechos de autor. Usa una grabación propia o con licencia que permita publicarla en la web.

## Interacciones y accesibilidad

- El botón **Descubrir invitación** dispara una pequeña dispersión de partículas color marfil/dorado.
- Una estela muy tenue acompaña el cursor y los movimientos táctiles. No se dibuja sobre los controles ni bloquea clics.
- La barra superior indica el avance del desplazamiento.
- El botón flotante para volver al inicio aparece después de bajar por la página y mantiene contraste sólido.
- Se respeta `prefers-reduced-motion`; si el visitante desactiva las animaciones en su sistema, los efectos se reducen.

## Probar localmente

Abre la carpeta con VS Code y ejecuta `index.html` con Live Server. También puedes usar Python desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.

## Publicar con GitHub Pages

1. Sube el contenido de esta carpeta a la raíz del repositorio.
2. En GitHub abre **Settings → Pages**.
3. Selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda y espera a que termine la publicación.

## Colaboración

Trabajen en ramas separadas y abran Pull Requests hacia `main`. Antes de empezar una sesión:

```bash
git pull origin main
git switch -c feature/nombre-del-cambio
```

Después de editar:

```bash
git add .
git commit -m "Describe el cambio"
git push -u origin feature/nombre-del-cambio
```

No suban información privada de invitados ni archivos innecesarios. Optimicen las imágenes antes de agregarlas al repositorio. Para la galería, pueden usar JPG o WebP, con el lado mayor cercano a 1600 px y procurando que cada archivo pese menos de 500 KB. Solo deben copiar las fotos a `assets/images/galeria/` y añadir sus rutas en `js/config.js`; no hace falta modificar el HTML ni el JavaScript.
