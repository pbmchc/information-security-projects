'use strict';

const CHARACTER_REGEX = require('../constants/regularExpressions');
const VALIDATION_ERRORS = require('../constants/validationErrors');
const {UNIT_MULTIPLIERS, UNIT_NAMES, UNITS} = require('../constants/units');

function ConvertHandler() {
  this.getNum = function(input) {
    if(!input.length) {
      return VALIDATION_ERRORS.INVALID;
    }

    const characterIndex = this._getCharacterIndex(input) || input.length;
    const parts = input.substr(0, characterIndex).split('/');

    return parts.length <= 2 ? this._calculateValue(parts) : VALIDATION_ERRORS.INVALID;
  };
  
  this.getUnit = function(input) {
    if(!input.length) {
      return VALIDATION_ERRORS.INVALID;
    }

    const characterIndex = this._getCharacterIndex(input);
    const unit = input.substr(characterIndex).toLowerCase();

    return UNIT_NAMES[unit] ? unit : VALIDATION_ERRORS.INVALID;
  };

  this.convert = function(value, unit) {
    const multiplier = UNIT_MULTIPLIERS[unit] || 1 / UNIT_MULTIPLIERS[this.getReturnUnit(unit)];
    const result = value * multiplier;

    return Number(result.toFixed(5));
  };
  
  this.getReturnUnit = function(sourceUnit) {
    const units = UNITS.find(tuple => tuple.includes(sourceUnit));

    if(!units) {
      return null;
    }
    
    return units.find(unit => unit !== sourceUnit);
  };
  
  this.getString = function(value, unit, returnValue, returnUnit) {
    const input = `${value} ${this._spellOutUnit(unit)}`;
    const result = `${returnValue} ${this._spellOutUnit(returnUnit)}`;

    return `${input} converts to ${result}`;
  };

  this.spellOutUnit = function(unit) {
    return UNIT_NAMES[unit];
  };

  this._calculateValue = function(parts) {
    const value = parts.reduce((prev, curr) => prev / curr);
    
    return !isNaN(value) ? value : VALIDATION_ERRORS.INVALID;
  }

  this._getCharacterIndex = function(input) {
    const match = CHARACTER_REGEX.exec(input);

    return match ? match.index : null;
  }
}

module.exports = ConvertHandler;
