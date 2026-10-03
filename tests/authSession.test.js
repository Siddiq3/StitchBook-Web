import test from 'node:test';
import assert from 'node:assert/strict';
import {saveSession,getToken,getUser,clearSession,saveTokens,restoreSavedSession} from '../src/api/authSession.js';
function storage(){const data=new Map();return {data,setItem:(key,value)=>data.set(key,String(value)),getItem:key=>data.get(key)??null,removeItem:key=>data.delete(key)};}
test('web saves short-lived access in session storage and removes persistent refresh credentials',()=>{
  globalThis.localStorage=storage();globalThis.sessionStorage=storage();
  localStorage.setItem('stitchbook_refresh_token','legacy-secret');
  localStorage.setItem('stitchbook_auth_token','legacy-access');
  saveSession({token:'access',refreshToken:'never-store-this',user:{id:7}});
  assert.equal(getToken(),'access');assert.deepEqual(getUser(),{id:7});
  assert.equal(localStorage.getItem('stitchbook_refresh_token'),null);
  assert.equal(localStorage.getItem('stitchbook_auth_token'),null);
  assert.equal(sessionStorage.getItem('stitchbook_refresh_token'),null);
  saveTokens({token:'rotated',refreshToken:'still-not-stored'});
  assert.equal(getToken(),'rotated');clearSession();assert.equal(getToken(),null);assert.equal(getUser(),null);
});
test('corrupted saved profile does not crash account restore',()=>{
  localStorage.setItem('stitchbook_user','broken-json');assert.equal(getUser(),null);
});
test('switching accounts cannot resume another account deletion',()=>{
  sessionStorage.setItem('stitchbook_deletion_token','account-7-capability');
  sessionStorage.setItem('stitchbook_deletion_user','7');
  saveSession({token:'new-access',user:{id:8}});
  assert.equal(sessionStorage.getItem('stitchbook_deletion_token'),null);
  assert.equal(sessionStorage.getItem('stitchbook_deletion_user'),null);
});
test('signed-out visitors reach login without a refresh request', async () => {
  globalThis.localStorage=storage();globalThis.sessionStorage=storage();
  await restoreSavedSession(() => { assert.fail('Anonymous visitors must not call the backend'); });
  assert.equal(getToken(), null);
});
test('saved accounts restore their token from the refresh cookie', async () => {
  saveSession({user:{id:7}});
  await restoreSavedSession(async () => ({token:'restored-access'}));
  assert.equal(getToken(), 'restored-access');
  await restoreSavedSession(() => { assert.fail('An active session needs no restoration'); });
});
test('missing or expired refresh cookies clear the saved account for login', async () => {
  for (const status of [400,401,403]) {
    clearSession();saveSession({user:{id:7}});
    await restoreSavedSession(async () => { throw {response:{status}}; });
    assert.equal(getUser(),null);assert.equal(getToken(),null);
  }
});
test('connection failures preserve the saved account so restoration can be retried', async () => {
  saveSession({user:{id:7}});
  const error = new Error('Network unavailable');
  await assert.rejects(restoreSavedSession(async () => { throw error; }), error);
  assert.deepEqual(getUser(),{id:7});assert.equal(getToken(),null);
  await restoreSavedSession(async () => ({token:'retry-access'}));
  assert.equal(getToken(),'retry-access');
  clearSession();
});
