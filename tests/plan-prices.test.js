import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPrices } from '../src/utils/planPrices.js';
import { plans } from '../src/data/plans.js';
const rows = ['basic','team','pro'].map((key,index)=>({key,amount:[249.5,449,699][index],currency:'INR',duration:'month'}));
test('all displays use server prices and preserve plan features', () => {
  const result=applyPrices(plans,rows);
  assert.equal(result.basic.amount,249.5);
  assert.equal(result.basic.display,'₹249.5 / month');
  assert.equal(result.pro.price,'₹699');
  assert.deepEqual(result.team.featureRows,plans.team.featureRows);
});
test('invalid or incomplete catalogs never fall back to a misleading fixed price', () => {
  for (const input of [null,[],rows.slice(1),[...rows,rows[0]],rows.map(row=>({...row,currency:'USD'})),rows.map(row=>({...row,amount:0}))]) {
    assert.throws(()=>applyPrices(plans,input));
  }
  assert.equal(plans.basic.amount,null);
});
