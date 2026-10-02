import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');

test('web login links to password recovery',()=>{
  const login=read('src/pages/LoginPage.jsx');
  assert.match(login,/Forgot password\?/);
  assert.match(login,/to="\/forgot-password"/);
});

test('web recovery uses forgot/reset endpoints and three-step UI',()=>{
  const page=read('src/pages/ForgotPasswordPage.jsx');
  const api=read('src/api/authApi.js');
  const app=read('src/App.jsx');
  assert.match(page,/Send verification code/);
  assert.match(page,/Verification code/);
  assert.match(page,/Reset password/);
  assert.match(api,/\/auth\/forgot-password/);
  assert.match(api,/\/auth\/reset-password/);
  assert.match(app,/path="\/forgot-password"/);
});
