(() => {

  "use strict";



  const config = window.WEDDING_CONFIG || {};

  const $ = (selector) => document.querySelector(selector);



  const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;



  // Apertura de la invitación: la experiencia completa se revela al pulsar el botón.*

  const gate = $("#invitationGate");

  const openButton = $("#openInvitation");
  let startMusic = async () => {};

  if (gate && openButton) {

    document.body.classList.add("gate-locked");

    openButton.addEventListener("click", () => {

    gate.classList.add("is-opening");

    document.body.classList.remove("gate-locked");



    burstParticles(

        window.innerWidth / 2,

        window.innerHeight / 2,

        34

    );



    // Iniciar la música después de la interacción del invitado.*

    startMusic();



    window.setTimeout(() => gate.remove(), 1050);

}, { once: true });

  }



  // Partículas pequeñas en tonos marfil y oro. Se desactivan con movimiento reducido.*

  const canvas = $("#particleCanvas");

  const ctx = canvas?.getContext("2d");

  const particles = [];

  let canvasWidth = 0, canvasHeight = 0, animationFrame = 0;

  const palette = ["rgba(232,216,190,", "rgba(211,190,153,", "rgba(255,250,239,"];

  const resizeCanvas = () => {

    if (!canvas || !ctx) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth; canvasHeight = window.innerHeight;

    canvas.width = Math.round(canvasWidth * ratio);

    canvas.height = Math.round(canvasHeight * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  };

  function burstParticles(x, y, count = 8) {

    if (motionOff || !ctx) return;

    for (let i = 0; i < count && particles.length < 90; i++) {

      const angle = Math.random() * Math.PI * 2;

      const speed = .35 + Math.random() * 1.55;

      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - .35,

        life: 1, decay: .009 + Math.random() * .012, size: 1.2 + Math.random() * 2.1,

        color: palette[Math.floor(Math.random() * palette.length)] });

    }

    if (!animationFrame) animateParticles();

  }

  function animateParticles() {

    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = particles.length - 1; i >= 0; i--) {

      const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += .006; p.life -= p.decay;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.beginPath(); ctx.fillStyle = `${p.color}${Math.max(0, p.life * .72)})`;

      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();

    }

    if (particles.length) animationFrame = requestAnimationFrame(animateParticles);

    else { animationFrame = 0; ctx.clearRect(0, 0, canvasWidth, canvasHeight); }

  }

  if (ctx && !motionOff) {

    resizeCanvas(); window.addEventListener("resize", resizeCanvas, { passive: true });

    let lastTrail = 0;

    window.addEventListener("pointermove", event => {

      if (document.body.classList.contains("gate-locked")) return;

      const now = performance.now();

      if (now - lastTrail < 42) return;

      lastTrail = now;

      burstParticles(event.clientX, event.clientY, event.pointerType === "touch" ? 2 : 1);

    }, { passive: true });

    window.addEventListener("scroll", () => {

      const max = document.documentElement.scrollHeight - window.innerHeight;

      const progress = max > 0 ? window.scrollY / max : 0;

      const bar = $("#scrollProgress");

      if (bar) bar.style.width = `${progress * 100}%`;

    }, { passive: true });

  }

  const backTop = $("#backTop");

  window.addEventListener("scroll", () => {

    if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 420 && !document.body.classList.contains("gate-locked"));

  }, { passive: true });

  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" }));



  // Animaciones de entrada al desplazarse. Respeta la preferencia de movimiento reducido.*

  const revealItems = document.querySelectorAll(".welcome, .countdown-band .section-shell, .details > *, .gallery-section .section-shell > *, .rsvp > *, .footer > *");

  if (motionOff || !("IntersectionObserver" in window)) {

    revealItems.forEach(el => el.classList.add("is-visible"));

  } else {

    revealItems.forEach((el, index) => {

      el.classList.add("reveal");

      el.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 90}ms`);

    });

    const observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        }

      });

    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach(el => observer.observe(el));

  }



  const text = (selector, value, fallback) => {

    const element = $(selector);

    if (element) element.textContent = value || fallback;

  };



  const couple = [config.partnerOne, config.partnerTwo].filter(Boolean).join(" & ") || "Nuestra boda";

  document.title = `${couple} | Nuestra boda`;



  document.querySelectorAll('[data-text="partnerOne"]').forEach(el => el.textContent = config.partnerOne || "Nombre");

  document.querySelectorAll('[data-text="partnerTwo"]').forEach(el => el.textContent = config.partnerTwo || "Nombre");

  document.querySelectorAll('[data-text="couple"]').forEach(el => el.textContent = couple);

  text('[data-text="intro"]', config.intro, "CON ALEGRÍA EN EL CORAZÓN");



  // Fecha: no inventamos una fecha mientras no esté definida.*

  const dateElement = $("#coverDate");

  const countdownNote = $("#countdownNote");

  const countdown = $("#countdown");

  const date = config.weddingDate ? new Date(config.weddingDate) : null;

  const validDate = date && !Number.isNaN(date.getTime());



  if (validDate) {

    dateElement.textContent = new Intl.DateTimeFormat("es-MX", {

      day: "numeric", month: "long", year: "numeric"

    }).format(date).toLocaleUpperCase("es-MX");



    const updateCountdown = () => {

      const remaining = date.getTime() - Date.now();

      if (remaining <= 0) {

        countdown.innerHTML = '\<p class="muted-note">¡Hoy celebramos! Gracias por acompañarnos.\</p>';

        return;

      }

      const units = {

        days: Math.floor(remaining / 86400000),

        hours: Math.floor((remaining % 86400000) / 3600000),

        minutes: Math.floor((remaining % 3600000) / 60000),

        seconds: Math.floor((remaining % 60000) / 1000)

      };

      Object.entries(units).forEach(([id, value]) => {

        const node = document.getElementById(id);

        if (node) node.textContent = String(value).padStart(2, "0");

      });

    };

    updateCountdown();

    window.setInterval(updateCountdown, 1000);

    countdownNote.textContent = "Estamos contando los días para celebrar contigo.";

  } else {

    dateElement.textContent = "PRONTO COMPARTIREMOS LA FECHA";

    countdownNote.textContent = "La cuenta regresiva estará disponible cuando se confirme la fecha.";

    countdown.querySelectorAll("strong").forEach(node => node.textContent = "—");

  }



  // Información de ceremonia y recepción.*

  const events = [

    { key: "ceremony", time: "#ceremonyTime", venue: "#ceremonyVenue", address: "#ceremonyAddress", map: "#ceremonyMap" },

    { key: "reception", time: "#receptionTime", venue: "#receptionVenue", address: "#receptionAddress", map: "#receptionMap" }

  ];

  events.forEach(({ key, time, venue, address, map }) => {

    const item = config[key] || {};

    text(time, item.time, "Horario por confirmar");

    text(venue, item.venue, "Lugar por confirmar");

    text(address, item.address, "Próximamente compartiremos la dirección.");

    const link = $(map);

    if (link && item.mapUrl) {

      link.href = item.mapUrl;

      link.hidden = false;

    }

  });

  text("#dressCode", config.dressCode, "Por confirmar");



  // Galería: crea elementos de forma segura, sin insertar HTML recibido.*

  const gallery = $("#gallery");

  if (gallery && Array.isArray(config.gallery) && config.gallery.length) {

    gallery.replaceChildren();

    config.gallery.forEach((photo, index) => {

      if (!photo || !photo.src) return;

      const button = document.createElement("button");

      button.type = "button";

      button.setAttribute("aria-label", `Ampliar fotografía ${index + 1}`);

      const img = document.createElement("img");

      img.src = photo.src;

      img.alt = photo.alt || `Recuerdo ${index + 1}`;

      img.loading = "lazy";

      button.append(img);

      button.addEventListener("click", () => openLightbox(photo.src, img.alt));

      gallery.append(button);

    });

    if (!gallery.children.length) gallery.innerHTML = '\<div class="gallery-empty">Pronto compartiremos fotografías especiales.\</div>';

  }



  // Visor de fotografías.*

  const lightbox = $("#lightbox");

  const lightboxImage = $("#lightboxImage");

  const closeLightbox = () => {

    if (!lightbox) return;

    lightbox.hidden = true;

    document.body.style.overflow = "";

    if (lightboxImage) lightboxImage.removeAttribute("src");

  };

  function openLightbox(src, alt) {

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = src;

    lightboxImage.alt = alt || "Fotografía";

    lightbox.hidden = false;

    document.body.style.overflow = "hidden";

    $("#lightboxClose")?.focus();

  }

  $("#lightboxClose")?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", event => {

    if (event.target === lightbox) closeLightbox();

  });

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") closeLightbox();

  });



  // Confirmación: requiere un número real en config.js.*

  const form = $("#rsvpForm");

  const rsvpButton = $("#rsvpButton");

  const rsvpNote = $("#rsvpNote");

  const whatsapp = String(config.whatsappNumber || "").replace(/\D/g, "");

  if (!whatsapp) {

    rsvpButton.disabled = true;

    rsvpButton.title = "Falta configurar el número de WhatsApp";

    rsvpNote.textContent = "La confirmación estará disponible cuando se agregue el número de contacto.";

    rsvpButton.style.opacity = ".55";

    rsvpButton.style.cursor = "not-allowed";

  } else {

    rsvpNote.textContent = "Completa tus datos. WhatsApp se abrirá con el mensaje listo para enviar.";

    form?.addEventListener("submit", event => {

      event.preventDefault();

      if (!form.reportValidity()) return;

      const name = $("#guestName").value.trim();

      const attendance = $("#attendance").value;

      const guests = $("#guestCount").value;

      const message = $("#guestMessage").value.trim();

      const lines = [

        `Hola, somos ${couple}.`,

        `Confirmación de ${name}: ${attendance}.`,

        attendance === "Sí asistiré" ? `Número de personas: ${guests}.` : "",

        message ? `Mensaje: ${message}` : ""

      ].filter(Boolean);

      const url = `https\://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;

      window.open(url, "_blank", "noopener,noreferrer");

    });

  }






  // ============================================
  // REPRODUCTOR VINTAGE
  // ============================================
  const audio = $("#weddingAudio");
  const player = $("#musicPlayer");
  const playPause = $("#playPause");
  const muteButton = $("#muteMusic");
  const trackTitle = $("#trackTitle");
  const trackArtist = $("#trackArtist");
  const volume = $("#musicVolume");
  const progress = $("#trackProgress");
  const currentTimeLabel = $("#currentTime");
  const durationLabel = $("#trackDuration");
  const vinyl = $("#vinylRecord");
  const toggle = $("#musicToggle");
  const panel = $("#musicPanel");

  const playlist = Array.isArray(config.musicPlaylist)
    ? config.musicPlaylist.filter(track => track && track.src)
    : [];

  const icon = (name) => {
    const paths = {
      play: '<path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M8 6h3v12H8zM14 6h3v12h-3z" fill="currentColor" stroke="none"/>',
      previous: '<path d="M6 5v14M19 6l-10 6 10 6z"/>',
      next: '<path d="M18 5v14M5 6l10 6-10 6z"/>',
      volume: '<path d="M4 10v4h4l5 4V6l-5 4H4z"/><path d="M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11"/>',
      mute: '<path d="M4 10v4h4l5 4V6l-5 4H4z"/><path d="m17 9 5 6m0-6-5 6"/>',
      chevron: '<path d="m7 10 5 5 5-5"/>',
      disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || ""}</svg>`;
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (audio && player && playlist.length) {
    let currentTrack = 0;
    let isSeeking = false;

    player.hidden = false;
    audio.volume = Number(volume?.value ?? 0.55);

    const updatePlayer = () => {
      const playing = !audio.paused;
      if (playPause) {
        playPause.innerHTML = icon(playing ? "pause" : "play");
        playPause.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
        playPause.title = playing ? "Pausar" : "Reproducir";
      }
      if (muteButton) {
        muteButton.innerHTML = icon(audio.muted || audio.volume === 0 ? "mute" : "volume");
        muteButton.setAttribute("aria-label", audio.muted ? "Activar sonido" : "Silenciar música");
        muteButton.title = audio.muted ? "Activar sonido" : "Silenciar";
      }
      if (vinyl) vinyl.classList.toggle("is-spinning", playing);
      if (player) player.classList.toggle("is-playing", playing);
      if (toggle) toggle.classList.toggle("is-playing", playing);
    };

    const updateProgress = () => {
      const duration = audio.duration;
      const current = audio.currentTime || 0;
      if (currentTimeLabel) currentTimeLabel.textContent = formatTime(current);
      if (durationLabel) durationLabel.textContent = formatTime(duration);
      if (progress && !isSeeking) {
        const percentage = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;
        progress.value = String(percentage);
        progress.style.setProperty("--progress", `${percentage}%`);
        progress.setAttribute("aria-valuetext", `${formatTime(current)} de ${formatTime(duration)}`);
      }
    };

    const loadTrack = (index, autoplay = false) => {
      currentTrack = (index + playlist.length) % playlist.length;
      const track = playlist[currentTrack];
      audio.src = track.src;
      if (trackTitle) trackTitle.textContent = track.title || `Canción ${currentTrack + 1}`;
      if (trackArtist) trackArtist.textContent = track.artist || "Nuestra selección musical";
      audio.load();
      updateProgress();
      updatePlayer();
      if (autoplay) startMusic();
    };

    startMusic = async () => {
      try {
        if (!audio.src) loadTrack(currentTrack);
        await audio.play();
      } catch (error) {
        console.warn("No se pudo iniciar la reproducción:", error?.message || error);
      }
      updatePlayer();
    };

    playPause?.addEventListener("click", async () => {
      if (audio.paused) await startMusic();
      else audio.pause();
      updatePlayer();
    });

    muteButton?.addEventListener("click", () => {
      audio.muted = !audio.muted;
      updatePlayer();
    });

    volume?.addEventListener("input", () => {
      audio.volume = Number(volume.value);
      if (audio.volume > 0 && audio.muted) audio.muted = false;
      updatePlayer();
    });

    progress?.addEventListener("input", () => {
      isSeeking = true;
      const duration = audio.duration;
      if (Number.isFinite(duration) && duration > 0) {
        const previewTime = (Number(progress.value) / 100) * duration;
        if (currentTimeLabel) currentTimeLabel.textContent = formatTime(previewTime);
      }
    });

    progress?.addEventListener("change", () => {
      const duration = audio.duration;
      if (Number.isFinite(duration) && duration > 0) {
        audio.currentTime = (Number(progress.value) / 100) * duration;
      }
      isSeeking = false;
      updateProgress();
    });

    $("#prevTrack")?.addEventListener("click", () => loadTrack(currentTrack - 1, true));
    $("#nextTrack")?.addEventListener("click", () => loadTrack(currentTrack + 1, true));
    audio.addEventListener("ended", () => loadTrack(currentTrack + 1, true));
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("durationchange", updateProgress);
    audio.addEventListener("play", updatePlayer);
    audio.addEventListener("pause", updatePlayer);
    audio.addEventListener("volumechange", updatePlayer);

    toggle?.addEventListener("click", () => {
      const expanded = player.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? "Ocultar reproductor" : "Mostrar reproductor");
    });

    loadTrack(0);
  }

})();
