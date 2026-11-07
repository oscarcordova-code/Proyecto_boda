/**
 * CONFIGURACIÓN DE LA INVITACIÓN
 *
 * Todo lo que los novios pueden modificar está aquí.
 * Para dejar un dato pendiente, conserva la cadena vacía "".
 * No hace falta tocar index.html ni main.js.
 */

window.WEDDING_CONFIG = {
    partnerOne: "Paty",
    partnerTwo: "Edy",

    intro: "CON ALEGRÍA EN EL CORAZÓN",

    // Versículo de la portada (se muestra entre comillas latinas automáticamente).
    bibleVerse: {
        text: "Porque yo sé los planes que tengo para ustedes, dice el Señor, planes de bienestar y no de mal, para darles un futuro y una esperanza.",
        reference: "Jeremías 29:11"
    },

    // Fecha y hora del evento. Formato: "AAAA-MM-DDTHH:MM:SS"
    // Ejemplo (ilustrativo, no es la fecha real): "2027-06-12T16:00:00"
    weddingDate: "",

    // Ubicación principal del evento (aparece justo después de la bienvenida).
    // mapUrl: enlace de Google Maps que empiece con https://
    venue: {
        name: "",
        address: "",
        mapUrl: ""
    },

    // Detalles por momento del día. Si ceremonia y recepción son en el
    // mismo salón, basta con completar el horario y dejar lugar/dirección vacíos.
    ceremony: {
        time: "",
        venue: "",
        address: "",
        mapUrl: ""
    },

    reception: {
        time: "",
        venue: "",
        address: "",
        mapUrl: ""
    },

    // Código de vestimenta. "men" vacío = "Por confirmar".
    // avoidColors son solo muestras visuales de lo que NO deben usar las mujeres.
    dressCode: {
        women: "Evitar vestidos o prendas de color blanco y beige.",
        men: "",
        avoidColors: [
            { name: "Blanco", color: "#fbf8f1" },
            { name: "Beige", color: "#d9c4a0" }
        ]
    },

    // Número internacional, solo dígitos, sin +, espacios ni guiones.
    // Ejemplo para México: "5212221234567"
    whatsappNumber: "",

    // ========================================
    // REPRODUCTOR DE MÚSICA (única fuente de la lista)
    // ========================================
    musicPlaylist: [
        {
            title: "Flaca",
            artist: "Andrés Calamaro",
            src: "assets/audio/cancion_1.mp3"
        },
        {
            title: "Francés Limón",
            artist: "Enanitos Verdes",
            src: "assets/audio/cancion_2.mp3"
        },
        {
            title: "Vida en el Espejo",
            artist: "Enjambre",
            src: "assets/audio/cancion_3.mp3"
        },
        {
            title: "Perfecta",
            artist: "Miranda",
            src: "assets/audio/cancion_4.mp3"
        }
    ],

    // ========================================
    // GALERÍA DE FOTOGRAFÍAS
    // ========================================
    // Ejemplo:
    // { src: "assets/images/galeria/foto-1.jpg", alt: "Paty y Edy" }
    gallery: []
};