const WEDDING_CONFIG = {
    bride: "Thanh Hà",
    groom: "Hải Anh",
    weddingDate: "2026-09-12T12:00:00",
    lunarDate: "01 tháng 08 âm lịch",
    venue: "Khách sạn Vạn Phúc",
    address: "52 Miếu Đầm, Mễ Trì, Nam Từ Liêm, Hà Nội",
    mapUrl: "https://www.google.com/maps?q=52%20Mieu%20Dam%2C%20Me%20Tri%2C%20Nam%20Tu%20Liem%2C%20Ha%20Noi&output=embed",
    music: "./assets/music/Váy Cưới.mp3"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const weddingDate = new Date(WEDDING_CONFIG.weddingDate);
const defaultGuestName = "bạn đến dự";

const params = new URLSearchParams(window.location.search);
const guestFromUrl = params.get("guest");
const guestName = guestFromUrl && guestFromUrl.trim()
    ? guestFromUrl.trim().slice(0, 80)
    : defaultGuestName;

if (document.fonts) {
    document.fonts.load('1em "Great Vibes"')
        .then((fonts) => {
            if (fonts.length > 0) {
                document.body.classList.add("has-script-font");
            }
        })
        .catch(() => {});
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function getDateParts(date) {
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = String(date.getFullYear());
    const weekday = new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(date);
    const weekdayText = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return {
        day,
        month,
        year,
        weekday: weekdayText,
        slash: `${day}/${month}/${year}`,
        dotted: `${day}.${month}.${year}`,
        calendar: `${Number(month)}.${year}`,
        longDate: `${Number(day)} tháng ${month} năm ${year}`,
        time: `${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${pad(date.getMinutes())}${date.getHours() >= 12 ? "PM" : "AM"}`
    };
}

function applyConfig() {
    const parts = getDateParts(weddingDate);

    setText("heroDate", parts.slash);
    setText("groomName", WEDDING_CONFIG.groom);
    setText("brideName", WEDDING_CONFIG.bride);
    setText("eventGroom", WEDDING_CONFIG.groom);
    setText("eventBride", WEDDING_CONFIG.bride);
    setText("eventWeekday", parts.weekday);
    setText("eventDateText", parts.longDate);
    setText("eventTime", parts.time);
    setText("lunarDate", WEDDING_CONFIG.lunarDate);
    setText("venueName", WEDDING_CONFIG.venue);
    setText("venueAddress", WEDDING_CONFIG.address);
    setText("mapAddress", WEDDING_CONFIG.address);
    setText("dateDay", parts.day);
    setText("dateMonth", parts.month);
    setText("calendarTitle", parts.calendar);

    const mapFrame = $("#mapFrame");
    if (mapFrame) {
        mapFrame.src = WEDDING_CONFIG.mapUrl;
    }

    const audioSource = $("#weddingMusic source");
    if (audioSource) {
        audioSource.src = WEDDING_CONFIG.music;
    }
}

function createCalendar() {
    const calendar = $("#calendarDays");
    if (!calendar) {
        return;
    }

    calendar.textContent = "";

    const year = weddingDate.getFullYear();
    const month = weddingDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let index = 0; index < firstDayOffset; index += 1) {
        calendar.appendChild(document.createElement("span"));
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const dayElement = document.createElement("span");
        dayElement.textContent = String(day);
        if (day === weddingDate.getDate()) {
            dayElement.classList.add("is-wedding-day");
            dayElement.setAttribute("aria-label", `Ngày cưới ${day}`);
        }
        calendar.appendChild(dayElement);
    }
}

function createParticles() {
    if (reducedMotion.matches) {
        return;
    }

    const container = $("#ambientHearts");
    if (!container) {
        return;
    }

    for (let index = 0; index < 12; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.setProperty("--left", `${8 + Math.random() * 84}%`);
        particle.style.setProperty("--duration", `${12 + Math.random() * 10}s`);
        particle.style.setProperty("--drift", `${Math.random() > 0.5 ? "" : "-"}${18 + Math.random() * 50}px`);
        particle.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

function setupReveal() {
    const revealElements = $$(".reveal");

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${(index % 4) * 80}ms`;
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -7% 0px"
    });

    revealElements.forEach((element) => observer.observe(element));
}

function setupCountdown() {
    const countdown = $("#countdown");
    const passed = $("#weddingPassed");

    function updateCountdown() {
        const diff = weddingDate.getTime() - Date.now();

        if (diff <= 0) {
            setText("countDays", "0");
            setText("countHours", "0");
            setText("countMinutes", "0");
            setText("countSeconds", "0");
            if (passed) {
                passed.hidden = false;
            }
            return;
        }

        const seconds = Math.floor(diff / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        setText("countDays", String(days));
        setText("countHours", String(hours));
        setText("countMinutes", String(minutes));
        setText("countSeconds", String(remainingSeconds));
    }

    if (!countdown) {
        return;
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
}

const audio = $("#weddingMusic");
const musicToggle = $("#musicToggle");
const musicIcon = $("#musicIcon");
let isMusicPlaying = false;
let synthContext = null;
let synthTimer = null;

function setMusicState(playing) {
    isMusicPlaying = playing;
    if (musicToggle) {
        musicToggle.classList.toggle("is-playing", playing);
        musicToggle.setAttribute("aria-pressed", String(playing));
    }
    if (musicIcon) {
        musicIcon.textContent = playing ? "♫" : "♪";
    }
}

function playSoftTone(frequency, startDelay, duration) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return;
    }
    if (!synthContext) {
        synthContext = new AudioContextClass();
    }

    const oscillator = synthContext.createOscillator();
    const gain = synthContext.createGain();
    const startTime = synthContext.currentTime + startDelay;
    const endTime = startTime + duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.026, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gain);
    gain.connect(synthContext.destination);
    oscillator.start(startTime);
    oscillator.stop(endTime + 0.05);
}

function playSynthPhrase() {
    [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => playSoftTone(note, index * 0.18, 1.1));
}

function startSynthFallback() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        setMusicState(false);
        return;
    }
    if (!synthContext) {
        synthContext = new AudioContextClass();
    }
    if (synthContext.state === "suspended") {
        synthContext.resume();
    }
    if (!synthTimer) {
        playSynthPhrase();
        synthTimer = window.setInterval(playSynthPhrase, 4200);
    }
}

function stopSynthFallback() {
    if (synthTimer) {
        window.clearInterval(synthTimer);
        synthTimer = null;
    }
}

function isPlaceholderAudio() {
    return audio && Number.isFinite(audio.duration) && audio.duration > 0 && audio.duration < 0.5;
}

async function startMusic() {
    setMusicState(true);

    try {
        if (audio) {
            await audio.play();
            window.setTimeout(() => {
                if (isMusicPlaying && isPlaceholderAudio()) {
                    audio.pause();
                    startSynthFallback();
                }
            }, 300);
        } else {
            startSynthFallback();
        }
    } catch (error) {
        startSynthFallback();
    }
}

function pauseMusic() {
    if (audio) {
        audio.pause();
    }
    stopSynthFallback();
    setMusicState(false);
}

function setupMusic() {
    if (!musicToggle) {
        return;
    }

    if (audio) {
        audio.addEventListener("loadedmetadata", () => {
            if (isMusicPlaying && isPlaceholderAudio()) {
                audio.pause();
                startSynthFallback();
            }
        });
    }

    musicToggle.addEventListener("click", () => {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            startMusic();
        }
    });
}

function createBurstHeart(x, y, index) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 9;
    const distance = 48 + Math.random() * 62;

    heart.className = "burst-heart";
    heart.style.setProperty("--start-x", `${x}px`);
    heart.style.setProperty("--start-y", `${y}px`);
    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance - 46}px`);
    document.body.appendChild(heart);

    window.setTimeout(() => heart.remove(), 1800);
}

function fireHeartBurst(x, y) {
    if (reducedMotion.matches) {
        return;
    }
    for (let index = 0; index < 9; index += 1) {
        createBurstHeart(x, y, index);
    }
}

function setupHeartBurst() {
    const buttons = [$("#heartBurstButton"), $("#dockHeartButton")].filter(Boolean);

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const rect = button.getBoundingClientRect();
            fireHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    });
}

let toastTimer = null;

function showToast(message) {
    const toast = $("#toast");
    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setupRsvpForm() {
    const form = $("#rsvpForm");
    const input = $("#rsvpName");
    if (!form || !input) {
        return;
    }

    if (guestName !== defaultGuestName) {
        input.value = guestName;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const payload = {
            name: String(formData.get("name") || "").trim(),
            attending: formData.get("attending") === "yes",
            submittedAt: new Date().toISOString()
        };

        window.localStorage.setItem("wedding:rsvp", JSON.stringify(payload));
        showToast(payload.attending ? "Cảm ơn bạn, hẹn gặp trong ngày vui!" : "Đã lưu phản hồi của bạn.");
    });
}

function setupWishForm() {
    const form = $("#wishForm");
    const input = $("#wishInput");
    const popups = $("#wishPopups");

    if (!form || !input || !popups) {
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = input.value.trim();
        if (!message) {
            showToast("Bạn hãy nhập lời chúc trước nhé");
            return;
        }

        const saved = JSON.parse(window.localStorage.getItem("wedding:wishes") || "[]");
        saved.push({ name: guestName === defaultGuestName ? "Bạn" : guestName, message, at: new Date().toISOString() });
        window.localStorage.setItem("wedding:wishes", JSON.stringify(saved.slice(-20)));

        const bubble = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${guestName === defaultGuestName ? "Bạn" : guestName}:`;
        bubble.append(strong, ` ${message}`);
        popups.appendChild(bubble);

        while (popups.children.length > 5) {
            popups.firstElementChild.remove();
        }

        input.value = "";
        showToast("Đã gửi lời chúc");
        fireHeartBurst(window.innerWidth / 2, window.innerHeight - 86);
    });
}

function setupLightbox() {
    const items = $$(".gallery-item");
    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightboxImage");
    const closeButton = $("#lightboxClose");
    const prevButton = $("#lightboxPrev");
    const nextButton = $("#lightboxNext");
    let activeIndex = 0;

    if (!items.length || !lightbox || !lightboxImage) {
        return;
    }

    const sources = items.map((item) => ({
        src: item.dataset.full,
        alt: $("img", item)?.alt || "Ảnh cưới"
    }));

    function renderImage() {
        const image = sources[activeIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
    }

    function openLightbox(index) {
        activeIndex = index;
        renderImage();
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-lightbox-open");
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-lightbox-open");
    }

    function showPrev() {
        activeIndex = (activeIndex - 1 + sources.length) % sources.length;
        renderImage();
    }

    function showNext() {
        activeIndex = (activeIndex + 1) % sources.length;
        renderImage();
    }

    items.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
    closeButton?.addEventListener("click", closeLightbox);
    prevButton?.addEventListener("click", showPrev);
    nextButton?.addEventListener("click", showNext);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) {
            return;
        }
        if (event.key === "Escape") {
            closeLightbox();
        }
        if (event.key === "ArrowLeft") {
            showPrev();
        }
        if (event.key === "ArrowRight") {
            showNext();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    createCalendar();
    createParticles();
    setupReveal();
    setupCountdown();
    setupMusic();
    setupHeartBurst();
    setupRsvpForm();
    setupWishForm();
    setupLightbox();
});
