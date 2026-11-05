
const form = document.getElementById("newsletter-form");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

const successModal = document.getElementById("success-modal");
const modalEmail = document.querySelector(".modal__email");
const newsletter = document.querySelector(".newsletter");
const dismissButton = document.querySelector(".modal__button");

function getEmailErrorMessage() {
    if (emailInput.validity.valueMissing) {
        return "Email address is required";
    }

    if (emailInput.validity.typeMismatch) {
        return "Valid email required";
    }

    return "";
}

function clearEmailError() {
    emailError.textContent = "";
    emailInput.classList.remove("input--error");
    emailInput.setAttribute("aria-invalid", "false");
}

function showEmailError(message) {
    emailError.textContent = message;
    emailInput.classList.add("input--error");
    emailInput.setAttribute("aria-invalid", "true");
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        showEmailError(getEmailErrorMessage());
        return;
    }

    clearEmailError();

    const email = emailInput.value.trim();

    // Render untrusted input as plain text.
    modalEmail.textContent = email;

    successModal.showModal();
    newsletter.hidden = true;
});

emailInput.addEventListener("input", () => {
    if (emailInput.validity.valid) {
        clearEmailError();
    }
});

dismissButton.addEventListener("click", () => {
    successModal.close();
    form.reset();
    clearEmailError();
    emailInput.focus();
    newsletter.hidden = false;
});
