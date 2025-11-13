import * as chai from 'chai';
import { JSDOM } from 'jsdom';

import { TARGET_LOCALE } from '../public/constants/constants.js';

const { assert } = chai;

suite('Unit Tests', () => {
  let Translator;

  suiteSetup(async () => {
    const dom = await JSDOM.fromFile('./views/index.html');

    global.window = dom.window;
    global.document = dom.window.document;

    Translator = await import('../public/translator.js');
  });

  suite('Function translate()', () => {
    suite('American to British English', () => {
      test('Mangoes are my favorite fruit. --> Mangoes are my favourite fruit.', () => {
        const input = 'Mangoes are my favorite fruit.';
        const output = 'Mangoes are my favourite fruit.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('I ate yogurt for breakfast. --> I ate yoghurt for breakfast.', () => {
        const input = 'I ate yogurt for breakfast.';
        const output = 'I ate yoghurt for breakfast.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test("We had a party at my friend's condo. --> We had a party at my friend's flat.", () => {
        const input = "We had a party at my friend's condo.";
        const output = "We had a party at my friend's flat.";
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('Can you toss this in the trashcan for me? --> Can you toss this in the bin for me?', () => {
        const input = 'Can you toss this in the trashcan for me?';
        const output = 'Can you toss this in the bin for me?';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('The parking lot was full. --> The car park was full.', () => {
        const input = 'The parking lot was full.';
        const output = 'The car park was full.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('Like a high tech Rube Goldberg machine. --> Like a high tech Heath Robinson device.', () => {
        const input = 'Like a high tech Rube Goldberg machine.';
        const output = 'Like a high tech Heath Robinson device.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('To play hooky means to skip class or work. --> To bunk off means to skip class or work.', () => {
        const input = 'To play hooky means to skip class or work.';
        const output = 'To bunk off means to skip class or work.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('No Mr. Bond, I expect you to die. --> No Mr Bond, I expect you to die. ', () => {
        const input = 'No Mr. Bond, I expect you to die.';
        const output = 'No Mr Bond, I expect you to die.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('Dr. Grosh will see you now. --> Dr Grosh will see you now. ', () => {
        const input = 'Dr. Grosh will see you now.';
        const output = 'Dr Grosh will see you now.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });

      test('Lunch is at 12:15 today. --> Lunch is at 12.15 today.', () => {
        const input = 'Lunch is at 12:15 today.';
        const output = 'Lunch is at 12.15 today.';
        const { translation } = Translator.translate(input);

        assert.equal(translation, output);
      });
    });

    suite('British to American English', () => {
      test('We watched the footie match for a while. --> We watched the soccer match for a while.', () => {
        const input = 'We watched the footie match for a while.';
        const output = 'We watched the soccer match for a while.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('Paracetamol takes up to an hour to work. --> Tylenol takes up to an hour to work.', () => {
        const input = 'Paracetamol takes up to an hour to work.';
        const output = 'Tylenol takes up to an hour to work.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('First, caramelise the onions. --> First, caramelize the onions.', () => {
        const input = 'First, caramelise the onions.';
        const output = 'First, caramelize the onions.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('I spent the bank holiday at the funfair. --> I spent the public holiday at the carnival.', () => {
        const input = 'I spent the bank holiday at the funfair.';
        const output = 'I spent the public holiday at the carnival.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('I had a bicky then went to the chippy. --> I had a cookie then went to the fish-and-chip shop.', () => {
        const input = 'I had a bicky then went to the chippy.';
        const output = 'I had a cookie then went to the fish-and-chip shop.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test("I've just got bits and bobs in my bum bag. --> I've just got odds and ends in my fanny pack.", () => {
        const input = "I've just got bits and bobs in my bum bag.";
        const output = "I've just got odds and ends in my fanny pack.";
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('The car boot sale at Boxted Airfield was called off. --> The swap meet at Boxted Airfield was called off.', () => {
        const input = 'The car boot sale at Boxted Airfield was called off.';
        const output = 'The swap meet at Boxted Airfield was called off.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('Have you met Mrs Kalyani? --> Have you met Mrs. Kalyani?', () => {
        const input = 'Have you met Mrs Kalyani?';
        const output = 'Have you met Mrs. Kalyani?';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test("Prof Joyner of King's College, London. --> Prof. Joyner of King's College, London.", () => {
        const input = "Prof Joyner of King's College, London.";
        const output = "Prof. Joyner of King's College, London.";
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });

      test('Tea time is usually around 4 or 4.30. --> Tea time is usually around 4 or 4:30.', () => {
        const input = 'Tea time is usually around 4 or 4.30.';
        const output = 'Tea time is usually around 4 or 4:30.';
        const { translation } = Translator.translate(input, TARGET_LOCALE.US);

        assert.equal(translation, output);
      });
    });
  });
});
