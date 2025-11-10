import { CHARACTER_REGEX } from '../constants/regularExpressions.js';
import { UNIT_MULTIPLIERS, UNIT_NAMES, UNITS } from '../constants/units.js';
import { VALIDATION_ERRORS } from '../constants/validationErrors.js';

export class ConvertHandler {
  convert(value, unit) {
    const multiplier = UNIT_MULTIPLIERS[unit] || 1 / UNIT_MULTIPLIERS[this.getReturnUnit(unit)];
    const result = value * multiplier;

    return Number(result.toFixed(5));
  }

  getNum(input) {
    if (!input.length) {
      return VALIDATION_ERRORS.INVALID;
    }

    const characterIndex = this.#getCharacterIndex(input) || input.length;
    const parts = input.substr(0, characterIndex).split('/');

    return parts.length <= 2 ? this.#calculateValue(parts) : VALIDATION_ERRORS.INVALID;
  }

  getUnit(input) {
    if (!input.length) {
      return VALIDATION_ERRORS.INVALID;
    }

    const characterIndex = this.#getCharacterIndex(input);
    const unit = input.substr(characterIndex);

    return UNIT_NAMES[unit.toLowerCase()] ? unit : VALIDATION_ERRORS.INVALID;
  }

  getReturnUnit(sourceUnit) {
    const units = UNITS.find((tuple) => tuple.includes(sourceUnit.toLowerCase()));
    if (!units) {
      return null;
    }

    return units.find((unit) => unit !== sourceUnit);
  }

  getString(value, unit, returnValue, returnUnit) {
    const input = `${value} ${this.spellOutUnit(unit)}`;
    const result = `${returnValue} ${this.spellOutUnit(returnUnit)}`;

    return `${input} converts to ${result}`;
  }

  #calculateValue(parts) {
    const value = parts.reduce((prev, curr) => prev / curr);
    return !isNaN(value) ? Number(value) : VALIDATION_ERRORS.INVALID;
  }

  #getCharacterIndex(input) {
    const match = CHARACTER_REGEX.exec(input);
    return match ? match.index : null;
  }

  // Public for FCC testing purposes
  spellOutUnit(unit) {
    return UNIT_NAMES[unit.toLowerCase()];
  }
}
