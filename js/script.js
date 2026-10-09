/* =========================================================
   Yande Sichula — Personal Website (ICT251 Activity 3)
   js/script.js

   Four interactive features:
     1. Contact form validation and preview (compulsory)
     2. Expandable project details
     3. Photo gallery viewer
     4. Study hours calculator

   The script is loaded with "defer", so the page's HTML is
   ready by the time this code runs.
   ========================================================= */

"use strict";


/* ---------- Shared helpers ---------- */

// Shows an error message under a field and marks the field as invalid
function showFieldError(input, message) {
    const errorElement = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
}

// Removes the error message and the invalid state from a field
function clearFieldError(input) {
    const errorElement = document.getElementById(input.id + "-error");
    input.removeAttribute("aria-invalid");
    errorElement.textContent = "";
}

// Checks one field against its rule and shows or clears its error.
// A rule is { input, label, check }, where check() returns "" when the value is fine.
function validateField(rule) {
    const message = rule.check(rule.input.value.trim());

    if (message !== "") {
        showFieldError(rule.input, message);
        return false;
    }

    clearFieldError(rule.input);
    return true;
}

// Validates every rule in the array and returns the ones that failed
function findInvalidFields(rules) {
    return rules.filter((rule) => !validateField(rule));
}

// Once a field has been marked invalid, re-check it as the visitor types,
// so the error disappears as soon as the value is fixed
function revalidateWhileTyping(rules) {
    rules.forEach((rule) => {
        rule.input.addEventListener("input", () => {
            if (rule.input.getAttribute("aria-invalid") === "true") {
                validateField(rule);
            }
        });
    });
}

// Writes a short message into a status line, styled as an error or a success
function setStatus(element, message, type) {
    element.textContent = message;
    element.classList.remove("is-error", "is-success");
    if (type) {
        element.classList.add("is-" + type);
    }
}


/* ---------- 1. Contact form validation and preview ---------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Validates the contact form in the browser and shows a preview instead of sending anything
function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) {
        return;
    }

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const topicSelect = document.getElementById("contact-topic");
    const messageInput = document.getElementById("contact-message");
    const status = document.getElementById("form-status");
    const preview = document.getElementById("form-preview");

    const rules = [
        {
            input: nameInput,
            label: "Name",
            check: (value) => {
                if (value === "") {
                    return "Please enter your name. Spaces on their own do not count.";
                }
                if (value.length < 2) {
                    return "Your name needs at least 2 characters.";
                }
                return "";
            }
        },
        {
            input: emailInput,
            label: "Email",
            check: (value) => {
                if (value === "") {
                    return "Please enter your email address.";
                }
                if (!EMAIL_PATTERN.test(value)) {
                    return "Please enter a valid email address, for example name@example.com.";
                }
                return "";
            }
        },
        {
            input: messageInput,
            label: "Message",
            check: (value) => {
                if (value === "") {
                    return "Please write a message. Spaces on their own do not count.";
                }
                if (value.length < 10) {
                    return "Your message needs at least 10 characters.";
                }
                return "";
            }
        }
    ];

    // Copies the visitor's input into the preview. textContent is used so that
    // anything typed (even HTML tags) is shown as plain text, never run as code.
    function showPreview() {
        document.getElementById("preview-name").textContent = nameInput.value.trim();
        document.getElementById("preview-email").textContent = emailInput.value.trim();
        document.getElementById("preview-topic").textContent = topicSelect.options[topicSelect.selectedIndex].text;
        document.getElementById("preview-message").textContent = messageInput.value.trim();
        preview.hidden = false;
        preview.focus();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // keep everything in the browser: no reload, nothing is sent
        preview.hidden = true;

        const invalidFields = findInvalidFields(rules);

        if (invalidFields.length > 0) {
            const labels = invalidFields.map((rule) => rule.label).join(", ");
            setStatus(status, "Please fix the highlighted fields: " + labels + ".", "error");
            invalidFields[0].input.focus();
            return;
        }

        setStatus(status, "All fields passed validation. Nothing was sent; see the preview below.", "success");
        showPreview();
    });

    // The Clear Form button also clears the errors, status and preview
    form.addEventListener("reset", () => {
        rules.forEach((rule) => clearFieldError(rule.input));
        setStatus(status, "", null);
        preview.hidden = true;
    });

    revalidateWhileTyping(rules);
}


/* ---------- 2. Expandable project details ---------- */

// Opens or closes one project's details and updates the button so the state is clear
function setDetailsOpen(button, panel, isOpen) {
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector(".toggle-label").textContent = isOpen ? "Hide details" : "Show details";
    button.closest(".project-card").classList.toggle("is-open", isOpen);
    panel.hidden = !isOpen;
}

// Shows a Show/Hide details button on each project card; every card starts closed.
// Without JavaScript the buttons stay hidden and all details remain visible.
function setupProjectDetails() {
    const buttons = document.querySelectorAll(".details-toggle");

    buttons.forEach((button) => {
        const panel = document.getElementById(button.getAttribute("aria-controls"));
        if (!panel) {
            return;
        }

        button.hidden = false;
        setDetailsOpen(button, panel, false);

        button.addEventListener("click", () => {
            const isOpen = button.getAttribute("aria-expanded") === "true";
            setDetailsOpen(button, panel, !isOpen);
        });
    });
}


/* ---------- 3. Photo gallery viewer ---------- */

// Turns the photo grid into a viewer that shows one photo and its caption at a time
function setupGallery() {
    const gallery = document.getElementById("gallery");
    const controls = document.getElementById("gallery-controls");
    if (!gallery || !controls) {
        return;
    }

    const photos = Array.from(gallery.querySelectorAll("figure"));
    const previousButton = document.getElementById("gallery-prev");
    const nextButton = document.getElementById("gallery-next");
    const status = document.getElementById("gallery-status");
    let currentIndex = 0;

    // Displays the photo at the given position. Previous is disabled on the first
    // photo and Next on the last, so the viewer never runs past either end.
    function showPhoto(index) {
        currentIndex = index;
        photos.forEach((figure, position) => {
            figure.hidden = position !== currentIndex;
        });
        status.textContent = "Photo " + (currentIndex + 1) + " of " + photos.length;
        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === photos.length - 1;
    }

    // Moves one photo backwards (-1) or forwards (+1). If the button that was used
    // becomes disabled, keyboard focus moves to the other button instead of being lost.
    function move(direction) {
        const target = currentIndex + direction;
        if (target < 0 || target >= photos.length) {
            return;
        }

        const usedButton = direction < 0 ? previousButton : nextButton;
        const otherButton = direction < 0 ? nextButton : previousButton;
        const hadFocus = document.activeElement === usedButton;

        showPhoto(target);

        if (hadFocus && usedButton.disabled) {
            otherButton.focus();
        }
    }

    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    // The left and right arrow keys also work while a viewer button has focus
    controls.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            move(-1);
        } else if (event.key === "ArrowRight") {
            move(1);
        }
    });

    gallery.classList.add("is-viewer");
    controls.hidden = false;
    showPhoto(0);
}


/* ---------- 4. Study hours calculator ---------- */

// Rounds to 2 decimal places and adds the right word, e.g. "1 hour" or "7.5 hours"
function formatAmount(amount, singular, plural) {
    const rounded = Math.round(amount * 100) / 100;
    return rounded + " " + (rounded === 1 ? singular : plural);
}

// Checks hours per day: must be a number above 0 and no more than 24
function checkHours(value) {
    if (value === "") {
        return "Enter how many hours you plan to study each day.";
    }

    const hours = Number(value);

    if (!Number.isFinite(hours)) {
        return "Hours must be a number, for example 2 or 1.5.";
    }
    if (hours < 0) {
        return "Hours cannot be negative.";
    }
    if (hours === 0) {
        return "Enter more than 0 hours.";
    }
    if (hours > 24) {
        return "A day only has 24 hours. Enter 24 or less.";
    }
    return "";
}

// Checks days per week: must be a whole number from 1 to 7
function checkDays(value) {
    if (value === "") {
        return "Enter how many days a week you plan to study.";
    }

    const days = Number(value);

    if (!Number.isFinite(days)) {
        return "Days must be a number from 1 to 7.";
    }
    if (!Number.isInteger(days)) {
        return "Days must be a whole number from 1 to 7.";
    }
    if (days < 1 || days > 7) {
        return "Days must be between 1 and 7.";
    }
    return "";
}

// Reads hours per day and days per week, rejects invalid input and shows the weekly total
function setupStudyCalculator() {
    const form = document.getElementById("study-form");
    if (!form) {
        return;
    }

    const hoursInput = document.getElementById("study-hours");
    const daysInput = document.getElementById("study-days");
    const result = document.getElementById("study-result");
    const totalText = document.getElementById("study-total");
    const detailText = document.getElementById("study-detail");

    const rules = [
        { input: hoursInput, label: "Hours per day", check: checkHours },
        { input: daysInput, label: "Days per week", check: checkDays }
    ];

    // Updates the result box; isError switches it to the red error style
    function showResult(total, detail, isError) {
        totalText.textContent = total;
        detailText.textContent = detail;
        result.classList.toggle("is-error", isError);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const invalidFields = findInvalidFields(rules);

        if (invalidFields.length > 0) {
            const labels = invalidFields.map((rule) => rule.label).join(" and ");
            showResult("No total yet", "Please fix " + labels + " above, then press Calculate again.", true);
            invalidFields[0].input.focus();
            return;
        }

        const hours = Number(hoursInput.value.trim());
        const days = Number(daysInput.value.trim());
        const weeklyHours = hours * days;

        showResult(
            formatAmount(weeklyHours, "hour", "hours") + " per week",
            formatAmount(hours, "hour", "hours") + " a day × " + formatAmount(days, "day", "days") +
                ". That is about " + formatAmount(weeklyHours * 4, "hour", "hours") + " over four weeks.",
            false
        );
    });

    // The Clear button empties the fields, the errors and the result
    form.addEventListener("reset", () => {
        rules.forEach((rule) => clearFieldError(rule.input));
        showResult("No total yet", "Your weekly study hours will appear here.", false);
    });

    revalidateWhileTyping(rules);
}


/* ---------- Start everything ---------- */

setupContactForm();
setupProjectDetails();
setupGallery();
setupStudyCalculator();
