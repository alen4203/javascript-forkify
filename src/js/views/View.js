import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    this._data = data;
    this._clear();
    this._parentEl.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(this._data)
    );
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(this._data);
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // Only update different elements
      if (newEl.isEqualNode(curEl)) return;
      // Update text content
      if (newEl.firstChild?.nodeValue.trim() !== '')
        curEl.textContent = newEl.textContent;
      // Update attributes
      Array.from(newEl.attributes).forEach(att => {
        curEl.setAttribute(att.name, att.value);
      });
    });
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderErrorMessage(message = this._errorMsg) {
    const markup = `
          <div class="error">
          <div>
              <svg>
              <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
          <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  // Not used yet
  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
          <div>
              <svg>
              <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
