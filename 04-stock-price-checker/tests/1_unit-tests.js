import * as chai from 'chai';

import { toBoolean } from '../utils/booleanUtils.js';

const { assert } = chai;

suite('Unit Tests', () => {
  suite('Boolean Utils', () => {
    const falsyValues = ['false', false, null, undefined, 0, ''];
    const truthyValues = ['true', true, 'value', 10, {}, []];

    falsyValues.forEach((value) => {
      test('mapToBoolean should return false for falsy values', () => {
        assert.isFalse(toBoolean(value));
      });
    });

    truthyValues.forEach((value) => {
      test('mapToBoolean should return true for truthy values', () => {
        assert.isTrue(toBoolean(value));
      });
    });
  });
});
