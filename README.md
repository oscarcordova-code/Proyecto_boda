# Invitación de boda | Paty & Edy

Sitio estático (HTML, CSS y JavaScript, sin dependencias) listo para GitHub Pages. Diseño en **negro y dorado** con identidad cristiana discreta.

## Qué incluye

- **Portada** con los nombres, el versículo de Jeremías 29:11 y el botón «Descubrir invitación».
- Al pulsar el botón: transición, animaciones de apertura, partículas doradas discretas e intento de reproducir música (los navegadores solo lo permiten tras una interacción; si lo bloquean, el botón de reproducción manual sigue funcionando).
- Secciones, en orden: Bienvenida → Cuenta regresiva → Detalles (ceremonia y recepción, con lugar, foto y mapa) → Código de vestimenta → Galería → Confirmación por WhatsApp.
- Reproductor vintage (vinilo, anterior/siguiente, pausa, progreso, volumen, silencio). En móvil se despliega con un botón flotante.
- Indicador de progreso, botón «volver arriba», lightbox, rastro dorado del cursor (escritorio) o destellos al desplazarse (móvil).
- Respeta `prefers-reduced-motion`.

## Estructura

```text
Proyecto_boda/
├── index.html
├── css/style.css
├── js/config.js     ← lo único que hay que editar
├── js/main.js
└── assets/
    ├── images/galeria/   (crear al añadir fotos)
    └── audio/
```

## Completar la invitación (`js/config.js`)

Todo dato pendiente se deja como `""`; la página muestra «por confirmar» y oculta los botones que dependen de él (nunca genera enlaces vacíos).

| Campo                    | Qué hace                                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `weddingDate`            | `"AAAA-MM-DDTHH:MM:SS"`, p. ej. `"2027-06-12T16:00:00"` (ejemplo ilustrativo). Activa el contador. |
| `ceremony` / `reception` | Horario, lugar, dirección, `mapUrl` (enlace `https://` de Google Maps) y `image` (foto opcional).  |
| `dressCode`              | Texto para mujeres y hombres (`men` vacío = «Por confirmar»).                                      |
| `whatsappNumber`         | Solo dígitos con lada, sin `+`: `"52…"`. Activa la confirmación.                                   |
| `musicPlaylist`          | Lista `{ title, artist, src }`. Única fuente de las canciones.                                     |
| `gallery`                | Lista `{ src, alt }` con rutas en `assets/images/galeria/`.                                        |
| `bibleVerse`             | Texto y referencia de la portada.                                                                  |

### Fotos

Copia las imágenes a `assets/images/galeria/` (JPG o WebP, lado mayor ~1600 px, menos de 500 KB) y agrégalas a `gallery`. Si una ruta falla, esa foto se omite en lugar de mostrar una imagen rota.

### Música

Coloca los audios en `assets/audio/` y enlístalos en `musicPlaylist`. Usa grabaciones propias o con licencia que permita publicarlas en la web.

## Probar localmente

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`.

## Publicar con GitHub Pages

1. Sube el contenido a la raíz del repositorio.
2. En **Settings → Pages** elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`.

## Colaboración

Trabajen en ramas separadas y abran Pull Requests hacia `main`. No suban datos privados de invitados.
