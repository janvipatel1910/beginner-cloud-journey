const words = [
    "AWS Solutions Architect",
    "Artificial Intelligence",
    "Cloud Computing",
    "Prompt Engineering",
    "Real Projects"
];

let wordIndex = 0;
let charIndex = 0;

const typingText = document.getElementById("typing-text");

function typeEffect() {

    if (charIndex < words[wordIndex].length) {

        typingText.textContent += words[wordIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeEffect, 100);

    }

    else {

        setTimeout(deleteEffect, 1500);

    }

}

function deleteEffect() {

    if (charIndex > 0) {

        typingText.textContent = words[wordIndex].substring(0, charIndex - 1);

        charIndex--;

        setTimeout(deleteEffect, 50);

    }

    else {

        wordIndex++;

        if (wordIndex >= words.length) {
            wordIndex = 0;
        }

        setTimeout(typeEffect, 300);

    }

}

const darkModeButton = document.getElementById("dark-mode-toggle");

if (darkModeButton) {
    darkModeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
}

if (typingText) {
    typeEffect();
}

const readinessInputs = Array.from(document.querySelectorAll("[data-readiness]"));
const readinessScore = document.getElementById("readiness-score");
const readinessStatus = document.getElementById("readiness-status");
const readinessBar = document.getElementById("readiness-bar");
const readinessProgress = document.querySelector(".home-progress");
const readinessReset = document.getElementById("readiness-reset");
const readinessStorageKey = "beginner-cloud-journey-readiness";

function getReadinessSelection() {
    try {
        return JSON.parse(localStorage.getItem(readinessStorageKey) || "[]");
    } catch {
        return [];
    }
}

function renderReadiness() {
    if (!readinessInputs.length) return;

    const selected = readinessInputs
        .filter((input) => input.checked)
        .map((input) => input.dataset.readiness);

    const score = readinessInputs
        .filter((input) => input.checked)
        .reduce((total, input) => total + Number(input.dataset.weight || 0), 0);

    const status = score >= 85
        ? "Ready to verify"
        : score >= 60
            ? "Nearly ready"
            : "Building evidence";

    if (readinessScore) readinessScore.textContent = `${score}%`;
    if (readinessStatus) readinessStatus.textContent = status;
    if (readinessBar) readinessBar.style.width = `${score}%`;
    if (readinessProgress) readinessProgress.setAttribute("aria-valuenow", String(score));

    try {
        localStorage.setItem(readinessStorageKey, JSON.stringify(selected));
    } catch {
        // The checklist remains usable for the current session.
    }
}

if (readinessInputs.length) {
    const savedSelection = getReadinessSelection();
    readinessInputs.forEach((input) => {
        input.checked = savedSelection.includes(input.dataset.readiness);
        input.addEventListener("change", renderReadiness);
    });
    renderReadiness();
}

if (readinessReset) {
    readinessReset.addEventListener("click", () => {
        readinessInputs.forEach((input) => {
            input.checked = false;
        });
        try {
            localStorage.removeItem(readinessStorageKey);
        } catch {
            // No additional action is needed when storage is unavailable.
        }
        renderReadiness();
    });
}
