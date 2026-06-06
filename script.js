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
  const track = document.querySelector(".demo-blank-photos-track");
  if (!track) return;

  const items = [...track.children];
  if (items.length === 0) return;

  const halfCount = Math.floor(items.length / 2);
  if (halfCount === 0) return;

  function setMarqueeOffset() {
    const loopStart = items[0];
    const loopRepeat = items[halfCount];
    if (!loopStart || !loopRepeat) return;

    const offset = loopRepeat.offsetLeft - loopStart.offsetLeft;
    if (offset > 0) {
      track.style.setProperty("--marquee-offset", `-${offset}px`);
    }
  }

  function refreshMarquee() {
    setMarqueeOffset();
    track.style.animation = "none";
    void track.offsetWidth;
    track.style.animation = "";
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
  window.addEventListener("resize", setMarqueeOffset);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPhotosMarquee);
} else {
  initPhotosMarquee();
}
