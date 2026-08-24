const WEDDING_CONFIG = {
    bride: "Thanh Hà",
    groom: "Hải Anh",
    weddingDate: "2026-09-12T12:00:00",
    lunarDate: "01 tháng 08 âm lịch",
    venue: "Khách sạn Vạn Phúc",
    address: "52 Miếu Đầm, Mễ Trì, Nam Từ Liêm, Hà Nội",
    mapUrl: "https://www.google.com/maps?q=52%20Mieu%20Dam%2C%20Me%20Tri%2C%20Nam%20Tu%20Liem%2C%20Ha%20Noi&output=embed",
    music: "./assets/music/wedding.mp3"
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
        $("#weddingMusic")?.load();
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

    for (let index = 0; index < 72; index += 1) {
        const particle = document.createElement("span");
        const side = index % 2 === 0 ? "left" : "right";

        particle.className = `particle particle-${side}`;
        particle.style.setProperty("--edge", `${2 + Math.random() * 44}px`);
        particle.style.setProperty("--size", `${7 + Math.random() * 12}px`);
        particle.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
        particle.style.setProperty("--drift", `${(side === "left" ? 1 : -1) * (4 + Math.random() * 20)}px`);
        particle.style.setProperty("--spin", `${-18 + Math.random() * 48}deg`);
        particle.style.setProperty("--opacity", `${0.34 + Math.random() * 0.32}`);
        particle.style.animationDelay = `${Math.random() * -12}s`;
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
let isMusicPlaying = false;
let musicUnlockBound = false;

function setMusicState(playing) {
    isMusicPlaying = playing;
    document.body.classList.toggle("is-music-playing", playing);
}

async function startMusic() {
    if (!audio) {
        return false;
    }

    audio.volume = 0.78;
    audio.muted = false;

    try {
        await audio.play();
        setMusicState(true);
        return true;
    } catch (error) {
        setMusicState(false);
        return false;
    }
}

function bindMusicUnlock() {
    if (musicUnlockBound) {
        return;
    }

    musicUnlockBound = true;
    const unlockEvents = ["pointerdown", "touchstart", "keydown", "scroll"];
    const unlockMusic = async () => {
        const played = await startMusic();

        if (played) {
            unlockEvents.forEach((eventName) => document.removeEventListener(eventName, unlockMusic));
        }
    };

    unlockEvents.forEach((eventName) => {
        document.addEventListener(eventName, unlockMusic, { passive: true });
    });
}

function setupMusic() {
    if (!audio) {
        return;
    }

    audio.volume = 0.78;
    audio.addEventListener("playing", () => setMusicState(true));
    audio.addEventListener("pause", () => setMusicState(false));

    startMusic();
    bindMusicUnlock();

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && !isMusicPlaying) {
            startMusic();
        }
    });
}

function setupOpening() {
    const opening = $("#openingScreen");

    if (!opening) {
        return;
    }

    const openInvitation = () => {
        if (opening.classList.contains("is-open")) {
            return;
        }

        opening.classList.add("is-open");
        startMusic();
        window.setTimeout(() => opening.remove(), reducedMotion.matches ? 80 : 1900);
    };

    opening.addEventListener("click", openInvitation);
    opening.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
        }
    });

    window.setTimeout(openInvitation, reducedMotion.matches ? 60 : 850);
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
    setupMusic();
    setupOpening();
    setupReveal();
    setupCountdown();
    setupRsvpForm();
    setupLightbox();
});
