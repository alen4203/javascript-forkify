import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup(search) {
    const curPage = search.page;
    const totalPage = Math.ceil(search.results.length / search.resultsPerPage);
    // Page 1, and there are other pages
    if (curPage === 1 && totalPage > 1)
      return `${this._generateMarkupBtn(
        curPage,
        1
      )}${this._generateMarkupTotalPages(totalPage)}`;
    // Last page
    if (curPage === totalPage && totalPage > 1)
      return `${this._generateMarkupBtn(
        curPage,
        -1
      )}${this._generateMarkupTotalPages(totalPage)}`;
    // Other page
    if (curPage < totalPage)
      return `${this._generateMarkupBtn(
        curPage,
        -1
      )}${this._generateMarkupTotalPages(totalPage)}${this._generateMarkupBtn(
        curPage,
        1
      )}`;
    // Page 1, and there are NO other pages
    return `${this._generateMarkupTotalPages(totalPage)}`;
  }
  _generateMarkupBtn(curPage, next) {
    return `
        <button data-goto="${
          curPage + next
        }" class="btn--inline pagination__btn--${next > 0 ? 'next' : 'prev'}">
            <span>Page ${curPage + next}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${
      next > 0 ? 'right' : 'left'
    }"></use>
            </svg>
        </button>
    `;
  }
  _generateMarkupTotalPages(total) {
    return `<span class="total-pages">${total} ${
      total > 1 ? 'Pages' : 'Page'
    }</span>`;
  }
}

export default new PaginationView();
