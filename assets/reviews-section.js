if (!customElements.get('star-rating')) {
  customElements.define(
    'star-rating',
    class StarRating extends HTMLElement {
      constructor() {
        super();

        this.rating = this.dataset.rating;

        this.disableColor = this.dataset.disableColor;
        if (isNaN(this.rating)) {
          return false;
        }

        this.rating = parseInt(this.rating) + 1;
        this.init();
      }

      init() {
        let disableStars = this.querySelectorAll('svg:nth-child(n+' + this.rating + ')');

        if (disableStars) {
          disableStars.forEach((star) => {
            if (this.disableColor) {
              star.style.fill = this.disableColor;
            } else {
              star.classList.add('empty-star-svg');
            }
          });
        }
      }
    }
  );
}

if (!customElements.get('review-updownvote')) {
  customElements.define(
    'review-updownvote',
    class ReviewUpDownvote extends HTMLElement {
      constructor() {
        super();
        this.reviewId = this.closest('.review_item').dataset.reviewId;

        if (!this.reviewId) {
          this.remove();
          return;
        }

        this.upvote = this.querySelector('review-upvote');
        this.downvote = this.querySelector('review-downvote');

        this.upvoteCounter = this.upvote.querySelector('.counter');
        this.downvoteCounter = this.downvote.querySelector('.counter');

        if (localStorage.getItem(this.reviewId + '-upvote')) {
          this.upvote.querySelector('i').classList.add('filled');
        }

        if (localStorage.getItem(this.reviewId + '-downvote')) {
          this.downvote.querySelector('i').classList.add('filled');
        }

        this.apiURL = Fastify.reviewAPIPrefix + 'reviews/review-vote';
      }

      connectedCallback() {
        this.upvote.addEventListener('click', this.upvoteReview.bind(this));
        this.downvote.addEventListener('click', this.downvoteReview.bind(this));
      }

      async upvoteReview() {
        await this.voteReview(this.reviewId, 'up', this.upvote);
        if (localStorage.getItem(this.reviewId + '-downvote')) {
          localStorage.removeItem(this.reviewId + '-downvote');
          this.downvote.querySelector('i').classList.remove('filled');
        } else {
          localStorage.setItem(this.reviewId + '-upvote', 1);
          this.upvote.querySelector('i').classList.toggle('filled');
        }
      }

      async downvoteReview() {
        await this.voteReview(this.reviewId, 'down', this.downvote);
        if (localStorage.getItem(this.reviewId + '-upvote')) {
          localStorage.removeItem(this.reviewId + '-upvote');
          this.upvote.querySelector('i').classList.remove('filled');
        } else {
          localStorage.setItem(this.reviewId + '-downvote', 1);
          this.downvote.querySelector('i').classList.toggle('filled');
        }
      }

      async voteReview(reviewId, voteType, button) {
        try {
          // Disable the button to prevent multiple clicks
          button.disabled = true;

          const response = await fetch(this.apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId, voteType: voteType }),
          });

          if (!response.ok) throw new Error('Failed to register vote.');

          const data = await response.json();

          if (data.success && data.data.length > 0) {
            const updatedReview = data.data.find((review) => review.reviewId === reviewId);

            if (updatedReview) {
              this.upvoteCounter.textContent = updatedReview.upvote;
              this.downvoteCounter.textContent = updatedReview.downvote;
            }
          }
          button.disabled = false;
        } catch (error) {
          button.disabled = false;
          console.error('Error voting review:', error);
          alert('An error occurred. Please try again.');
        }
      }
    }
  );
}

if (!customElements.get('dtm-review')) {
  customElements.define(
    'dtm-review',
    class DTMReview extends HTMLElement {
      constructor() {
        super();

        this.reviewAPIPrefix = Fastify.reviewAPIPrefix;

        this.reviewAPIs = {
          customerReviews: this.reviewAPIPrefix + 'customer-reviews',
          addReview: this.reviewAPIPrefix + 'reviews',
          uploadMedia: this.reviewAPIPrefix + 'reviews/upload-media',
        };

        this.itemTemplate = this.querySelector('#review-item-template');

        const itemTemplateDataset = this.itemTemplate.dataset;

        this.sliderEnabled = itemTemplateDataset.sliderEnabled;
        this.desktopCol = parseInt(itemTemplateDataset.sliderDesktopCol, 10);
        this.mobileCol = parseInt(itemTemplateDataset.sliderMobileCol, 10);
        this.sliderStyle = itemTemplateDataset.sliderStyle;
        this.enableReviewerPhoto = itemTemplateDataset.reviewerPhoto === 'true';
        this.dateformat = itemTemplateDataset.dateFormat;
        this.showImages = itemTemplateDataset.showAttachedImages === 'true';
        this.showVideos = itemTemplateDataset.showAttachedVideos === 'true';
        this.mediaAspectRatio = itemTemplateDataset.aspectRatio;

        if (this.sliderStyle == 'list') {
          this.desktopCol = 1;
          this.mobileCol = 1;
        }

        this.reviewNotFound = this.querySelector('#review-not-found');
        this.reviewContainer = this.querySelector('.review-container');

        this.sortBySelector = this.querySelector('#sort-reviews');
        this.perPageSelector = this.querySelector('#per-page');
        this.mediaOnlySelector = this.querySelector('#reviews-with-media');

        this.ratingProgress = this.querySelector('.rating-progress-col');

        this.writeReviewButton = this.querySelector('.write-review-button');

        this.reviewForm = this.querySelector('#reviewForm');
        this.reviewForm.addEventListener('submit', this.submitReview.bind(this));
      }

      connectedCallback() {
        this.setupReview();

        if (this.writeReviewButton) {
          this.writeReviewButton.addEventListener('click', () => {
            this.modal.open();
          });
        }

        if (typeof Fastify.modal !== 'undefined') {
          this.loadModel();
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            this.loadModel();
          });
        }

        this.perPageSelector.addEventListener('change', this.setupReview.bind(this));
        this.sortBySelector.addEventListener('change', this.setupReview.bind(this));
        this.mediaOnlySelector.addEventListener('change', this.setupReview.bind(this));
      }

      sliderInit() {
        if (
          this.classList.contains('cloned') &&
          document.querySelector('dbtfy-product-tab').dataset['block'] == 'false'
        ) {
          this.clonedDesktopCol = 2;
        }

        // review media slider
        var medias = this.querySelectorAll('.review-media-slider');
        medias.forEach((media) => {
          if (media.querySelectorAll('li').length > 0) {
            new Splide(media, {
              perPage: 2,
              perMove: 1,
              gap: '1em',
              drag: false,
              pagination: false,
              classes: {
                arrow: 'slider-button splide__arrow',
              },
            }).mount();
          }
        });

        // Main Slider
        let sliderSettings;
        if (this.sliderEnabled === 'none') {
          this.querySelector('#review-slider').classList.remove('splide');
          return;
        } else if (this.sliderEnabled === 'desktop') {
          sliderSettings = {
            perPage: this.clonedDesktopCol || this.desktopCol,
            perMove: 1,
            gap: '1em',
            drag:
              document.querySelectorAll('#review-slider .review_item').length > this.clonedDesktopCol ||
              this.desktopCol,
            breakpoints: {
              750: {
                destroy: true,
              },
            },
            classes: {
              arrow: 'slider-button splide__arrow',
            },
          };
        } else if (this.sliderEnabled === 'mobile') {
          sliderSettings = {
            perPage: this.mobileCol,
            perMove: 1,
            gap: '1em',
            mediaQuery: 'min',
            drag:
              document.querySelectorAll('#review-slider .review_item').length > this.clonedDesktopCol ||
              this.desktopCol,
            breakpoints: {
              750: {
                perPage: this.mobileCol,
                perMove: 1,
                destroy: true,
                drag: document.querySelectorAll('#review-slider .review_item').length > this.mobileCol,
              },
            },
            classes: {
              arrow: 'slider-button splide__arrow',
            },
          };
        } else {
          sliderSettings = {
            perPage: this.clonedDesktopCol || this.desktopCol,
            perMove: 1,
            drag:
              document.querySelectorAll('#review-slider .review_item').length > this.clonedDesktopCol ||
              this.desktopCol,
            gap: '1em',
            pagination: false,
            breakpoints: {
              750: {
                perPage: this.mobileCol,
                perMove: 1,
                drag: document.querySelectorAll('#review-slider .review_item').length > this.mobileCol,
              },
            },
            classes: {
              arrow: 'slider-button splide__arrow',
            },
          };
        }

        new Splide('#review-slider', sliderSettings).mount();
      }

      loadModel() {
        const _this = this;
        this.modal = new Fastify.modal({
          closeMethods: ['overlay', 'button', 'escape'],
          size: 'small',
          closeIcon: '',
          selector: 'review-form-modal',
          boxClass: ['inner-spacing'],
          overlayClass: ['review--form'],
          onOpen: function () {
            _this.dropzone = this.modal.querySelector('.dropbox');
            _this.fileInput = this.modal.querySelector('#review-media');
            _this.mediaLimit = this.modal.querySelector('.media-limit');
            _this.mediaRequired = this.modal.querySelector('.media-required');
            _this.reviewError = this.modal.querySelector('.review-form-error');
            _this.previewContainer = this.modal.querySelector('#preview-container');
            _this.submitButton = this.modal.querySelector('.submit-btn');
            _this.reviewWrapper = this.modal.querySelector('.review-wrapper');
            _this.thankYouMessageWrapper = this.modal.querySelector('.review-thank-you-message-wrapper');
            _this.setupDropbox();
            this.modal.querySelector('#reviewForm').reset();
            _this.previewContainer && (_this.previewContainer.innerHTML = '');
          },
          onClose: function () {
            _this.reviewWrapper.classList.remove('hidden');
            _this.thankYouMessageWrapper.classList.add('hidden');
            _this.reviewError.classList.add('hidden');
          },
        });
        this.modal.modalBox.querySelector('#reviewForm')?.addEventListener('submit', _this.submitReview.bind(_this));
      }

      setupDropbox() {
        const dropbox = this.dropzone;
        if (dropbox === null) {
          return;
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
          dropbox.addEventListener(eventName, (event) => event.preventDefault(), false);
        });

        ['dragenter', 'dragover'].forEach((eventName) => {
          dropbox.addEventListener(eventName, () => dropbox.classList.add('highlight'), false);
        });
        ['dragleave', 'drop'].forEach((eventName) => {
          dropbox.addEventListener(eventName, () => dropbox.classList.remove('highlight'), false);
        });

        dropbox.addEventListener('click', () => this.fileInput.click());

        dropbox.addEventListener('drop', this.handleFiles.bind(this));
        this.fileInput.addEventListener('change', this.handleFiles.bind(this));
      }

      async handleFiles(event) {
        let files;
        if (event.dataTransfer) {
          files = event.dataTransfer.files;
        } else if (event.target) {
          files = event.target.files;
        }

        if (!files) {
          return;
        }

        this.previewContainer.innerHTML = '';
        let formData = new FormData();
        formData.append('shopName', Fastify.permanent_domain);

        let file_size = 0;
        if (files && files.length > 0) {
          Array.from(files).forEach((file) => {
            file_size += file.size;
          });

          if (file_size > 5 * 1024 * 1024) {
            this.mediaLimit.classList.remove('hidden');
            return;
          } else {
            this.mediaLimit.classList.add('hidden');
          }
        }

        Array.from(files).forEach((file) => {
          if (file.type.startsWith('image/')) {
            this.previewImage(file);
          } else if (file.type.startsWith('video/')) {
            this.previewVideo(file);
          } else {
            alert('Only images and videos are allowed.');
            return;
          }

          formData.append('medias', file, file.name);
        });

        if (formData.has('medias')) {
          this.previewContainer.classList.add('hidden');

          this.submitButton.classList.add('loading');
          this.submitButton.querySelector('.loading__spinner').classList.remove('hidden');
          this.submitButton.disabled = true;
          await this.uploadMedia(formData);
        }
      }

      previewImage(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.classList.add('preview-image');
          this.previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      }

      previewVideo(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const video = document.createElement('video');
          video.src = event.target.result;
          video.controls = true;
          video.classList.add('preview-video');
          this.previewContainer.appendChild(video);
        };
        reader.readAsDataURL(file);
      }

      async uploadMedia(formData) {
        try {
          const response = await fetch(this.reviewAPIs.uploadMedia, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (result.success && result.data.length > 0) {
            this.mediaRequired?.classList.add('hidden');

            this.previewContainer.classList.remove('hidden');
            this.submitButton.classList.remove('loading');
            this.submitButton.querySelector('.loading__spinner').classList.add('hidden');
            this.submitButton.disabled = false;
            this.mediaUrls = result.data;
          } else {
            console.error('Upload error:', result.error);
            return [];
          }
        } catch (error) {
          console.error('Error uploading media:', error);
          return [];
        }
      }

      setupReview(page = 1) {
        if (typeof page === 'object') {
          page = 1;
        }
        const queryParams = new URLSearchParams({
          reviewType: 'product',
          productId: this.dataset.productId,
          sortBy: this.sortBySelector.value,
          shopName: Fastify.permanent_domain,
          limit: this.perPageSelector.value,
          page: page,
          mediaOnly: this.mediaOnlySelector.checked,
        }).toString();

        const urlWithParams = `${this.reviewAPIs.customerReviews}?${queryParams}`;

        fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((res) => {
            const data = res.data;

            let index = 0;
            let review_html = '';

            if (res.success == false || data.reviews.length == 0) {
              this.querySelector('#dbtfy-review-scroll').classList.add('hidden');
            } else {
              data.reviews?.forEach((review) => {
                var review_index = index++;
                review_html += this.renderReview(review, review_index);
              });

              if (data.pagination.currentPage < data.pagination.lastPage) {
                this.querySelector('#dbtfy-review-scroll').classList.remove('hidden', 'loading');
                this.querySelector('#dbtfy-review-scroll').onclick = () => {
                  this.setupReview(data.pagination.currentPage + 1);
                  this.querySelector('.loading__spinner').classList.remove('hidden');
                  this.querySelector('#dbtfy-review-scroll').classList.add('loading');
                };
              } else {
                this.querySelector('#dbtfy-review-scroll').classList.add('hidden');
              }
            }

            if (res.success == false || data.reviews.length === 0) {
              const reviewHtml = this.reviewNotFound.innerHTML;
              const reviewWrapper = this.reviewNotFound;
              const reviewclonedWrapper = reviewWrapper.content.cloneNode(true);
              const reviewtempContainer = document.createElement('div');
              reviewtempContainer.appendChild(reviewclonedWrapper);
              reviewtempContainer.querySelector('.review-not-found-wrapper').innerHTML = reviewHtml;

              this.querySelector('.reviewNotFound').innerHTML = '';
              this.querySelector('.reviewNotFound').insertAdjacentHTML('beforeend', reviewtempContainer.innerHTML);
              this.querySelector('.reviewsData').innerHTML = '';
            } else {
              this.querySelector('.reviewNotFound').innerHTML = '';

              const wrapper = this.querySelector('#review-wrapper-template');
              const clonedWrapper = wrapper.content.cloneNode(true);
              const tempContainer = document.createElement('div');
              tempContainer.appendChild(clonedWrapper);
              tempContainer.querySelector('.review-container').innerHTML = review_html;

              if (page == 1) {
                this.querySelector('.reviewsData').innerHTML = '';
                this.querySelector('.reviewsData').insertAdjacentHTML('beforeend', tempContainer.innerHTML);
              } else {
                if (this.sliderEnabled == 'none') {
                  this.querySelector('.reviewsData ul').insertAdjacentHTML('beforeend', review_html);
                } else {
                  this.querySelector('.reviewsData ul').insertAdjacentHTML('afterbegin', review_html);
                }
              }
              this.renderProgress(data.productRatings, data.pagination.totalReviews);
            }

            this.querySelector('.loading__spinner').classList.add('hidden');

            const reviewTab = document.querySelector('.product-tab-content .review-badge dtm-review-tab');
            if (reviewTab && !this.classList.contains('cloned')) {
              this.classList.add('cloned');
              reviewTab.innerHTML = '';
              reviewTab.appendChild(this);
            }
          });
      }

      formatDate(dateString) {
        // Create a Date object from the date string
        const date = new Date(dateString);

        // Extract the day, month, and year
        const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad with zero if needed
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad with zero
        const year = date.getUTCFullYear(); // Get full year

        // Replace format placeholders with actual values
        return this.dateformat.replace('dd', day).replace('mm', month).replace('yyyy', year);
      }

      renderProgress(review, totalReviews) {
        if (!review) {
          return;
        }

        const reviewCount = totalReviews || 1;

        this.ratingProgress.querySelectorAll('.progress-section').forEach((progressSection) => {
          const rating = progressSection.dataset.rating;
          const progress = progressSection.querySelector('.verified-progress');
          const star_count = progressSection.querySelector('.star_count');

          switch (rating) {
            case '1':
              progress.value = `${(review.one_star / reviewCount) * 100}`;
              star_count.setAttribute('data-review', review.one_star);
              break;
            case '2':
              progress.value = `${(review.two_stars / reviewCount) * 100}`;
              star_count.setAttribute('data-review', review.two_stars);
              break;
            case '3':
              progress.value = `${(review.three_stars / reviewCount) * 100}`;
              star_count.setAttribute('data-review', review.three_stars);
              break;
            case '4':
              progress.value = `${(review.four_stars / reviewCount) * 100}`;
              star_count.setAttribute('data-review', review.four_stars);
              break;
            case '5':
              progress.value = `${(review.five_stars / reviewCount) * 100}`;
              star_count.setAttribute('data-review', review.five_stars);
              break;
          }
        });

        this.querySelector('.review_based_on_text').setAttribute('data-review', totalReviews);
        this.querySelector('.rating-value').setAttribute('data-review', review.overallRating);
        this.querySelector('.rating-score .stars i').setAttribute('data-star', review.overallRating);
        this.querySelector('.review-counter').setAttribute('data-review', review.verifiedPurchases);

        if (totalReviews > 0) {
          this.sliderInit();
        }
      }

      renderReview(review, review_index) {
        const clone = this.itemTemplate.content.cloneNode(true);
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(clone);

        review.attachments = review.attachments || [];

        // loop mediaUrls and convert to img tag and add into one variable as a HTML
        let mediaHTML = '';
        let reviewMediaIndex = 0;
        review.attachments.forEach((mediaUrl) => {
          var reviewMediaID = reviewMediaIndex++;
          // check it's image
          if (this.showImages && mediaUrl.fileType == 'image') {
            mediaHTML += `<li id='Slide-${reviewMediaID}' class="splide__slide ratio image--ratio"><div class="media media-${this.mediaAspectRatio}"><img src="${mediaUrl.filePath}" alt="review-image" class="review-image" /></div></li>`;
          } else if (this.showVideos) {
            mediaHTML += `<li id="Slide-${reviewMediaID}" class="splide__slide ratio image--ratio"
            ><div class="media media-${this.mediaAspectRatio}"><video controls>
            <source src="${mediaUrl.filePath}" type="video/mp4">
            Your browser does not support the video tag.
          </video></div></li>`;
          }
        });

        let cloneHTML = Fastify.replaceVariables(tempContainer.innerHTML, {
          id: review_index,
          review_id: review.id || '',
          title: review.reviewTitle || '',
          body: review.reviewContent || '',
          rating: review.rating,
          reviewDate: this.formatDate(review.createdAt),
          reviewerName: review.reviewerName || '',
          avatar: review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'A',
          image_video: mediaHTML,
          upvote_counter: review.upvote || 0,
          downvote_counter: review.downvote || 0,
        });

        return cloneHTML;
      }

      submitReview(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.append('shopName', Fastify.permanent_domain);
        formData.append('productId', this.dataset.productId);

        this.submitButton.classList.add('loading');
        this.submitButton.querySelector('.loading__spinner').classList.remove('hidden');
        this.submitButton.disabled = true;

        if (this.mediaRequired) {
          if (this.mediaUrls) {
            this.mediaUrls.forEach((url) => {
              formData.append('mediaUrls[]', url);
            });
            this.mediaRequired.classList.add('hidden');
          } else {
            this.mediaRequired.classList.remove('hidden');
          }
        }

        fetch(this.reviewAPIs.addReview, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            this.submitButton.classList.remove('loading');
            this.submitButton.querySelector('.loading__spinner').classList.add('hidden');
            this.submitButton.disabled = false;

            if (data.success) {
              this.reviewWrapper.classList.add('hidden');
              this.thankYouMessageWrapper.classList.remove('hidden');
              this.setupReview();
            } else {
              if (!data.success) {
                this.reviewError.classList.remove('hidden');

                if (data.error.data) {
                  if (data.error.data.length > 0) {
                    let error_messages = '';
                    data.error.data.forEach((error) => {
                      error_messages += error.message + '<br>';
                    });
                    this.reviewError.innerHTML = error_messages.trim();
                  }
                } else {
                  this.reviewError.textContent = data.error.message;
                }
              }
            }
          });
      }
    }
  );
}
