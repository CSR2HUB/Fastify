if (!customElements.get('dbtfy-form-validator')) {
  customElements.define(
    'dbtfy-form-validator',
    class DbtfyFormValidator extends HTMLElement {
      constructor() {
        super();

        this.formValidated = true;

        this.form = this.querySelector('form');
        this.form.setAttribute('novalidate', '');

        this.form.addEventListener('submit', this.validateForm.bind(this));

        this.form.querySelector("button[type='submit']").addEventListener('click', this.validateForm.bind(this));

        this.requiredFields = this.form.querySelectorAll('.field__input:required');

        this.emailField = this.form.querySelectorAll('input[type="email"]');
        this.errorMessageBox = this.form.querySelector('.form__error-message');

        this.designMode = Shopify.designMode;

        this.init();
      }

      init() {
        if (this.designMode) {
          // check input has email type and it's required as well
          if (this.emailField.length == 0) {
            this.errorMessageBox.classList.remove('hidden');
            this.errorMessageBox.querySelector('.error').textContent = this.dataset.oneEmailError;
            return;
          }
          if (this.emailField.length > 1) {
            this.errorMessageBox.classList.remove('hidden');
            this.errorMessageBox.querySelector('.error').textContent = this.dataset.emailError;
            return;
          }
        }
      }

      validateForm(event) {
        event.preventDefault();
        event.stopPropagation();

        this.formValidated = true;

        this.checkRequiredFields();

        this.checkEmailField();

        if (this.formValidated) {
          this.form.removeEventListener('submit', this.validateForm);
          this.form.submit();
          this.form.addEventListener('submit', this.validateForm.bind(this));
        }
      }

      checkRequiredFields() {
        this.requiredFields.forEach((field) => {
          if (!field.value) {
            field.closest('.field').classList.add('is-invalid');
            this.formValidated = false;
          } else {
            field.closest('.field').classList.remove('is-invalid');
          }
        });
      }

      checkEmailField() {
        if (
          this.emailField[0] &&
          (this.emailField[0].validity.typeMismatch || this.emailField[0].validity.valueMissing)
        ) {
          this.emailField[0].closest('.field').classList.add('is-invalid');
          this.formValidated = false;
        } else {
          this.emailField[0].closest('.field').classList.remove('is-invalid');
        }
      }
    }
  );
}
