# Newsletter Sign-up Form with Success Message

A responsive newsletter sign-up interface built as a [Frontend Mentor challenge](https://www.frontendmentor.io/challenges/newsletter-signup-form-with-success-message-3FC1AZbNrv). The project focuses on semantic form markup, browser-native validation rules, custom validation feedback, and a responsive success dialog.

## Overview

Users can:

- Enter an email address and submit the form.
- Receive a custom error message when the field is empty or the email format is invalid.
- See a success dialog containing the email address they submitted.
- Dismiss the dialog and return to the form.
- Use the interface across mobile, tablet, and desktop screen sizes.

> **Scope:** This is a front-end demonstration. It validates the email in the browser and displays a success state; it does not send an email or persist a subscription to a backend service.

## Links

- **Live site:** [Newsletter sign-up form](https://promahmoud219.github.io/Newsletter-sign-up-form-with-success-message/)
- **Repository:** [GitHub](https://github.com/promahmoud219/Newsletter-sign-up-form-with-success-message)
- **Challenge:** [Frontend Mentor](https://www.frontendmentor.io/challenges/newsletter-signup-form-with-success-message-3FC1AZbNrv)

## Built with

- Semantic HTML5
- Sass (SCSS)
- CSS custom properties and design tokens
- Flexbox
- Responsive, mobile-first styling with media queries
- Vanilla JavaScript
- HTML Constraint Validation API
- Native HTML `<dialog>` element
- Git and GitHub Pages

## Implementation highlights

### 1. HTML constraints with JavaScript validation

The email field uses native HTML constraints:

```html
<form id="newsletter-form" novalidate>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-describedby="email-error"
  >
</form>
```

The `required` and `type="email"` attributes define the validation rules. The `novalidate` attribute prevents the browser's automatic interactive validation UI when the form is submitted; it does **not** remove the constraints or disable the Constraint Validation API.

The submit handler explicitly checks the form:

```js
if (!form.checkValidity()) {
  showEmailError(getEmailErrorMessage());
  return;
}
```

This keeps the browser's validation rules as the source of truth while allowing the application to control how errors are presented.

### 2. Reading the browser's validation state

The project reads the input's `ValidityState` to distinguish between an empty field and an incorrectly formatted email:

```js
function getEmailErrorMessage() {
  if (emailInput.validity.valueMissing) {
    return "Email address is required";
  }

  if (emailInput.validity.typeMismatch) {
    return "Valid email required";
  }

  return "";
}
```

This avoids duplicating the browser's email-format validation with a separate regular expression.

### 3. Separating validation logic from error presentation

The validation decision and the visual error state are handled separately. The application updates the error text, toggles the `input--error` class, and updates `aria-invalid`.

The error text is placed in a live region so assistive technologies can announce changes:

```html
<span
  id="email-error"
  class="form-group__error"
  aria-live="polite"
></span>
```

The class-based error state also gives the application control over *when* the error styling appears, instead of styling every initially invalid field immediately on page load.

### 4. Updating the success dialog safely

After successful validation, the submitted email is displayed in the dialog:

```js
const email = emailInput.value.trim();
modalEmail.textContent = email;

successModal.showModal();
```

The value is inserted with `textContent`, not `innerHTML`. This treats user input as text instead of parsing it as HTML.

The project uses the native `<dialog>` element and its `showModal()` and `close()` methods rather than recreating modal behavior with a generic `div`.

### 5. Understanding the native Dialog defaults

One of the more interesting debugging lessons was that a native HTML element can have important browser-provided styles through the **User Agent Stylesheet**.

The browser applies default sizing constraints to `<dialog>`, including `max-width` and `max-height`. Those limits affected the full-screen mobile layout even after setting the desired width and height.

The mobile dialog therefore explicitly removes those maximum constraints:

```scss
.modal {
  position: fixed;
  inset: 0;

  width: 100dvw;
  height: 100dvh;

  max-width: none;
  max-height: none;
  margin: 0;
}
```

- `width` and `height` define the intended dimensions.
- `max-width: none` and `max-height: none` remove the browser's maximum-size limits.
- `inset: 0` anchors the dialog to all four edges of the viewport.
- `100dvw` and `100dvh` use dynamic viewport dimensions, which are useful on mobile browsers where the visible viewport can change.

The layout is applied only while the dialog is open:

```scss
.modal {
  &[open] {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-400);
  }
}
```

The `open` attribute reflects the dialog's state. Calling `showModal()` opens it; calling `close()` closes it. The CSS selector `&[open]` applies the flex layout only in the open state.

At the tablet breakpoint, the dialog switches from a full-screen mobile layout to a centered, fixed-size panel. This keeps one semantic dialog component while adapting its presentation to the viewport.

### 6. Positioning the dismiss button with Flexbox

The dialog uses a column flex layout. Applying `margin-top: auto` to the dismiss button consumes the available free space above it and pushes it toward the bottom of the dialog:

```scss
.modal__button {
  margin-top: auto;
}
```

This is a useful example of using the Flexbox alignment model instead of hard-coding the button's position.

### 7. Sass organization and reusable design tokens

Styles are separated into Sass partials for abstracts, base styles, and components. Colors, spacing, breakpoints, and typography are centralized and reused through `@use` and a typography mixin.

This reduces repeated values and makes component-level changes easier to maintain.

## What I learned

This project helped me connect browser behavior, CSS layout, and JavaScript instead of treating them as unrelated topics.

- **HTML validation is executable behavior.** Attributes such as `required` and `type="email"` define constraints that JavaScript can inspect through the Constraint Validation API.
- **`novalidate` has a limited responsibility.** It suppresses automatic interactive validation on form submission; it does not disable `checkValidity()`, `reportValidity()`, or the input's validity state.
- **A validity state and a displayed error are not the same thing.** The browser can consider an empty required field invalid on initial page load, while the application can choose to reveal its custom error UI only after an interaction or submission attempt.
- **Native elements come with browser styles.** When a `<dialog>` did not fill the mobile viewport as expected, inspecting the computed styles revealed the effect of its default maximum dimensions. Explicitly setting `max-width: none` and `max-height: none` removed those constraints.
- **The native Dialog API provides behavior that would otherwise need custom code.** `showModal()` and `close()` manage the dialog state, while CSS styles its open presentation and `::backdrop` styles the backdrop.
- **Responsive components do not always need duplicate markup.** The same dialog can be full-screen on mobile and a centered panel on larger screens by changing its dimensions, spacing, and border radius at a breakpoint.
- **Flexbox can distribute free space.** `margin-top: auto` pushes the dismiss button toward the bottom of a column layout without absolute positioning.
- **DOM text updates should treat user input as text.** Using `textContent` avoids interpreting the submitted email as HTML.
- **Accessibility requires communicating state.** The input's error state is reflected through `aria-invalid`, and the error message is associated with the input using `aria-describedby` and announced through `aria-live="polite"`.

## Continued development

Areas I want to improve in future iterations:

- Give the dialog an explicit accessible name by connecting its heading with `aria-labelledby`.
- Refine keyboard focus indicators so they remain visible without changing element dimensions or causing layout shifts.
- Review typography tokens and use scalable units such as `rem` where appropriate.
- Remove unused files and stale commented-out experiments so there is one clear stylesheet source and a clean codebase.
- Add automated tests for empty input, malformed email addresses, valid submissions, and dialog dismissal.
- Explore submitting validated form data to a real backend in a future project.

## Useful resources

- [MDN: Your first form](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Your_first_form) — semantic form structure and basic controls.
- [MDN: Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation) — HTML constraints and custom validation.
- [MDN: Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) — validity state and validation methods.
- [MDN: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) — native modal dialog behavior.
- [MDN: HTMLDialogElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) — `showModal()` and `close()`.
- [MDN: User-agent style sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade) — understanding the cascade and browser-provided styles.

## AI collaboration

I used ChatGPT as a learning and debugging partner during this project.

The collaboration focused on understanding browser behavior and the reasoning behind implementation decisions, including:

- The difference between HTML constraints, the Constraint Validation API, and custom error UI.
- How `novalidate`, `checkValidity()`, `reportValidity()`, and `setCustomValidity()` interact.
- Debugging the native `<dialog>` element and understanding its browser-provided sizing constraints.
- Choosing responsive dialog dimensions and using Flexbox to position its dismiss button.
- Reviewing DOM updates, accessibility attributes, and Sass organization.

I used these discussions to understand and evaluate the trade-offs, then applied and tested the changes in the project.

## Author

- GitHub: [@promahmoud219](https://github.com/promahmoud219)
- Frontend Mentor: [@promahmoud219](https://www.frontendmentor.io/profile/promahmoud219)