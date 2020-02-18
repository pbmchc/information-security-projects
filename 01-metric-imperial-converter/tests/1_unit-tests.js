const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

const VALIDATION_ERRORS = require('../constants/validationErrors');
const convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      const input = '32L';
      const expectedResult = 32;
  
      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    });
    
    test('Decimal Input', function(done) {
      const input = '32.25L';
      const expectedResult = 32.25;

      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    });
    
    test('Fractional Input', function(done) {
      const input = '2/5kg';
      const expectedResult = 0.4;

      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      const input = '2.5/5kg';
      const expectedResult = 0.5;

      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      const input = '4/2/2kg';
      const expectedResult = VALIDATION_ERRORS.INVALID;

      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    });
    
    test('No Numerical Input', function(done) {
      const input = 'kg';
      const expectedResult = VALIDATION_ERRORS.INVALID;

      assert.equal(convertHandler.getNum(input), expectedResult);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];

      input.forEach((element) => assert.equal(convertHandler.getUnit(element), element));
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      const unit = 'unk';
      const expectedResult = VALIDATION_ERRORS.INVALID;

      assert.equal(convertHandler.getUnit(unit), expectedResult);
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg'];
      const expect = ['l','gal','km','mi','kg','lbs'];
  
      input.forEach((element, index) => assert.equal(convertHandler.getReturnUnit(element), expect[index]));
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      const input = ['gal','l','mi','km','lbs','kg'];
      const expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];

      input.forEach((element, index) => assert.equal(convertHandler.spellOutUnit(element), expect[index]));
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      const input = [5, 'gal'];
      const expected = 18.9271;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
    test('L to Gal', function(done) {
      const input = [18, 'l'];
      const expected = 4.7550;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
    test('Mi to Km', function(done) {
      const input = [3, 'mi'];
      const expected = 4.8280;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
    test('Km to Mi', function(done) {
      const input = [10, 'km'];
      const expected = 6.2137;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
    test('Lbs to Kg', function(done) {
      const input = [15, 'lbs'];
      const expected = 6.8038;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
    test('Kg to Lbs', function(done) {
      const input = [10, 'kg'];
      const expected = 22.0462;

      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
    
  });

});