import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PreviewView extends View {
  _parentEl = '';

  _generateMarkup(data) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          id === data.id ? 'preview__link--active' : ''
        }" href="#${data.id}">
        <figure class="preview__fig">
            <img src="${data.image}" alt="${data.title}" />
        </figure>
        <div class="preview__data">
            <h4 class="preview__title">${data.title}</h4>
            <p class="preview__publisher">${data.publisher}</p>
            <div class="recipe__user-generated ${data.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
        </div>
        </a>
    </li>
  `;
  }
}

export default new PreviewView();
