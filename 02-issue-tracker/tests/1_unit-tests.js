const chai = require('chai');
const assert = chai.assert;
const {assignDateConditions, hasFieldValues} = require('../utils/validatorUtils');

const EMPTY_ISSUE = {_id: 'ID'};

suite('Unit Tests', () => {
    suite('hasFieldValues', () => {
        test('entity with field values', (done) => {
            const issue = {...EMPTY_ISSUE, issue_title: 'TITLE', issue_text: 'TEXT'};
            const result = hasFieldValues(issue);
            
            assert.isTrue(result);
            done();
        });
        
        test('empty entity', (done) => {
            const result = hasFieldValues(EMPTY_ISSUE);
            
            assert.isFalse(result);
            done();
        });  
      });

      suite('assignDateConditions', () => {
        test('date field value available', (done) => {
            const created_on = '2020-02-20';
            const conditions = {created_on};
            const expectedResult = {
                created_on: {
                    $gt: new Date(created_on),
                    $lt: new Date('2020-02-21')
                }
            };

            assignDateConditions('created_on', conditions);

            assert.deepEqual(conditions, expectedResult);
            done();
        });
        
        test('date field value missing', (done) => {
            const conditions = {created_on: ''};
            const expectedResult = {...conditions};
            
            assignDateConditions('created_on', conditions);

            assert.deepEqual(conditions, expectedResult);
            done();
        });  
      });
});
