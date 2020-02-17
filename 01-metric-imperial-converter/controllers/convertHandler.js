/*
*
*
*       Complete the handler logic below
*       
*       
*/

const {CHARACTER_REGEX, UNIT_MULTIPLIERS, UNIT_NAMES, UNITS} = require('./constants');

function ConvertHandler() {
  this.getNum = function(input) {
    const characterIndex = this._getCharacterIndex(input);

    if(characterIndex < 0) {
      return null;
    }

    return input.substr(0, characterIndex)
                .split('/')
                .reduce((prev, curr) => prev / curr);
  };
  
  this.getUnit = function(input) {
    const characterIndex = this._getCharacterIndex(input);

    return characterIndex >= 0
      ? input.substr(characterIndex)
      : null;
  };

  this.convert = function(value, unit) {
    const multiplier = UNIT_MULTIPLIERS[unit] || 1 / UNIT_MULTIPLIERS[this.getReturnUnit(unit)];
    const result = value * multiplier;

    return result.toFixed(5);
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

  this._spellOutUnit = function(unit) {
    return UNIT_NAMES[unit];
  };

  this._getCharacterIndex = function(input) {
    const match = CHARACTER_REGEX.exec(input);

    return match ? match.index : -1;
  }
}

module.exports = ConvertHandler;
