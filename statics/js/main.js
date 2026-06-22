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

/* ⚠️  DANH SÁCH ẢNH CƯỚI  ⚠️
   Tất cả ảnh nằm trong thư mục statics/images/anh-cuoi/.
   Thêm/bớt ảnh thì chỉ cần sửa danh sách tên file dưới đây.
   Ảnh sẽ được hiển thị theo THỨ TỰ NGẪU NHIÊN mỗi lần tải trang. */
const PHOTO_DIR = "statics/images/anh-cuoi/";
// thứ tự ngẫu nhiên của TẤT CẢ ảnh (dùng chung cho lightbox để lướt đủ bộ)
let PHOTO_LIST = [];
const PHOTOS = [
  "anh-cuoi-1.jpg",  "anh-cuoi-2.jpg",  "anh-cuoi-3.jpg",  "anh-cuoi-4.jpg",
  "anh-cuoi-5.jpg",  "anh-cuoi-6.jpg",  "anh-cuoi-7.jpg",  "anh-cuoi-8.jpg",
  "anh-cuoi-9.jpg",  "anh-cuoi-10.jpg", "anh-cuoi-11.jpg", "anh-cuoi-12.jpg",
  "anh-cuoi-13.jpg", "anh-cuoi-14.jpg", "anh-cuoi-15.jpg", "anh-cuoi-16.jpg",
  "anh-cuoi-17.jpg", "anh-cuoi-18.jpg", "anh-cuoi-19.jpg", "anh-cuoi-20.jpg",
  "anh-cuoi-21.jpg"
];

/* 🌿 HÀNH TRÌNH — 10 ảnh ghim hai bên (bản web), theo thứ tự timeline 01→10.
   Lẻ (01,03,05,07,09) bên trái · Chẵn (02,04,06,08,10) bên phải. */
const JOURNEY_DIR = "statics/images/hanh-trinh/";
const JOURNEY = [
  "hanhtrinh-01.jpg", "hanhtrinh-02.jpg", "hanhtrinh-03.jpg", "hanhtrinh-04.jpg",
  "hanhtrinh-05.jpg", "hanhtrinh-06.jpg", "hanhtrinh-07.jpg", "hanhtrinh-08.jpg",
  "hanhtrinh-09.jpg", "hanhtrinh-10.jpg"
];
let JOURNEY_LIST = [];   // src đầy đủ theo thứ tự timeline, dùng cho lightbox

document.addEventListener("DOMContentLoaded", () => {
  setupMusic();
  setupNav();
  renderPhotos();
  setupGalleryPager();
  setupJourneyCord();
  renderHeroDate();
  renderCalendar();
  startCountdown();
  setupGalleryLightbox();
  setupGiftEnvelope();
  setupCopyButtons();
  setupReveal();
});

/* ---------- ĐỔ ẢNH CƯỚI (NGẪU NHIÊN) VÀO ALBUM & GHIM HAI BÊN ---------- */
function renderPhotos() {
  // trộn ngẫu nhiên (Fisher–Yates)
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const list = shuffle(PHOTOS);
  PHOTO_LIST = list.map((f) => PHOTO_DIR + f);   // dùng cho lightbox lướt đủ bộ

  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.innerHTML = list.map((f, i) =>
      `<figure class="gallery__item"><img class="js-photo" data-group="album" loading="lazy" src="${PHOTO_DIR}${f}" alt="Ảnh cưới ${i + 1}" /></figure>`
    ).join("");
  }

  // Ghim hai bên: HÀNH TRÌNH theo timeline (cố định, không ngẫu nhiên).
  JOURNEY_LIST = JOURNEY.map((f) => JOURNEY_DIR + f);
  const pins = document.getElementById("photoPins");
  if (pins) {
    const RAILS = {
      l: { tops: [4, 24, 44, 64, 84],  rots: [-6, 4, -4, 5, -4] },
      r: { tops: [14, 34, 54, 74, 90], rots: [5, -7, 6, -5, 4] }
    };
    const durs   = [7.5, 8.2, 6.8, 7.9, 7.2, 8.5, 6.6, 8.0, 7.4, 7.7];
    const delays = [-0.5, -2.0, -1.2, -3.1, -0.8, -2.6, -1.7, -3.6, -1.0, -2.3];

    // lẻ → trái, chẵn → phải, giữ đúng thứ tự 01..10
    const leftJ  = JOURNEY.filter((_, i) => i % 2 === 0);  // 01,03,05,07,09
    const rightJ = JOURNEY.filter((_, i) => i % 2 === 1);  // 02,04,06,08,10

    let di = 0;
    const buildRail = (side, photos) => {
      const { tops, rots } = RAILS[side];
      const n = Math.min(photos.length, tops.length);

      let figs = "";
      for (let i = 0; i < n; i++) {
        const num = JOURNEY.indexOf(photos[i]) + 1;   // số thứ tự timeline 1..10
        figs += `<figure class="pin" data-seq="${num}" style="--rot:${rots[i]}deg; --dur:${durs[di % durs.length]}s; --delay:${delays[di % delays.length]}s; top:${tops[i]}%">` +
                `<img class="js-photo" data-group="journey" loading="lazy" src="${JOURNEY_DIR}${photos[i]}" alt="Hành trình ${num}" /></figure>`;
        di++;
      }
      return `<div class="pin-rail pin-rail--${side}">${figs}</div>`;
    };

    pins.innerHTML = buildRail("l", leftJ) + buildRail("r", rightJ);
  }
}

/* ---------- 4c. SỢI DÂY HÀNH TRÌNH (nối 01→10, trái↔phải liên tiếp) ---------- */
// Vẽ một sợi dây duy nhất đi qua 10 ảnh theo đúng thứ tự timeline. Đoạn vắt
// qua giữa nằm SAU cột nội dung (z-index thấp hơn .invite) nên không đè lên
// phần trung tâm — chỉ hiện ở khoảng trống hai bên.
function setupJourneyCord() {
  const pins = document.getElementById("photoPins");
  if (!pins) return;
  window.addEventListener("load", redrawJourneyCord);
  let t;
  window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(redrawJourneyCord, 150); });
  redrawJourneyCord();
}

function redrawJourneyCord() {
  const pins = document.getElementById("photoPins");
  if (!pins) return;

  let svg = pins.querySelector("#journeyCord");
  if (getComputedStyle(pins).display === "none") { if (svg) svg.remove(); return; }

  const figs = Array.from(pins.querySelectorAll(".pin"))
    .sort((a, b) => (+a.dataset.seq) - (+b.dataset.seq));
  if (figs.length < 2) return;

  // điểm neo = nút thắt (giữa, sát mép trên) của từng ảnh, tính theo px
  const knots = figs.map((f) => {
    const rail = f.parentElement;
    return {
      x: rail.offsetLeft + f.offsetLeft + f.offsetWidth / 2,
      y: rail.offsetTop + f.offsetTop + 4
    };
  });

  // điểm ghim bắt đầu: phía trên ảnh 01, sợi dây buông xuống từ đây
  const start = { x: knots[0].x, y: Math.max(6, knots[0].y - 70) };
  const pts = [start, ...knots];

  // đường cong Catmull–Rom (mềm mại, lượn qua đúng các điểm neo)
  const f = (v) => v.toFixed(1);
  const T = 0.22;   // độ "mềm" của đường cong — lớn hơn = cong mượt hơn
  let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || pts[i + 1];
    const c1x = p1.x + (p2.x - p0.x) * T;
    const c1y = p1.y + (p2.y - p0.y) * T;
    const c2x = p2.x - (p3.x - p1.x) * T;
    const c2y = p2.y - (p3.y - p1.y) * T;
    d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
  }

  const NS = "http://www.w3.org/2000/svg";
  if (!svg) {
    svg = document.createElementNS(NS, "svg");
    svg.id = "journeyCord";
    svg.setAttribute("class", "journey-cord");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.appendChild(document.createElementNS(NS, "path"));
    // ghim đầu dây: vòng ngoài + đầu ghim + điểm sáng
    ["cord-pin__ring", "cord-pin__head", "cord-pin__shine"].forEach((cls) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("class", cls);
      svg.appendChild(c);
    });
    pins.insertBefore(svg, pins.firstChild);   // sau ảnh (z-index thấp hơn)
  }
  svg.setAttribute("viewBox", `0 0 ${pins.offsetWidth} ${pins.offsetHeight}`);
  svg.querySelector("path").setAttribute("d", d);

  const setCircle = (sel, cx, cy, r) => {
    const c = svg.querySelector(sel);
    c.setAttribute("cx", f(cx)); c.setAttribute("cy", f(cy)); c.setAttribute("r", r);
  };
  setCircle(".cord-pin__ring", start.x, start.y, 9);
  setCircle(".cord-pin__head", start.x, start.y, 6);
  setCircle(".cord-pin__shine", start.x - 2, start.y - 2.4, 1.8);
}

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

/* ---------- 4b. PHÂN TRANG ALBUM (9 ảnh / trang) ---------- */
function setupGalleryPager() {
  const gallery = document.getElementById("gallery");
  const pager = document.getElementById("galleryPager");
  if (!gallery || !pager) return;

  const items = Array.from(gallery.children);
  const PER = 9;
  const pages = Math.ceil(items.length / PER);

  if (pages <= 1) { pager.hidden = true; return; }
  pager.hidden = false;

  const prev = document.getElementById("galPrev");
  const next = document.getElementById("galNext");
  const info = document.getElementById("galInfo");
  let page = 0;

  const render = () => {
    items.forEach((el, i) => {
      el.style.display = (Math.floor(i / PER) === page) ? "" : "none";
    });
    info.textContent = `${page + 1} / ${pages}`;
    prev.disabled = page === 0;
    next.disabled = page === pages - 1;
    redrawJourneyCord();   // đổi trang làm thay đổi chiều cao trang → vẽ lại dây
  };

  prev.addEventListener("click", () => { if (page > 0) { page--; render(); } });
  next.addEventListener("click", () => { if (page < pages - 1) { page++; render(); } });
  render();
}

/* ---------- 5. LIGHTBOX ẢNH CƯỚI ---------- */
// Album (anh-cuoi) lướt qua cả bộ ảnh cưới; ảnh ghim hai bên (hành trình)
// lướt qua 10 ảnh hành trình theo đúng thứ tự timeline.
function setupGalleryLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  if (!lb || !lbImg) return;

  let activeList = PHOTO_LIST;
  let current = 0;

  // dir: 1 = ảnh kế tiếp (trượt từ phải), -1 = ảnh trước (trượt từ trái)
  const show = (i, dir = 1) => {
    const total = activeList.length;
    if (!total) return;
    current = (i + total) % total;
    lbImg.src = activeList[current];
    lbImg.alt = (activeList === JOURNEY_LIST ? "Hành trình " : "Ảnh cưới ") + (current + 1);
    // chạy lại hiệu ứng trượt mỗi lần đổi ảnh
    lbImg.style.setProperty("--lb-from", (dir >= 0 ? 28 : -28) + "px");
    lbImg.style.animation = "none";
    void lbImg.offsetWidth;           // ép reflow để restart animation
    lbImg.style.animation = "";
  };
  const open = (imgEl) => {
    activeList = imgEl.dataset.group === "journey" ? JOURNEY_LIST : PHOTO_LIST;
    const src = imgEl.getAttribute("src");
    const i = activeList.indexOf(src);
    if (i < 0) return;
    show(i, 1);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
  };
  const close = () => { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); };

  // Event delegation: chỉ ảnh Album mới mở phóng to; ảnh hành trình (ghim
  // hai bên) đã tắt tính năng click-zoom theo yêu cầu.
  document.addEventListener("click", (e) => {
    const im = e.target.closest("img.js-photo");
    if (im && im.dataset.group !== "journey") { open(im); return; }
    const tile = e.target.closest(".gallery__item");
    if (tile) {
      const img = tile.querySelector("img.js-photo");
      if (img) open(img);
    }
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

/* ---------- 5c. NAVIGATION BAR ---------- */
function setupNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 60);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu thu gọn (hamburger) cho mobile
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  // chạm vào 1 mục thì đóng menu lại
  links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
}

/* ---------- 5b. MỞ PHONG BAO (MODAL QR) ---------- */
function setupGiftEnvelope() {
  const envelope = document.getElementById("giftEnvelope");
  const modal = document.getElementById("giftModal");
  if (!envelope || !modal) return;
  const closeBtn = document.getElementById("giftModalClose");

  const open = () => { modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); };
  const close = () => { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); };

  envelope.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
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
