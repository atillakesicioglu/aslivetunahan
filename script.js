const weddingDate = new Date("2026-07-25T17:00:00+03:00");

function pad2(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = Math.max(0, weddingDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const values = {
    days: String(days),
    hours: pad2(hours),
    minutes: pad2(minutes),
    seconds: pad2(seconds),
  };

  document.querySelectorAll(".demo-blank-countdown-value").forEach((el) => {
    const unit = el.dataset.unit;
    if (unit && values[unit] !== undefined) {
      el.textContent = values[unit];
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

function initPhotosMarquee() {
  const shell = document.querySelector(".demo-blank-photos-shell");
  const track = document.querySelector(".demo-blank-photos-track");
  if (!shell || !track) return;

  const items = [...track.children];
  if (items.length === 0) return;

  const halfCount = Math.floor(items.length / 2);
  if (halfCount === 0) return;

  const loopDurationMs = 85000;
  let loopWidth = 0;
  let offset = 0;
  let isDragging = false;
  let resumeTimer = null;
  let lastFrameTime = performance.now();
  let rafId = null;
  let dragStartX = 0;
  let dragStartOffset = 0;

  function measureLoopWidth() {
    const loopStart = items[0];
    const loopRepeat = items[halfCount];
    if (!loopStart || !loopRepeat) return 0;
    return loopRepeat.offsetLeft - loopStart.offsetLeft;
  }

  function normalizeOffset() {
    if (loopWidth <= 0) return;
    while (offset >= loopWidth) offset -= loopWidth;
    while (offset < 0) offset += loopWidth;
  }

  function applyOffset() {
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  function pauseAutoScroll() {
    clearTimeout(resumeTimer);
  }

  function scheduleResume(delay = 400) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isDragging = false;
      shell.classList.remove("is-dragging");
      lastFrameTime = performance.now();
    }, delay);
  }

  function startDrag(clientX) {
    isDragging = true;
    shell.classList.add("is-dragging");
    dragStartX = clientX;
    dragStartOffset = offset;
    pauseAutoScroll();
  }

  function moveDrag(clientX) {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    offset = dragStartOffset - delta;
    normalizeOffset();
    applyOffset();
  }

  function endDrag() {
    if (!isDragging) return;
    scheduleResume();
  }

  function tick(now) {
    if (!isDragging && loopWidth > 0) {
      const delta = now - lastFrameTime;
      offset += (loopWidth / loopDurationMs) * delta;
      normalizeOffset();
      applyOffset();
    }
    lastFrameTime = now;
    rafId = requestAnimationFrame(tick);
  }

  function refreshMarquee() {
    loopWidth = measureLoopWidth();
    normalizeOffset();
    applyOffset();
  }

  shell.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;
      startDrag(event.touches[0].clientX);
    },
    { passive: true }
  );

  shell.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 1) return;
      moveDrag(event.touches[0].clientX);
    },
    { passive: true }
  );

  shell.addEventListener("touchend", endDrag, { passive: true });
  shell.addEventListener("touchcancel", endDrag, { passive: true });

  shell.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    startDrag(event.clientX);
  });

  window.addEventListener("mousemove", (event) => {
    moveDrag(event.clientX);
  });

  window.addEventListener("mouseup", endDrag);

  const images = track.querySelectorAll("img");
  let pendingImages = 0;

  images.forEach((img) => {
    if (img.complete) return;
    pendingImages += 1;
    img.addEventListener("load", () => {
      pendingImages -= 1;
      if (pendingImages === 0) refreshMarquee();
    });
  });

  refreshMarquee();
  window.addEventListener("resize", refreshMarquee);
  rafId = requestAnimationFrame(tick);

  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(resumeTimer);
  });
}

function initRsvpForm() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function initIntro() {
  const overlay = document.getElementById("introOverlay");
  const video = document.getElementById("envelopeVideo");
  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  if (!overlay || !video || !music) {
    return;
  }

  video.autoplay = false;
  video.pause();
  video.currentTime = 0;
  music.pause();

  const fadeStartSec = 2;
  const fadeEndSec = 3;

  let started = false;
  let finished = false;
  let fadeStarted = false;

  function lockScroll() {
    document.documentElement.classList.add("intro-lock");
    document.body.classList.add("intro-lock");
  }

  function unlockScroll() {
    document.documentElement.classList.remove("intro-lock");
    document.body.classList.remove("intro-lock");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    window.scrollTo(0, 0);
  }

  function finishIntro() {
    if (finished) {
      return;
    }

    finished = true;
    overlay.classList.add("is-hidden");
    unlockScroll();

    if (musicToggle) {
      musicToggle.hidden = false;
    }

    window.setTimeout(() => {
      overlay.remove();
    }, 700);
  }

  async function startIntro() {
    if (started) {
      return;
    }

    started = true;
    fadeStarted = false;
    video.classList.remove("is-fading-out");
    overlay.classList.remove("is-video-visible");
    overlay.classList.add("is-playing");
    video.currentTime = 0;

    const revealVideo = () => {
      if (!overlay.classList.contains("is-video-visible")) {
        overlay.classList.add("is-video-visible");
      }
    };

    video.addEventListener("playing", revealVideo, { once: true });

    try {
      await video.play();
    } catch {
      finishIntro();
      return;
    }

    if (video.readyState >= 2) {
      revealVideo();
    }

    try {
      music.currentTime = 0;
      await music.play();
    } catch {
      // Mobil tarayıcılar bazen ikinci play çağrısını reddedebilir.
    }
  }

  lockScroll();

  overlay.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    startIntro();
  });

  video.addEventListener("timeupdate", () => {
    if (!started || finished) {
      return;
    }

    if (video.currentTime >= fadeStartSec && !fadeStarted) {
      fadeStarted = true;
      video.classList.add("is-fading-out");
    }

    if (video.currentTime >= fadeEndSec) {
      video.pause();
      finishIntro();
    }
  });

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(() => {});
        musicToggle.classList.remove("is-muted");
        musicToggle.setAttribute("aria-label", "Müziği kapat");
      } else {
        music.pause();
        musicToggle.classList.add("is-muted");
        musicToggle.setAttribute("aria-label", "Müziği aç");
      }
    });
  }
}

function initPage() {
  initIntro();
  initPhotosMarquee();
  initRsvpForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
