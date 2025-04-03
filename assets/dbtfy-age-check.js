if (!customElements.get('dbtfy-age-check')) {
  customElements.define(
    'dbtfy-age-check',
    class DbtfyAgeChecker extends HTMLElement {
      constructor() {
        super();
        this.validAge = this.dataset.validAge;
        this.verificationType = this.dataset.verificationType;
        this.designMode = Shopify.designMode;
      }

      modalSelector() {
        if (this.verificationType == 'yes-no') {
          this.ageCheckValue = this.modal.modalBox.querySelectorAll('button');
        } else {
          this.monthGet =
            this.modal.modalBox.querySelector('.dbtfy-age-check-birthdate .dbtfy-age-check__month-picker').value - 1;
          this.dayGet = this.modal.modalBox.querySelector(
            '.dbtfy-age-check-birthdate .dbtfy-age-check__day-picker'
          ).value;
          this.yearGet = this.modal.modalBox.querySelector(
            '.dbtfy-age-check-birthdate .dbtfy-age-check__year-picker'
          ).value;
          this.closeButton = this.modal.modalBox.querySelector('.dbtfy-age-check-birthdate button');
        }
        this.verifyText = this.modal.modalBox.querySelector('.dbtfy-age-check__verify--text');
        this.verifyErrorText = this.modal.modalBox.querySelector('.dbtfy-age-check__verify--error');
        this.verifyBirthErrorText = this.modal.modalBox.querySelector('.dbtfy-age-check__verify-birth--error');
      }

      connectedCallback() {
        this.designMode = Shopify.designMode;

        document.addEventListener('DOMContentLoaded', () => {
          this.modal = new Fastify.modal({
            closeMethods: [],
            size: 'medium',
            closeIcon: '',
            selector: 'dbtfy-age-check',
            boxClass: [],
            overlayClass: ['dbtfy-age-check-overlay'],
            onOpen: function () {
              console.log('modal open');
            },
            onClose: function () {
              console.log('modal closed');
            },
          });
        });

        if (!this.designMode) {
          this.storageValue();
        }
      }

      storageValue() {
        const storageValue = localStorage.getItem('FastifyAgeChecker');
        if (!storageValue) {
          setTimeout(() => {
            this.ageModalShow();
            this.agecheckModal();
          }, 500);
        }
      }

      ageModalShow() {
        this.modal.open();
      }

      agecheckModal() {
        this.modalSelector();
        if (this.verificationType == 'yes-no') {
          this.yesNoAgeCheck();
        } else if (this.verificationType == 'birth-date') {
          this.birthDateAgeCheck();
        }
      }

      yesNoAgeCheck() {
        this.ageCheckValue.forEach((button) => {
          console.log(button);

          button.onclick = () => {
            if (button.value == 'yes') {
              this.localStorage();
            } else {
              this.verifyTextError();
            }
          };
        });
      }

      birthDateAgeCheck() {
        this.closeButton.onclick = () => {
          this.modalSelector();
          if (this.monthGet >= 0 && this.dayGet > 0 && this.yearGet > 0) {
            const birthDate = new Date(this.yearGet, this.monthGet, this.dayGet);

            const age = this.calculateAge(birthDate);

            if (age >= this.validAge) {
              this.localStorage();
            } else {
              this.verifyTextError();
            }
          } else {
            if (
              this.modal.modalBox.querySelector('.dbtfy-age-check__month-picker').value == 0 &&
              this.modal.modalBox.querySelector('.dbtfy-age-check__day-picker').value == 0 &&
              this.modal.modalBox.querySelector('.dbtfy-age-check__year-picker').value == 0
            ) {
              this.verifyTextError('birthday');
            }
          }
        };
      }

      calculateAge(birthDate) {
        const difference = Date.now() - birthDate.getTime();

        const ageDate = new Date(difference);
        let age = ageDate.getUTCFullYear() - 1970;

        const currentDate = new Date();
        const birthDateThisYear = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (currentDate < birthDateThisYear) {
          age--;
        }
        return age;
      }

      localStorage() {
        localStorage.setItem('FastifyAgeChecker', 'true');
        this.modal.close();
      }

      verifyTextError(birthday) {
        if (this.verifyText) {
          this.verifyText.style.display = 'none';
        }

        if (birthday) {
          if (this.verifyBirthErrorText) {
            this.verifyBirthErrorText.style.display = 'block';
          }
        } else {
          if (this.verifyErrorText) {
            this.verifyErrorText.style.display = 'block';
          }
          if (this.verifyBirthErrorText) {
            this.verifyBirthErrorText.style.display = 'none';
          }
        }
      }
    }
  );
}
