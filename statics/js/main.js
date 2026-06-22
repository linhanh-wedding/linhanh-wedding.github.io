/* =========================================================
   THIỆP CƯỚI · Hồng Lĩnh & Ngọc Ánh — main.js
   ========================================================= */

/* ⚠️⚠️  CHỈNH THÔNG TIN NGÀY CƯỚI Ở ĐÂY  ⚠️⚠️
   - date:  ngày cưới theo DƯƠNG LỊCH, định dạng "YYYY-MM-DD"
   - time:  giờ bắt đầu (dùng cho đếm ngược), định dạng "HH:MM"
   - lunar: ngày âm lịch hiển thị (để trống "" nếu không cần) */
const WEDDING_CONFIG = {
  date:  "2026-06-28",   // <-- THAY NGÀY CƯỚI THẬT VÀO ĐÂY
  time:  "10:00",
  lunar: ""              // ví dụ: "Tức ngày 13 tháng 10 năm Bính Ngọ"
};

document.addEventListener("DOMContentLoaded", () => {
  setupMusic();
  renderHeroDate();
  renderCalendar();
  startCountdown();
  setupGalleryLightbox();
  setupCopyButtons();
  setupReveal();
});

/* ---------- Ngày tháng tiện ích ---------- */
function getWeddingDate() {
  // Tạo Date từ config (giờ địa phương)
  const [y, m, d] = WEDDING_CONFIG.date.split("-").map(Number);
  const [hh, mm] = (WEDDING_CONFIG.time || "00:00").split(":").map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0, 0);
}

/* ---------- 1. NHẠC NỀN ---------- */
function setupMusic() {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music || !toggle) return;

  const play = () => {
    music.volume = 0.6;
    return music.play().then(() => {
      toggle.classList.add("is-playing");
    }).catch(() => {
      // Trình duyệt chặn autoplay — sẽ phát khi người dùng tương tác lần đầu
      toggle.classList.remove("is-playing");
    });
  };

  toggle.addEventListener("click", () => {
    if (music.paused) {
      play();
    } else {
      music.pause();
      toggle.classList.remove("is-playing");
    }
  });

  // Đồng bộ trạng thái icon khi nhạc dừng/chạy
  music.addEventListener("play", () => toggle.classList.add("is-playing"));
  music.addEventListener("pause", () => toggle.classList.remove("is-playing"));

  // Thử phát nhạc ngay khi vào web. Trình duyệt thường chặn autoplay
  // có tiếng, nên nếu bị chặn thì nhạc sẽ tự phát ở lần tương tác đầu
  // tiên (chạm/bấm/gõ phím/cuộn). Chỉ gỡ listener khi nhạc đã chạy thật.
  const wakeEvents = ["pointerdown", "touchend", "click", "keydown", "scroll"];
  const startOnInteract = () => {
    if (!music.paused) return;
    play().then(() => {
      if (!music.paused) {
        wakeEvents.forEach(ev => window.removeEventListener(ev, startOnInteract));
      }
    });
  };
  play();
  wakeEvents.forEach(ev =>
    window.addEventListener(ev, startOnInteract, { passive: true })
  );
}

/* ---------- 2. HIỂN THỊ NGÀY Ở HERO ---------- */
function renderHeroDate() {
  const el = document.getElementById("heroDate");
  if (!el) return;
  const wd = getWeddingDate();
  const days = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
  const dow = days[wd.getDay()];
  const dd = String(wd.getDate()).padStart(2, "0");
  const mo = String(wd.getMonth() + 1).padStart(2, "0");
  let txt = `${dow}, ngày ${dd} . ${mo} . ${wd.getFullYear()}`;
  if (WEDDING_CONFIG.lunar) txt += ` · ${WEDDING_CONFIG.lunar}`;
  el.textContent = txt;
}

/* ---------- 3. LỊCH THÁNG ---------- */
function renderCalendar() {
  const grid = document.getElementById("calGrid");
  const monthEl = document.getElementById("calMonth");
  if (!grid) return;

  const wd = getWeddingDate();
  const year = wd.getFullYear();
  const month = wd.getMonth();
  const weddingDay = wd.getDate();

  monthEl.textContent = `Tháng ${month + 1} năm ${year}`;

  const dows = ["T2","T3","T4","T5","T6","T7","CN"];
  grid.innerHTML = "";
  dows.forEach(d => {
    const c = document.createElement("div");
    c.className = "calendar__dow";
    c.textContent = d;
    grid.appendChild(c);
  });

  // Tuần bắt đầu từ Thứ Hai: chuyển 0=CN..6=T7 sang 0=T2..6=CN
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDow; i++) {
    const e = document.createElement("div");
    e.className = "calendar__day calendar__day--empty";
    grid.appendChild(e);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar__day";
    if (new Date(year, month, day).getDay() === 0) cell.classList.add("calendar__day--sun");
    if (day === weddingDay) cell.classList.add("calendar__day--wed");
    cell.textContent = day;
    grid.appendChild(cell);
  }
}

/* ---------- 4. ĐẾM NGƯỢC ---------- */
function startCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;
  const target = getWeddingDate().getTime();
  const set = (k, v) => {
    const el = root.querySelector(`[data-cd="${k}"]`);
    if (el) el.textContent = String(v).padStart(2, "0");
  };

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      set("days", 0); set("hours", 0); set("mins", 0); set("secs", 0);
      root.innerHTML = '<p style="font-family:Playfair Display,serif;color:#6e1023;font-size:1.2rem;">Hôm nay là ngày hạnh phúc của chúng tôi! ❤</p>';
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    set("days", Math.floor(s / 86400));
    set("hours", Math.floor((s % 86400) / 3600));
    set("mins", Math.floor((s % 3600) / 60));
    set("secs", s % 60);
  };
  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- 5. LIGHTBOX ALBUM ---------- */
function setupGalleryLightbox() {
  const gallery = document.getElementById("gallery");
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  if (!gallery || !lb) return;

  const imgs = Array.from(gallery.querySelectorAll("img"));
  let current = 0;

  // dir: 1 = ảnh kế tiếp (trượt từ phải), -1 = ảnh trước (trượt từ trái)
  const show = (i, dir = 1) => {
    current = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[current].src;
    lbImg.alt = imgs[current].alt;
    // chạy lại hiệu ứng trượt mỗi lần đổi ảnh
    lbImg.style.setProperty("--lb-from", (dir >= 0 ? 28 : -28) + "px");
    lbImg.style.animation = "none";
    void lbImg.offsetWidth;           // ép reflow để restart animation
    lbImg.style.animation = "";
  };
  const open = (i) => { show(i, 1); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); };
  const close = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };

  // Dùng event delegation trên cả khung gallery: click ở đâu trong 1 ảnh
  // cũng mở được, kể cả khi lớp phủ kính lúp che mất thẻ <img>.
  gallery.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery__item");
    if (!item || !gallery.contains(item)) return;
    const img = item.querySelector("img");
    const i = imgs.indexOf(img);
    if (i >= 0) open(i);
  });
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", (e) => { e.stopPropagation(); show(current - 1, -1); });
  document.getElementById("lbNext").addEventListener("click", (e) => { e.stopPropagation(); show(current + 1, 1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1, -1);
    if (e.key === "ArrowRight") show(current + 1, 1);
  });
}

/* ---------- 6. SAO CHÉP SỐ TÀI KHOẢN ---------- */
function setupCopyButtons() {
  document.querySelectorAll(".gift__copy").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
      }
      toast(`Đã sao chép số tài khoản: ${text}`);
    });
  });
}

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("is-show"), 2200);
}

/* ---------- 7. HIỆU ỨNG XUẤT HIỆN KHI CUỘN ---------- */
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}
