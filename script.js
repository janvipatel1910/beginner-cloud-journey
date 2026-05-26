const words = [
    "AWS",
    "DevOps",
    "Cloud Skills",
    "Beginner Friendly Notes",
    "Real Cloud Projects"
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

darkModeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

});

typeEffect();