
/**
 * CONFIGURACIÓN DE LA INVITACIÓN
 * Modifica estos valores cuando tengas la información definitiva.
 * Para dejar un dato pendiente, conserva la cadena vacía "".
 */

window.WEDDING_CONFIG = {
    partnerOne: "Paty",
    partnerTwo: "Eddy",

    intro: "CON ALEGRÍA EN EL CORAZÓN",

    // Fecha y hora del evento.
    // Formato: "AAAA-MM-DDTHH:MM:SS"
    weddingDate: "",

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

    dressCode: "",

    // Número internacional sin +, espacios ni guiones.
    whatsappNumber: "",

    // ========================================
    // REPRODUCTOR DE MÚSICA
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

    gallery: [
        // Ejemplo:
        // {
        //     src: "assets/images/galeria/foto-1.jpg",
        //     alt: "Fotografía de Paty y Eddy"
        // }
    ]
};
