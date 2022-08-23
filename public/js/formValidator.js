export default class formValidator {
  constructor(selector) {
    this.form = document.querySelector(selector);
    this.inputsWithErrors = new Set();

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.hasErrors) {
        this.form.submit();
      } else {
        this.scrollToFirstError();
      }
    });
  }

  get hasErrors() {
    return this.inputsWithErrors.size > 0;
  }

  scrollToFirstError() {
    const offset = [];
    this.inputsWithErrors.forEach((prop) => {
      offset.push(prop.offsetTop);
    });
    document.body.scrollTop = Math.min(...offset) - 30; // For Safari
    document.documentElement.scrollTop = Math.min(...offset) - 30; // For Chrome, Firefox, IE and Opera
  }

  register(selector, check) {
    const inputField = this.form.querySelector(selector);
    const errorElement = inputField.closest(".form-element").querySelector(".err-msg");

    const execute = (hideErrors) => {
      const { pass, error } = check(inputField.value, inputField);
      if (!hideErrors) errorElement.textContent = error || "";
      if (pass) {
        this.inputsWithErrors.delete(inputField);
      } else {
        this.inputsWithErrors.add(inputField);
      }
    };
    inputField.addEventListener("change", () => execute());
    document.querySelector('button[type="submit"]').addEventListener("click", () => execute());
  }
}
