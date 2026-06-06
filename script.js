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

  const loopDurationMs = 80000;
  let loopWidth = 0;
  let isPaused = false;
  let resumeTimer = null;
  let lastFrameTime = performance.now();
  let rafId = null;

  function measureLoopWidth() {
    const loopStart = items[0];
    const loopRepeat = items[halfCount];
    if (!loopStart || !loopRepeat) return 0;
    return loopRepeat.offsetLeft - loopStart.offsetLeft;
  }

  function normalizeScroll() {
    if (loopWidth <= 0) return;
    while (shell.scrollLeft >= loopWidth) {
      shell.scrollLeft -= loopWidth;
    }
    while (shell.scrollLeft < 0) {
      shell.scrollLeft += loopWidth;
    }
  }

  function pauseAutoScroll() {
    isPaused = true;
    clearTimeout(resumeTimer);
  }

  function scheduleResume(delay = 450) {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isPaused = false;
      lastFrameTime = performance.now();
    }, delay);
  }

  function tick(now) {
    if (!isPaused && loopWidth > 0) {
      const delta = now - lastFrameTime;
      shell.scrollLeft += (loopWidth / loopDurationMs) * delta;
      normalizeScroll();
    }
    lastFrameTime = now;
    rafId = requestAnimationFrame(tick);
  }

  function refreshMarquee() {
    loopWidth = measureLoopWidth();
    normalizeScroll();
  }

  shell.addEventListener("touchstart", pauseAutoScroll, { passive: true });
  shell.addEventListener("touchmove", pauseAutoScroll, { passive: true });
  shell.addEventListener("touchend", () => scheduleResume(), { passive: true });
  shell.addEventListener("touchcancel", () => scheduleResume(), { passive: true });
  shell.addEventListener("pointerdown", pauseAutoScroll);
  shell.addEventListener("pointerup", () => scheduleResume());
  shell.addEventListener("pointercancel", () => scheduleResume());
  shell.addEventListener("scroll", normalizeScroll, { passive: true });

  if (window.matchMedia("(hover: hover)").matches) {
    shell.addEventListener("mouseenter", pauseAutoScroll);
    shell.addEventListener("mouseleave", () => {
      isPaused = false;
      lastFrameTime = performance.now();
    });
  }

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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPhotosMarquee);
} else {
  initPhotosMarquee();
}
