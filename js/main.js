const WEDDING_CONFIG = {
    bride: "Thanh Hà",
    groom: "Hải Anh",
    weddingDate: "2026-09-12T12:00:00",
    lunarDate: "01 tháng 08 âm lịch",
    venue: "Khách sạn Vạn Phúc",
    address: "Số 13 Vân La, Hồng Vân, Thường Tín, Hà Nội",
    mapUrl: "https://www.google.com/maps?q=S%E1%BB%91%2013%20V%C3%A2n%20La%2C%20H%E1%BB%93ng%20V%C3%A2n%2C%20Th%C6%B0%E1%BB%9Dng%20T%C3%ADn%2C%20H%C3%A0%20N%E1%BB%99i&output=embed",
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
    setText("dateYear", parts.year.slice(-2));
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

function renderCalendarDays(calendar, calendarDate) {
    calendar.textContent = "";

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstDayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let index = 0; index < firstDayOffset; index += 1) {
        calendar.appendChild(document.createElement("span"));
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        const dayElement = document.createElement("span");
        dayElement.textContent = String(day);
        if (day === calendarDate.getDate()) {
            dayElement.classList.add("is-wedding-day");
            dayElement.setAttribute("aria-label", `Ngày cưới ${day}`);
        }
        calendar.appendChild(dayElement);
    }
}

function createCalendar() {
    const calendar = $("#calendarDays");
    if (calendar) {
        renderCalendarDays(calendar, weddingDate);
    }
}

function createComparisonCalendar() {
    const calendar = $("#comparisonCalendarDays");
    if (calendar) {
        renderCalendarDays(calendar, new Date(2026, 8, 12));
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

    const particleCount = window.matchMedia("(max-width: 699px)").matches ? 64 : 120;

    for (let index = 0; index < particleCount; index += 1) {
        const particle = document.createElement("span");
        const duration = 7 + Math.random() * 8;

        particle.className = "particle";
        particle.style.setProperty("--x", `${Math.random() * window.innerWidth}px`);
        particle.style.setProperty("--size", `${6 + Math.random() * 12}px`);
        particle.style.setProperty("--duration", `${duration}s`);
        particle.style.setProperty("--drift", `${-24 + Math.random() * 48}px`);
        particle.style.setProperty("--spin", `${-18 + Math.random() * 48}deg`);
        particle.style.setProperty("--opacity", `${0.32 + Math.random() * 0.34}`);
        particle.style.animationDelay = `${Math.random() * -duration}s`;
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
let musicRequested = false;
const musicVolume = 0.78;

function setMusicState(playing) {
    isMusicPlaying = playing;
    document.body.classList.toggle("is-music-playing", playing);
}

function prepareAudio() {
    if (!audio) {
        return;
    }

    audio.volume = musicVolume;
    audio.loop = true;
    audio.preload = "none";
    audio.autoplay = false;
    audio.removeAttribute("autoplay");
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");
}

async function startMusic(options = {}) {
    if (!audio) {
        return false;
    }

    const { mutedBootstrap = false } = options;
    musicRequested = true;
    prepareAudio();
    audio.muted = false;

    try {
        await audio.play();
        setMusicState(true);
        return true;
    } catch (error) {
        if (mutedBootstrap) {
            try {
                audio.muted = true;
                await audio.play();
                audio.muted = false;
                audio.volume = musicVolume;
                setMusicState(!audio.paused && !audio.muted);
                return !audio.paused && !audio.muted;
            } catch (mutedError) {
                audio.muted = false;
            }
        }

        setMusicState(false);
        return false;
    }
}

function bindMusicUnlock() {
    if (musicUnlockBound) {
        return;
    }

    musicUnlockBound = true;
    const unlockEvents = ["pointerdown", "touchstart", "click", "keydown"];
    const unlockMusic = async () => {
        const played = await startMusic({ mutedBootstrap: true });

        if (played) {
            unlockEvents.forEach((eventName) => document.removeEventListener(eventName, unlockMusic, true));
        }
    };

    unlockEvents.forEach((eventName) => {
        document.addEventListener(eventName, unlockMusic, { capture: true, passive: true });
    });
}

function setupAutoScroll() {
    const opening = $("#openingScreen");
    const scrollRoot = document.scrollingElement || document.documentElement;
    const pixelsPerSecond = 24;
    const resumeDelay = 5000;
    const tickInterval = 50;
    let timerId = null;
    let previousTimestamp = 0;
    let pixelRemainder = 0;
    let pauseUntil = 0;
    let isRunning = false;

    function stop() {
        if (timerId !== null) {
            window.clearInterval(timerId);
        }
        isRunning = false;
        timerId = null;
    }

    function step() {
        if (!isRunning) {
            return;
        }

        const timestamp = performance.now();

        if (!previousTimestamp) {
            previousTimestamp = timestamp;
        }

        const elapsed = Math.min(timestamp - previousTimestamp, 100);
        previousTimestamp = timestamp;

        if (Date.now() >= pauseUntil) {
            const maxScroll = Math.max(0, scrollRoot.scrollHeight - window.innerHeight);
            const remaining = maxScroll - scrollRoot.scrollTop;

            if (remaining <= 0.5) {
                stop();
                return;
            }

            pixelRemainder += pixelsPerSecond * elapsed / 1000;
            const distance = Math.min(Math.floor(pixelRemainder), remaining);

            if (distance >= 1) {
                scrollRoot.scrollTop = Math.min(scrollRoot.scrollTop + distance, maxScroll);
                pixelRemainder -= distance;
            }
        }
    }

    function start() {
        if (isRunning || reducedMotion.matches) {
            return;
        }

        isRunning = true;
        scrollRoot.style.scrollBehavior = "auto";
        previousTimestamp = 0;
        timerId = window.setInterval(step, tickInterval);
        step();
    }

    function pauseForInteraction(event) {
        if (!event.isTrusted || !isRunning) {
            return;
        }

        pauseUntil = Date.now() + resumeDelay;
        previousTimestamp = 0;
    }

    ["pointerdown", "touchstart", "wheel", "keydown"].forEach((eventName) => {
        document.addEventListener(eventName, pauseForInteraction, { capture: true, passive: true });
    });

    window.addEventListener("pagehide", () => {
        stop();
    });

    if (opening) {
        document.addEventListener("invitation:opened", start, { once: true });
    } else {
        window.addEventListener("load", start, { once: true });
    }
}

function setupMusic() {
    if (!audio) {
        return;
    }

    prepareAudio();
    audio.addEventListener("playing", () => setMusicState(true));
    audio.addEventListener("pause", () => setMusicState(false));

    bindMusicUnlock();

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && musicRequested && !isMusicPlaying) {
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
        window.setTimeout(() => {
            opening.remove();
            document.dispatchEvent(new CustomEvent("invitation:opened"));
        }, reducedMotion.matches ? 80 : 3400);
    };

    opening.addEventListener("click", openInvitation);
    opening.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
        }
    });

    window.setTimeout(openInvitation, reducedMotion.matches ? 60 : 600);
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
    createComparisonCalendar();
    createParticles();
    setupMusic();
    setupAutoScroll();
    setupOpening();
    setupReveal();
    setupCountdown();
    setupLightbox();
});
