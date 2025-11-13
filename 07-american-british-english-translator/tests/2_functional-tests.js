import * as chai from 'chai';

import { ELEMENT_SELECTORS } from '../public/constants/element-selectors.js';

const { assert } = chai;

suite('Functional Tests', () => {
  let clearButtonElement;
  let errorMessageElement;
  let textInputElement;
  let translateButtonElement;
  let translatedSentenceElement;

  suiteSetup(async () => {
    await import('../public/translator.js');

    clearButtonElement = document.getElementById(ELEMENT_SELECTORS.CLEAR_BUTTON_ID);
    errorMessageElement = document.getElementById(ELEMENT_SELECTORS.ERROR_MESSAGE_ID);
    textInputElement = document.getElementById(ELEMENT_SELECTORS.TEXT_INPUT_ID);
    translateButtonElement = document.getElementById(ELEMENT_SELECTORS.TRANSLATE_BUTTON_ID);
    translatedSentenceElement = document.getElementById(ELEMENT_SELECTORS.TRANSLATED_SENTENCE_ID);
  });

  suite('Function onTranslate()', () => {
    test('Translation appended to the `translated-sentence` `div`', () => {
      const input = 'Apples are my favorite fruit.';
      const output = 'Apples are my <span class="highlight">favourite</span> fruit.';

      textInputElement.value = input;
      translateButtonElement.click();

      assert.equal(translatedSentenceElement.innerHTML, output);
    });

    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", () => {
      const input = 'This text is the same as its translation';
      const output = 'Everything looks good to me!';

      textInputElement.value = input;
      translateButtonElement.click();

      assert.equal(translatedSentenceElement.innerHTML, output);
    });

    test("'Error: No text to translate.' message appended to the `error message` `div`", () => {
      const input = '';
      const output = 'Error: No text to translate.';

      textInputElement.value = input;
      translateButtonElement.click();

      assert.equal(translatedSentenceElement.innerHTML, '');
      assert.equal(errorMessageElement.innerText, output);
    });
  });

  suite('Function onClear()', () => {
    test('Text area, `translated-sentence`, and `error-msg` are cleared', () => {
      const content = 'Some content';

      errorMessageElement.innerText = content;
      textInputElement.value = content;
      translatedSentenceElement.innerText = content;
      clearButtonElement.click();

      assert.equal(errorMessageElement.innerText, '');
      assert.equal(textInputElement.value, '');
      assert.equal(translatedSentenceElement.innerHTML, '');
    });
  });
});
