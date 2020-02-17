const UNITS = [['gal', 'L'], ['lbs', 'kg'], ['mi', 'km']];
const UNIT_MULTIPLIERS = {
  gal: 3.78541,
  lbs: 0.453592,
  mi: 1.60934
};
const UNIT_NAMES = {
  'gal': 'gallons',
  'L': 'liters',
  'mi': 'miles',
  'km': 'kilometers',
  'lbs': 'pounds',
  'kg': 'kilograms'
};

module.exports = {
  UNIT_MULTIPLIERS,
  UNIT_NAMES,
  UNITS
};