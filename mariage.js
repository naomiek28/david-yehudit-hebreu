const music = document.getElementById("music");
const musicButton = document.getElementById("musicButton");
const rsvpForm = document.getElementById("rsvpForm");
const calendarButton = document.getElementById("calendarButton");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const langButtons = document.querySelectorAll(".lang-button");
let currentLang = "he";

const weddingDate = new Date("2026-06-28T19:00:00+03:00");
let musicStarted = false;

const labels = {
    fr: {
        musicPlay: "Lancer la musique",
        musicPause: "Mettre en pause",
        days: "jours",
        hours: "heures",
        minutes: "minutes",
        seconds: "secondes",
        name: "Votre nom et prenom",
        guests: "Nombre de personnes",
        message: "Message ou precision",
        present: "Je serai present(e)",
        houppaOnly: "Je participerai seulement a la Houppa",
        absent: "Je ne pourrai pas etre present(e)",
        whatsapp: "Repondre pour ma presence",
        call: "Appeler"
    },
    he: {
        musicPlay: "הפעלת מוזיקה",
        musicPause: "עצירת מוזיקה",
        days: "ימים",
        hours: "שעות",
        minutes: "דקות",
        seconds: "שניות",
        name: "שם מלא",
        guests: "מספר משתתפים",
        message: "הודעה או הערה",
        present: "אשתתף בשמחה",
        houppaOnly: "אשתתף רק בחופה",
        absent: "לא אוכל להשתתף",
        whatsapp: "אישור הגעה",
        call: "להתקשר"
    }
};

function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

function changeLanguage(lang) {
    currentLang = lang;

    document.documentElement.lang = lang === "he" ? "he" : "fr";
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    document.body.classList.toggle("lang-he", lang === "he");

    document.querySelectorAll("[data-fr][data-he]").forEach(function (element) {
        element.textContent = element.dataset[lang];
    });

    document.querySelectorAll(".lang-button").forEach(function (button) {
        button.classList.toggle("active", button.dataset.lang === lang);
    });

    const countdownLabels = document.querySelectorAll(".countdown span");
    countdownLabels[0].textContent = labels[lang].days;
    countdownLabels[1].textContent = labels[lang].hours;
    countdownLabels[2].textContent = labels[lang].minutes;
    countdownLabels[3].textContent = labels[lang].seconds;

    document.getElementById("guestName").placeholder = labels[lang].name;
    document.getElementById("guestNumber").placeholder = labels[lang].guests;
    document.getElementById("guestMessage").placeholder = labels[lang].message;

    const presence = document.getElementById("guestPresence");
    presence.options[0].textContent = labels[lang].present;
    presence.options[0].value = labels[lang].present;
    presence.options[1].textContent = labels[lang].houppaOnly;
    presence.options[1].value = labels[lang].houppaOnly;
    presence.options[2].textContent = labels[lang].absent;
    presence.options[2].value = labels[lang].absent;

    rsvpForm.querySelector("button").textContent = labels[lang].whatsapp;
    document.querySelector(".rsvp-call").textContent = labels[lang].call;

    musicButton.textContent = music.paused ? labels[lang].musicPlay : labels[lang].musicPause;
}

langButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        changeLanguage(button.dataset.lang);
    });
});

changeLanguage("he");
updateCountdown();
setInterval(updateCountdown, 1000);

async function startMusic() {
    if (!music || musicStarted) {
        return;
    }

    try {
        music.volume = 1;
        await music.play();
        musicStarted = true;
        musicButton.textContent = labels[currentLang].musicPause;
    } catch (error) {
        console.log("Musique bloquee :", error);
    }
}

musicButton.addEventListener("click", async function () {
    try {
        if (music.paused) {
            music.volume = 1;
            await music.play();
            musicStarted = true;
            musicButton.textContent = labels[currentLang].musicPause;
        } else {
            music.pause();
            musicStarted = false;
            musicButton.textContent = labels[currentLang].musicPlay;
        }
    } catch (error) {
        musicButton.textContent = labels[currentLang].musicPlay;
    }
});

["click", "touchstart", "pointerdown", "scroll"].forEach(function (eventName) {
    window.addEventListener(eventName, startMusic, { once: true, passive: true });
});

const revealElements = document.querySelectorAll(".reveal-card, .reveal-item, .reveal-title");

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.18
});

revealElements.forEach(function (element, index) {
    element.style.transitionDelay = `${Math.min(index * 80, 420)}ms`;
    observer.observe(element);
});

rsvpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const presence = document.getElementById("guestPresence").value;
    const guests = document.getElementById("guestNumber").value || "0";
    const message = document.getElementById("guestMessage").value.trim();

    let text;

    if (currentLang === "he") {
        text = `שלום דבורה, הנה התשובה שלי לחתונה של דוד ויהודית:

שם: ${name}
הגעה: ${presence}
מספר משתתפים: ${guests}
הודעה: ${message || "אין הערה"}`;
    } else {
        text = `Bonjour Dvora, voici ma reponse pour le mariage de David et Yehudit :

Nom : ${name}
Presence : ${presence}
Nombre de personnes : ${guests}
Message : ${message || "Aucune precision"}`;
    }

    const whatsappLink = `https://wa.me/972534623726?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, "_blank");
});

calendarButton.addEventListener("click", function () {
    const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mariage David Yehudit//FR",
        "BEGIN:VEVENT",
        "UID:mariage-david-yehudit-20260628@invitation",
        "DTSTAMP:20260513T081800Z",
        "DTSTART:20260628T160000Z",
        "DTEND:20260628T220000Z",
        "SUMMARY:Mariage David & Yehudit",
        "LOCATION:Hotel Vert, 1 rue Rupin, Jerusalem",
        "DESCRIPTION:Kabalat Panim a 18h30, Houppa a 19h00, suivie de la reception.",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mariage-david-yehudit.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
});
