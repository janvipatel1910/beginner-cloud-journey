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

/* Interactive homepage experience */
const homePage = document.querySelector(".home-page");

if (homePage) {
    const storageKeys = {
        theme: "beginner-cloud-journey-theme",
        path: "beginner-cloud-journey-path"
    };

    const architectureNotes = {
        route53: {
            label: "REQUEST ENTRY",
            title: "Route 53 chooses where traffic begins.",
            copy: "It translates the domain and applies a routing policy before the request reaches the application. Exam cue: match the policy to the business requirement."
        },
        alb: {
            label: "TRAFFIC DISTRIBUTION",
            title: "The ALB routes HTTP requests intelligently.",
            copy: "It checks target health and can route by host or path. Exam cue: choose ALB for Layer 7 routing and NLB for extreme performance or static IP needs."
        },
        ec2: {
            label: "APPLICATION COMPUTE",
            title: "EC2 runs the application workload.",
            copy: "Instances provide flexible compute inside subnets. Exam cue: combine multiple Availability Zones with health checks for resilient design."
        },
        autoscaling: {
            label: "ELASTIC CAPACITY",
            title: "Auto Scaling matches capacity to demand.",
            copy: "It replaces unhealthy instances and adjusts capacity from policies. Exam cue: separate scaling from load balancing—they solve different problems."
        },
        rds: {
            label: "MANAGED DATA",
            title: "RDS protects relational application data.",
            copy: "Multi-AZ improves availability, while read replicas improve read scaling. Exam cue: identify whether the requirement is recovery or performance."
        }
    };

    const explorerNodes = Array.from(document.querySelectorAll("[data-explorer]"));
    const explorerLabel = document.getElementById("explorer-label");
    const explorerTitle = document.getElementById("explorer-title");
    const explorerCopy = document.getElementById("explorer-copy");

    explorerNodes.forEach((node) => {
        node.addEventListener("click", () => {
            const note = architectureNotes[node.dataset.explorer];
            if (!note) return;
            explorerNodes.forEach((item) => {
                const active = item === node;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            if (explorerLabel) explorerLabel.textContent = note.label;
            if (explorerTitle) explorerTitle.textContent = note.title;
            if (explorerCopy) explorerCopy.textContent = note.copy;
        });
    });

    const themeToggle = document.getElementById("home-theme-toggle");
    let savedTheme = "day";
    try {
        savedTheme = localStorage.getItem(storageKeys.theme) || "day";
    } catch {
        savedTheme = "day";
    }

    function renderTheme(theme) {
        const night = theme === "night";
        homePage.classList.toggle("home-night", night);
        if (themeToggle) {
            themeToggle.setAttribute("aria-pressed", String(night));
            themeToggle.setAttribute("aria-label", night ? "Switch to light colours" : "Switch to dark colours");
            themeToggle.innerHTML = night ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    }

    renderTheme(savedTheme);
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            savedTheme = homePage.classList.contains("home-night") ? "day" : "night";
            renderTheme(savedTheme);
            try {
                localStorage.setItem(storageKeys.theme, savedTheme);
            } catch {
                // Theme remains active for the current session.
            }
        });
    }

    const pathButtons = Array.from(document.querySelectorAll("[data-path-check]"));
    const pathProgressLabel = document.getElementById("path-progress-label");
    const pathProgressBar = document.getElementById("path-progress-bar");
    let completedPath = [];

    try {
        completedPath = JSON.parse(localStorage.getItem(storageKeys.path) || "[]");
    } catch {
        completedPath = [];
    }

    const toast = document.createElement("div");
    toast.className = "home-save-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Progress saved</span>';
    document.body.appendChild(toast);
    let toastTimer;

    function showSavedToast() {
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1500);
    }

    function renderPathProgress() {
        pathButtons.forEach((button) => {
            const complete = completedPath.includes(button.dataset.pathCheck);
            button.classList.toggle("is-complete", complete);
            button.setAttribute("aria-pressed", String(complete));
        });
        const percent = pathButtons.length ? Math.round((completedPath.length / pathButtons.length) * 100) : 0;
        if (pathProgressLabel) pathProgressLabel.textContent = `${completedPath.length} of ${pathButtons.length} complete`;
        if (pathProgressBar) pathProgressBar.style.width = `${percent}%`;
    }

    pathButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.dataset.pathCheck;
            completedPath = completedPath.includes(item)
                ? completedPath.filter((value) => value !== item)
                : [...completedPath, item];
            try {
                localStorage.setItem(storageKeys.path, JSON.stringify(completedPath));
            } catch {
                // Progress remains usable for the current session.
            }
            renderPathProgress();
            showSavedToast();
        });
    });
    renderPathProgress();

    const topicSearch = document.getElementById("home-topic-search");
    const topicItems = Array.from(document.querySelectorAll(".home-topic-item"));
    const topicFilters = Array.from(document.querySelectorAll("[data-topic-filter]"));
    const topicGroups = Array.from(document.querySelectorAll("[data-topic-group]"));
    const topicCount = document.getElementById("home-topic-count");
    const topicEmpty = document.getElementById("home-topic-empty");
    let activeTopicFilter = "all";

    function filterTopics() {
        const query = (topicSearch?.value || "").trim().toLowerCase();
        let visibleCount = 0;

        topicItems.forEach((item) => {
            const searchable = `${item.dataset.topicSearch || ""} ${item.textContent}`.toLowerCase();
            const categories = (item.dataset.topicCategory || "").split(" ");
            const matchesText = !query || searchable.includes(query);
            const matchesCategory = activeTopicFilter === "all" || categories.includes(activeTopicFilter);
            const visible = matchesText && matchesCategory;
            item.hidden = !visible;
            if (visible) visibleCount += 1;
        });

        topicGroups.forEach((group) => {
            group.hidden = !Array.from(group.querySelectorAll(".home-topic-item")).some((item) => !item.hidden);
        });
        if (topicCount) topicCount.textContent = `${visibleCount} ${visibleCount === 1 ? "topic" : "topics"}`;
        if (topicEmpty) topicEmpty.hidden = visibleCount !== 0;
    }

    topicFilters.forEach((button) => {
        button.addEventListener("click", () => {
            activeTopicFilter = button.dataset.topicFilter || "all";
            topicFilters.forEach((item) => {
                const active = item === button;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-pressed", String(active));
            });
            filterTopics();
        });
    });
    if (topicSearch) topicSearch.addEventListener("input", filterTopics);
    document.addEventListener("keydown", (event) => {
        if (event.key === "/" && topicSearch && document.activeElement !== topicSearch) {
            event.preventDefault();
            topicSearch.focus();
        }
    });
    filterTopics();

    const readinessNext = document.querySelector("#home-readiness-next b");
    const readinessActions = {
        core: "Begin with the core compute, storage, database and networking lessons.",
        security: "Review IAM, encryption and network-security decision patterns.",
        labs: "Complete one hands-on AWS lab and explain every configuration choice.",
        timed: "Attempt a full 65-question mock under timed exam conditions.",
        mocks: "Complete a second unseen mock and aim for a repeatable 80%+ score.",
        review: "Review every mistake and explain why each rejected option is wrong."
    };

    function updateReadinessGuidance() {
        const firstIncomplete = readinessInputs.find((input) => !input.checked);
        if (readinessNext) {
            readinessNext.textContent = firstIncomplete
                ? readinessActions[firstIncomplete.dataset.readiness]
                : "Strong evidence collected—verify it with another unseen timed mock.";
        }
    }
    readinessInputs.forEach((input) => input.addEventListener("change", updateReadinessGuidance));
    if (readinessReset) readinessReset.addEventListener("click", updateReadinessGuidance);
    updateReadinessGuidance();

    const scrollBar = document.getElementById("home-scroll-bar");
    const homeHeader = document.querySelector(".home-header");
    function updateScrollProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        if (scrollBar) scrollBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
        if (homeHeader) homeHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    const revealItems = Array.from(document.querySelectorAll(".home-section-heading, .home-path-progress, .home-path-grid, .home-topic-tools, .home-service-grid, .home-topic-groups, .home-readiness-intro, .home-readiness-tool, .home-project > *"));
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        revealItems.forEach((item) => item.classList.add("home-reveal"));
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => observer.observe(item));
    }
}
