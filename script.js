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
