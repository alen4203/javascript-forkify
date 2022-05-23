import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';
import View from './View.js';

class CartView extends View {
  _parentEl = document.querySelector('.shopping-cart__list');
  _errorMsg =
    'No items in the shopping cart yet. Find a nice recipe and add the ingredients in :)';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerCheckIngredient(handler) {
    this._parentEl.addEventListener('change', function (e) {
      const cbox = e.target.closest('.ingredients__checkbox');
      if (!cbox) return;
      const ingDescription = cbox.parentElement.querySelector(
        '.ingredient-description'
      ).textContent;
      const ofRecipe = cbox.parentElement.dataset.recipeId;

      handler(ingDescription, ofRecipe);
    });
  }

  _generateMarkup(cart) {
    return cart.map(recipe => this._generateMarkupItem(recipe)).join('');
  }

  _generateMarkupItem(recipe) {
    return `
      <li class="shopping-cart__item">
        <div class="shopping-cart__item-title">
          <figure class="shopping-cart__item-fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <h4 class="shopping-cart__item-name">${recipe.title}</h4>
        </div>
        <ul class="shopping-cart__item-ingredients">
            ${recipe.ingredients
              .map(ing => this._generateMarkupIngredient(ing, recipe))
              .join('')}
        </ul>
      </li>
      `;
  }

  _generateMarkupIngredient(ing, recipe) {
    return `
        <li class="${ing.checked ? 'crossed' : ''}" data-recipe-id="${
      recipe.id
    }">
          <input
            type="checkbox"
            class="ingredients__checkbox"
            ${ing.checked ? 'checked' : ''}
          />
          <span>${ing.quantity ? fracty(ing.quantity).toString() : ''}</span>
          <span>${ing.unit}</span>
          <span class="ingredient-description">${ing.description}</span>
        </li>
      `;
  }
}

export default new CartView();
