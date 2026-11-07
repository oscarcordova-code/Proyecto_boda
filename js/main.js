(() => {
  "use strict";

  const config = window.WEDDING_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isLocked = () => document.body.classList.contains("gate-locked");

  /* ---------- Utilidades ---------- */

  const setText = (selector, value, fallback) => {
    const el = $(selector);
    if (el) el.textContent = value || fallback;
  };

  // Muestra un elemento solo si tiene contenido.
  const setOptional = (selector, value) => {
    const el = $(selector);
    if (!el) return false;
    const has = Boolean(value && String(value).trim());
    el.hidden = !has;
    if (has) el.textContent = value;
    return has;
  };

  // Solo acepta enlaces http(s) válidos; evita enlaces vacíos o peligrosos.
  const safeUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (error) {
      return "";
    }
  };

  const setLink = (selector, value) => {
    const el = $(selector);
    if (!el) return false;
    const href = safeUrl(value);
    el.hidden = !href;
    if (href) el.href = href;
    else el.removeAttribute("href");
    return Boolean(href);
  };

  /* ---------- Nombres y versículo ---------- */

  const partnerOne = config.partnerOne || "Paty";
  const partnerTwo = config.partnerTwo || "Edy";
  const couple = `${partnerOne} & ${partnerTwo}`;
  document.title = `${couple} | Nuestra boda`;

  $$('[data-text="partnerOne"]').forEach((el) => { el.textContent = partnerOne; });
  $$('[data-text="partnerTwo"]').forEach((el) => { el.textContent = partnerTwo; });
  $$('[data-text="couple"]').forEach((el) => { el.textContent = couple; });
  setText('[data-text="intro"]', config.intro, "CON ALEGRÍA EN EL CORAZÓN");
  const initials = `${partnerOne.charAt(0)}&${partnerTwo.charAt(0)}`.toUpperCase();
  $$('[data-text="initials"]').forEach((el) => { el.textContent = initials; });

  const verse = config.bibleVerse || {};
  if (verse.text) {
    const clean = String(verse.text).trim().replace(/^[«"“]+|[»"”]+$/g, "").replace(/\.$/, "");
    setText('[data-verse="text"]', `«${clean}».`, "");
  }
  if (verse.reference) setText('[data-verse="reference"]', verse.reference, "");

  /* ---------- Partículas doradas ---------- */

  const canvas = $("#particleCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const particles = [];
  const palette = ["rgba(201,169,106,", "rgba(227,207,163,", "rgba(243,236,224,"];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrame = 0;

  const resizeCanvas = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const animateParticles = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.006;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.fillStyle = `${p.color}${Math.max(0, p.life * 0.7)})`;
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    if (particles.length) {
      animationFrame = requestAnimationFrame(animateParticles);
    } else {
      animationFrame = 0;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  };

  const burstParticles = (x, y, count = 8) => {
    if (motionOff || !ctx) return;
    for (let i = 0; i < count && particles.length < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.35 + Math.random() * 1.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.35,
        life: 1,
        decay: 0.009 + Math.random() * 0.012,
        size: 1.2 + Math.random() * 2,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
    if (!animationFrame) animationFrame = requestAnimationFrame(animateParticles);
  };

  if (ctx && !motionOff) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Chispas doradas discretas al tocar o hacer clic (no sobre controles de formulario).
    window.addEventListener("pointerdown", (event) => {
      if (isLocked()) return;
      if (event.target.closest && event.target.closest("input, textarea, select, .music-player, .lightbox")) return;
      burstParticles(event.clientX, event.clientY, 7);
    }, { passive: true });

    if (!coarsePointer) {
      // Escritorio: rastro dorado discreto que sigue al cursor.
      let lastTrail = 0;
      window.addEventListener("pointermove", (event) => {
        if (isLocked()) return;
        const now = performance.now();
        if (now - lastTrail < 45) return;
        lastTrail = now;
        burstParticles(event.clientX, event.clientY, 1);
      }, { passive: true });
    } else {
      // Móvil: destellos suaves en los bordes mientras se desplaza.
      let lastScrollFx = 0;
      window.addEventListener("scroll", () => {
        if (isLocked()) return;
        const now = performance.now();
        if (now - lastScrollFx < 140) return;
        lastScrollFx = now;
        const side = Math.random() < 0.5 ? 0.08 : 0.92;
        burstParticles(window.innerWidth * side, window.innerHeight * (0.35 + Math.random() * 0.4), 1);
      }, { passive: true });
    }
  }

  /* ---------- Apertura de la invitación ---------- */

  const gate = $("#invitationGate");
  const openButton = $("#openInvitation");
  const app = $("#app");
  let startMusic = async () => {};

  if (gate && openButton) {
    document.body.classList.add("gate-locked");
    if (app) app.setAttribute("inert", "");
    openButton.focus({ preventScroll: true });

    // Interacción solo en escritorio: paralaje suave y botón «magnético».
    if (!motionOff && !coarsePointer) {
      const wrap = openButton.parentElement;
      gate.addEventListener("pointermove", (event) => {
        const px = (event.clientX / window.innerWidth - 0.5) * 2;
        const py = (event.clientY / window.innerHeight - 0.5) * 2;
        gate.style.setProperty("--px", px.toFixed(3));
        gate.style.setProperty("--py", py.toFixed(3));
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const near = Math.hypot(dx, dy) < 190;
          wrap.style.setProperty("--mx", near ? `${(dx * 0.12).toFixed(1)}px` : "0px");
          wrap.style.setProperty("--my", near ? `${(dy * 0.18).toFixed(1)}px` : "0px");
        }
      }, { passive: true });
    }

    // Tocar el sobre o el sello equivale a pulsar el botón.
    $("#envelope")?.addEventListener("click", () => openButton.click());

    openButton.addEventListener("click", (event) => {
      // Onda dorada desde el punto de pulsación y vibración leve en móvil.
      if (!motionOff) {
        const rect = openButton.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        const fromKeyboard = event.clientX === 0 && event.clientY === 0;
        ripple.style.left = `${fromKeyboard ? rect.width / 2 : event.clientX - rect.left}px`;
        ripple.style.top = `${fromKeyboard ? rect.height / 2 : event.clientY - rect.top}px`;
        openButton.append(ripple);
      }
      if (navigator.vibrate) navigator.vibrate(18);

      // El sobre se centra en pantalla mientras el resto del texto se desvanece.
      const env = $("#envelope");
      if (env) {
        const er = env.getBoundingClientRect();
        gate.style.setProperty("--env-lift", `${Math.round(window.innerHeight / 2 - (er.top + er.height / 2))}px`);
      }

      gate.classList.add("is-opening");
      document.body.classList.remove("gate-locked");
      document.body.classList.add("is-open");
      if (app) app.removeAttribute("inert");
      window.scrollTo(0, 0);

      // Chispas desde el botón y una segunda oleada cuando la cortina se abre.
      const sealEl = $(".envelope__seal");
      const origin = (sealEl || openButton).getBoundingClientRect();
      burstParticles(origin.left + origin.width / 2, origin.top + origin.height / 2, 30);
      window.setTimeout(() => burstParticles(window.innerWidth / 2, window.innerHeight / 2, 24), 1000);
      window.setTimeout(() => burstParticles(window.innerWidth / 2, window.innerHeight / 2, 26), 2200);

      // Solo ahora (tras la interacción) se intenta reproducir la música.
      startMusic();

      const main = $("#contenido");
      if (main) main.focus({ preventScroll: true });
      window.setTimeout(() => gate.remove(), motionOff ? 100 : 3400);
    }, { once: true });
  } else {
    document.body.classList.remove("gate-locked");
  }

  /* ---------- Iluminación ambiental por sección ---------- */
  // Un solo IntersectionObserver observa una franja fina en el centro de la pantalla y
  // escribe body[data-glow]; el CSS mueve la luz con transform/opacity. Sin listeners extra.
  let glowFromView = "hero";
  let glowAtEnd = false;
  const applyGlow = () => { document.body.dataset.glow = glowAtEnd ? "footer" : glowFromView; };
  applyGlow();
  const glowTargets = $$("[data-glow]");
  if ("IntersectionObserver" in window && glowTargets.length) {
    const glowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          glowFromView = entry.target.dataset.glow;
          applyGlow();
        }
      });
    }, { rootMargin: "-48% 0px -48% 0px" });
    glowTargets.forEach((target) => glowObserver.observe(target));
  }

  /* ---------- Progreso de scroll y botón «volver arriba» ---------- */

  const progressBar = $("#scrollProgress");
  const backTop = $("#backTop");
  const scrollHint = $("#scrollHint");
  const heroEl = $("#inicio");
  const scrubEl = $(".welcome .lead");
  let scrubWords = [];
  if (scrubEl && !motionOff) {
    const words = scrubEl.textContent.trim().split(/\s+/);
    scrubEl.textContent = "";
    scrubEl.classList.add("scrub");
    scrubWords = words.map((word, index) => {
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = word;
      scrubEl.append(span);
      if (index < words.length - 1) scrubEl.append(document.createTextNode(" "));
      return span;
    });
  }
  const updateScrub = () => {
    if (!scrubWords.length) return;
    const rect = scrubEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(Math.max((vh * 0.88 - rect.top) / (vh * 0.42), 0), 1);
    const lit = Math.round(progress * scrubWords.length);
    scrubWords.forEach((span, i) => span.classList.toggle("on", i < lit));
  };
  let scrollTicking = false;

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressBar) progressBar.style.width = `${ratio * 100}%`;
      if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 420 && !isLocked());
      if (scrollHint) scrollHint.classList.toggle("is-gone", window.scrollY > 40);
      if (heroEl && !motionOff) heroEl.style.setProperty("--hero", Math.min(window.scrollY / Math.max(heroEl.offsetHeight, 1), 1).toFixed(3));
      updateScrub();
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (atEnd !== glowAtEnd) { glowAtEnd = atEnd; applyGlow(); }
      scrollTicking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrub();
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: motionOff ? "auto" : "smooth" }));

  /* ---------- Animaciones al desplazarse ---------- */

  const revealItems = $$(".welcome > *, .location .section-shell > *, .countdown-section > *, .details .section-shell > :not(.event-grid), .event-card, .dress > :not(.dress-grid), .dress-card, .gallery-section .section-shell > *, .rsvp > *, .footer > *");
  if (motionOff || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add("is-visible");
          observer.unobserve(target);
          // Tras la entrada se quita el retraso para que hover/toque respondan al instante.
          window.setTimeout(() => target.style.setProperty("--reveal-delay", "0ms"), 1500);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach((el, index) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
      observer.observe(el);
    });
  }

  /* ---------- Ubicación principal ---------- */

  const venue = config.venue || {};
  const hasVenueName = Boolean(venue.name && venue.name.trim());
  const hasVenueAddress = setOptional("#venueAddress", venue.address);
  setText("#venueName", hasVenueName ? venue.name : "", "Ubicación por confirmar");
  if (!hasVenueName && hasVenueAddress) {
    // Hay dirección pero no nombre: se muestra solo la dirección.
    const nameEl = $("#venueName");
    if (nameEl) nameEl.hidden = true;
  }
  setLink("#venueMap", venue.mapUrl);

  /* ---------- Fecha y cuenta regresiva ---------- */

  const coverDate = $("#coverDate");
  const countdown = $("#countdown");
  const countdownNote = $("#countdownNote");
  const weddingDate = config.weddingDate ? new Date(config.weddingDate) : null;
  const validDate = Boolean(weddingDate) && !Number.isNaN(weddingDate.getTime());

  const showCountdownMessage = (message) => {
    if (countdown) countdown.hidden = true;
    if (countdownNote) countdownNote.textContent = message;
  };

  if (validDate) {
    if (coverDate) {
      coverDate.textContent = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" })
        .format(weddingDate).toLocaleUpperCase("es-MX");
    }
    const nodes = {
      days: $("#days"), hours: $("#hours"), minutes: $("#minutes"), seconds: $("#seconds")
    };
    let timer = 0;
    const tick = () => {
      const remaining = weddingDate.getTime() - Date.now();
      if (remaining <= 0) {
        showCountdownMessage("Gracias por ser parte de este día tan especial.");
        if (timer) window.clearInterval(timer);
        return;
      }
      const units = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      };
      Object.entries(units).forEach(([key, value]) => {
        const node = nodes[key];
        if (!node) return;
        const next = String(value).padStart(2, "0");
        if (node.textContent === next) return;
        const first = node.textContent === "--";
        node.textContent = next;
        if (!first && !motionOff) {
          node.classList.remove("tick");
          void node.offsetWidth;
          node.classList.add("tick");
        }
      });
    };
    if (countdownNote) countdownNote.textContent = "Estamos contando los días para celebrar contigo.";
    tick();
    timer = window.setInterval(tick, 1000);
  } else {
    if (coverDate) coverDate.textContent = "PRONTO COMPARTIREMOS LA FECHA";
    showCountdownMessage("La cuenta regresiva comenzará cuando se confirme la fecha.");
  }

  /* ---------- Detalles: ceremonia y recepción ---------- */

  [
    { key: "ceremony", time: "#ceremonyTime", venue: "#ceremonyVenue", address: "#ceremonyAddress", map: "#ceremonyMap" },
    { key: "reception", time: "#receptionTime", venue: "#receptionVenue", address: "#receptionAddress", map: "#receptionMap" }
  ].forEach(({ key, time, venue: venueSel, address, map }) => {
    const item = config[key] || {};
    setText(time, item.time, "Horario por confirmar");
    setOptional(venueSel, item.venue);
    setOptional(address, item.address);
    setLink(map, item.mapUrl);
  });

  /* ---------- Código de vestimenta ---------- */

  const dress = config.dressCode && typeof config.dressCode === "object" ? config.dressCode : {};
  setText("#dressWomen", dress.women, "Por confirmar");
  setText("#dressMen", dress.men, "Por confirmar");

  const swatchList = $("#dressSwatches");
  if (swatchList && Array.isArray(dress.avoidColors)) {
    swatchList.replaceChildren();
    dress.avoidColors.forEach((item) => {
      if (!item || !item.name || !item.color) return;
      const li = document.createElement("li");
      const dot = document.createElement("i");
      dot.style.setProperty("--swatch", item.color);
      dot.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = item.name;
      li.append(dot, label);
      swatchList.append(li);
    });
  }

  /* ---------- Galería y lightbox ---------- */

  const gallery = $("#gallery");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");
  const lightboxCount = $("#lightboxCount");
  const photos = Array.isArray(config.gallery) ? config.gallery.filter((photo) => photo && photo.src) : [];
  let currentPhoto = 0;
  let lastFocused = null;

  const showPhoto = (index, direction = 0) => {
    if (!photos.length || !lightboxImage) return;
    currentPhoto = (index + photos.length) % photos.length;
    const photo = photos[currentPhoto];
    lightboxImage.classList.remove("is-swap");
    void lightboxImage.offsetWidth;
    lightboxImage.style.setProperty("--dir", String(direction));
    if (!motionOff) lightboxImage.classList.add("is-swap");
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt || `Fotografía ${currentPhoto + 1}`;
    if (lightboxCount) lightboxCount.textContent = photos.length > 1 ? `${currentPhoto + 1} / ${photos.length}` : "";
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = isLocked() ? "hidden" : "";
    if (lightboxImage) lightboxImage.removeAttribute("src");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage) return;
    lastFocused = document.activeElement;
    const several = photos.length > 1;
    [lightboxPrev, lightboxNext].forEach((btn) => { if (btn) btn.hidden = !several; });
    showPhoto(index, 0);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  };

  const buildGalleryEmpty = () => {
    const box = document.createElement("div");
    box.className = "gallery-empty";
    const frames = document.createElement("div");
    frames.className = "gallery-empty__frames";
    frames.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 3; i++) frames.append(document.createElement("i"));
    const text = document.createElement("p");
    text.textContent = "Pronto compartiremos fotografías especiales.";
    box.append(frames, text);
    return box;
  };

  if (gallery && photos.length) {
    gallery.replaceChildren();
    photos.slice().forEach((photo, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.style.setProperty("--i", String(index));
      button.setAttribute("aria-label", `Ampliar fotografía ${index + 1}`);
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || `Recuerdo ${index + 1}`;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        // Foto inexistente: se retira de la galería y del visor.
        const at = photos.indexOf(photo);
        if (at >= 0) photos.splice(at, 1);
        button.remove();
        if (!gallery.children.length) {
          gallery.append(buildGalleryEmpty());
        }
      });
      button.append(img);
      button.addEventListener("click", () => openLightbox(Math.max(photos.indexOf(photo), 0)));
      gallery.append(button);
    });
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => showPhoto(currentPhoto - 1, -1));
  lightboxNext?.addEventListener("click", () => showPhoto(currentPhoto + 1, 1));
  lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });

  // Deslizar con el dedo para cambiar de foto.
  let swipeStart = null;
  lightboxImage?.addEventListener("pointerdown", (event) => { swipeStart = { x: event.clientX, y: event.clientY }; });
  lightboxImage?.addEventListener("pointerup", (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (photos.length > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      showPhoto(currentPhoto + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  });
  lightboxImage?.addEventListener("pointercancel", () => { swipeStart = null; });

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight" && photos.length > 1) showPhoto(currentPhoto + 1, 1);
    if (event.key === "ArrowLeft" && photos.length > 1) showPhoto(currentPhoto - 1, -1);
    if (event.key === "Tab") {
      event.preventDefault();
      const items = [lightboxPrev, lightboxClose, lightboxNext].filter((el) => el && !el.hidden);
      const at = items.indexOf(document.activeElement);
      const next = event.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at + 1) % items.length;
      items[next]?.focus();
    }
  });

  /* ---------- Confirmación por WhatsApp ---------- */

  const form = $("#rsvpForm");
  const rsvpButton = $("#rsvpButton");
  const rsvpNote = $("#rsvpNote");
  const guestCountInput = $("#guestCount");
  const guestCountOut = $("#guestCountOut");
  const guestMinus = $("#guestMinus");
  const guestPlus = $("#guestPlus");
  const companionsField = $("#companionsField");
  const MAX_COMPANIONS = 4;
  const whatsapp = String(config.whatsappNumber || "").replace(/\D/g, "");
  const whatsappReady = whatsapp.length >= 8;
  const getAttendance = () => (form?.querySelector('input[name="attendance"]:checked')?.value) || "";

  const setCompanions = (value, animate = true) => {
    const n = Math.min(Math.max(value, 0), MAX_COMPANIONS);
    if (guestCountInput) guestCountInput.value = String(n);
    if (guestCountOut) {
      guestCountOut.textContent = String(n);
      if (animate && !motionOff) {
        guestCountOut.classList.remove("bump");
        void guestCountOut.offsetWidth;
        guestCountOut.classList.add("bump");
      }
    }
    if (guestMinus) guestMinus.disabled = n <= 0;
    if (guestPlus) guestPlus.disabled = n >= MAX_COMPANIONS;
    if (navigator.vibrate && animate) navigator.vibrate(8);
  };
  setCompanions(0, false);
  guestMinus?.addEventListener("click", () => setCompanions(Number(guestCountInput.value) - 1));
  guestPlus?.addEventListener("click", () => setCompanions(Number(guestCountInput.value) + 1));

  const syncCompanions = () => {
    const attending = getAttendance() === "Sí asistiré";
    companionsField?.classList.toggle("is-off", !attending);
    if (!attending) setCompanions(0, false);
    const n = Number(guestCountInput?.value || 0);
    if (guestMinus) guestMinus.disabled = !attending || n <= 0;
    if (guestPlus) guestPlus.disabled = !attending || n >= MAX_COMPANIONS;
  };
  form?.querySelectorAll('input[name="attendance"]').forEach((radio) => radio.addEventListener("change", syncCompanions));

  if (!whatsappReady) {
    if (rsvpButton) {
      rsvpButton.disabled = true;
      rsvpButton.title = "La confirmación estará disponible próximamente";
    }
    if (rsvpNote) rsvpNote.textContent = "La confirmación estará disponible próximamente.";
    form?.addEventListener("submit", (event) => event.preventDefault());
  } else {
    if (rsvpNote) rsvpNote.textContent = "Al enviar, se abrirá WhatsApp con tu mensaje listo.";
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = ($("#guestName")?.value || "").trim();
      if (!name) { $("#guestName")?.focus(); return; }
      const status = getAttendance();
      const companions = Number(guestCountInput?.value || 0);
      const note = ($("#guestMessage")?.value || "").trim();
      const lines = [
        `Hola, somos ${name}.`,
        `Confirmación de asistencia a la boda de ${couple}: ${status}.`,
        status === "Sí asistiré" ? `Acompañantes: ${companions}.` : "",
        note ? `Mensaje: ${note}` : ""
      ].filter(Boolean);
      const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");

      // Agradecimiento: chispas doradas y mensaje.
      form.classList.add("is-sent");
      window.setTimeout(() => form.classList.remove("is-sent"), 1100);
      if (rsvpButton) {
        const r = rsvpButton.getBoundingClientRect();
        burstParticles(r.left + r.width / 2, r.top + r.height / 2, 28);
      }
      if (rsvpNote) rsvpNote.textContent = status === "Sí asistiré"
        ? "¡Gracias! Se abrió WhatsApp con tu confirmación. Si no se abrió, intenta de nuevo."
        : "Gracias por avisarnos. Se abrió WhatsApp con tu mensaje.";
    });
  }

  /* ---------- Reproductor vintage ---------- */

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

  const playlist = Array.isArray(config.musicPlaylist)
    ? config.musicPlaylist.filter((track) => track && track.src)
    : [];

  const icons = {
    play: '<path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 6h3v12H8zM14 6h3v12h-3z" fill="currentColor" stroke="none"/>',
    volume: '<path d="M4 10v4h4l5 4V6l-5 4H4z"/><path d="M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11"/>',
    mute: '<path d="M4 10v4h4l5 4V6l-5 4H4z"/><path d="m17 9 5 6m0-6-5 6"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || ""}</svg>`;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (audio && player && playlist.length) {
    let currentTrack = 0;
    let isSeeking = false;

    player.hidden = false;
    if (toggle) toggle.hidden = false;
    audio.volume = Number(volume ? volume.value : 0.55);

    const updatePlayer = () => {
      const playing = !audio.paused;
      if (playPause) {
        playPause.innerHTML = icon(playing ? "pause" : "play");
        playPause.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
        playPause.title = playing ? "Pausar" : "Reproducir";
      }
      if (muteButton) {
        const silent = audio.muted || audio.volume === 0;
        muteButton.innerHTML = icon(silent ? "mute" : "volume");
        muteButton.setAttribute("aria-label", silent ? "Activar sonido" : "Silenciar música");
        muteButton.title = silent ? "Activar sonido" : "Silenciar";
      }
      vinyl?.classList.toggle("is-spinning", playing && !motionOff);
      player.classList.toggle("is-playing", playing);
      toggle?.classList.toggle("is-playing", playing && !motionOff);
    };

    const updateProgress = () => {
      const duration = audio.duration;
      const current = audio.currentTime || 0;
      if (currentTimeLabel) currentTimeLabel.textContent = formatTime(current);
      if (durationLabel) durationLabel.textContent = formatTime(duration);
      if (progress && !isSeeking) {
        const pct = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;
        progress.value = String(pct);
        progress.style.setProperty("--progress", `${pct}%`);
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
        if (!audio.getAttribute("src")) loadTrack(currentTrack);
        await audio.play();
      } catch (error) {
        // El navegador puede bloquear el audio: el botón manual sigue funcionando.
        console.warn("No se pudo iniciar la reproducción automática:", error && error.message ? error.message : error);
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
      if (Number.isFinite(duration) && duration > 0 && currentTimeLabel) {
        currentTimeLabel.textContent = formatTime((Number(progress.value) / 100) * duration);
      }
      progress.style.setProperty("--progress", `${progress.value}%`);
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
    audio.addEventListener("error", () => console.warn("No se pudo cargar el audio:", audio.getAttribute("src")));
    ["timeupdate", "loadedmetadata", "durationchange"].forEach((name) => audio.addEventListener(name, updateProgress));
    ["play", "pause", "volumechange"].forEach((name) => audio.addEventListener(name, updatePlayer));

    // Móvil: el panel se despliega y se oculta con el botón flotante.
    toggle?.addEventListener("click", () => {
      const expanded = player.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.setAttribute("aria-label", expanded ? "Ocultar reproductor" : "Mostrar reproductor");
      toggle.title = expanded ? "Ocultar reproductor" : "Mostrar reproductor";
    });

    loadTrack(0);
  }
})();