import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query! Please try again :)';
  _message = '';

  _generateMarkup(results) {
    return results.map(res => previewView._generateMarkup(res)).join('');
  }
}

export default new ResultsView();
