if (!customElements.get('dbtfy-faq')) {
  customElements.define(
    'dbtfy-faq',
    class DbtfyFaq extends HTMLElement {
      constructor() {
        super();
        this.questions = this.querySelectorAll('.dbtfy-faq-question-wrapper');
        this.searchBar = this.querySelector('.dbtfy-faq-search-bar .search__input');
        this.searchEnabled = this.dataset.searchEnabled;
      }

      connectedCallback() {
        this.init();
      }

      init() {
        this.faqActive();
        if (this.searchEnabled === 'true') {
          this.initSearch();
        }
      }

      faqActive() {
        this.questions.forEach((question) => {
          question.onclick = () => {
            if (question.classList.contains('dbtfy-faq-active')) {
              question.classList.remove('dbtfy-faq-active');
            } else {
              question.classList.add('dbtfy-faq-active');
            }
          };
        });
      }

      initSearch() {
        // Search functionality for FAQ
        this.searchBar.addEventListener('input', () => {
          const searchTerm = this.searchBar.value.toLowerCase();
          let hasVisibleQuestions = false; // Track if any question is visible

          this.questions.forEach((question) => {
            const questionText = question.querySelector('.dbtfy-faq-question').innerText.toLowerCase();
            const isVisible = questionText.includes(searchTerm);

            // Show or hide the question based on the search term
            question.style.display = isVisible ? 'block' : 'none';

            // Update the flag if the question is visible
            if (isVisible) {
              hasVisibleQuestions = true;
            }
          });

          // Handle the visibility of the parent groups
          const faqGroups = document.querySelectorAll('.dbtfy-faq-group-block');

          faqGroups.forEach((group) => {
            const allQuestions = group.querySelectorAll('.dbtfy-faq-question-wrapper');
            const visibleQuestions = group.querySelectorAll('.dbtfy-faq-question-wrapper[style="display: block;"]');

            // Show the group if any questions are visible, otherwise hide it
            group.style.display = visibleQuestions.length > 0 ? 'block' : 'none';
          });

          // Handle the "no results" message
          const noResultMessage = document.querySelector('.dbtfy-faq-no-result');
          noResultMessage.style.display = hasVisibleQuestions ? 'none' : 'block';
        });
      }
    }
  );
}
