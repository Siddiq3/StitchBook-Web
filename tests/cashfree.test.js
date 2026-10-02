import test from 'node:test';
import assert from 'node:assert/strict';
import {openCashfreeCheckout} from '../src/utils/cashfree.js';
test('Cashfree checkout uses server mode and session; completion is returned for server verification', async () => {
  let actualMode, actualOptions;
  global.window={Cashfree:({mode})=>{actualMode=mode;return {checkout:async options=>{actualOptions=options;return {paymentDetails:{paymentMessage:'Attempt complete'}};}};}};
  const result=await openCashfreeCheckout({paymentSessionId:'session_test',mode:'sandbox'});
  assert.equal(actualMode,'sandbox');assert.deepEqual(actualOptions,{paymentSessionId:'session_test',redirectTarget:'_self'});
  assert.ok(result.paymentDetails);
  await assert.rejects(openCashfreeCheckout({mode:'production'}),/incomplete/);
  await assert.rejects(openCashfreeCheckout({paymentSessionId:'session_test',mode:'wrong'}),/incomplete/);
  delete global.window;
});
