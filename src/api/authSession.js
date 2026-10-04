const ACCESS='stitchbook_auth_token';
const REFRESH='stitchbook_refresh_token';
const USER='stitchbook_user';
export function saveTokens({token}) {
  if(token) sessionStorage.setItem(ACCESS,token);
  // Migrate away from legacy persistent bearer credentials.
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}
export function saveSession({token,user}) {
  const deletionOwner = sessionStorage.getItem('stitchbook_deletion_user');
  if (user && deletionOwner && String(user.id) !== deletionOwner) {
    sessionStorage.removeItem('stitchbook_deletion_token');
    sessionStorage.removeItem('stitchbook_deletion_user');
  }
  saveTokens({token});
  if(user) localStorage.setItem(USER,JSON.stringify(user));
}
export function getToken(){return sessionStorage.getItem(ACCESS);}
export function getUser(){try{return JSON.parse(localStorage.getItem(USER)||'null');}catch{return null;}}
export function clearSession(){
  sessionStorage.removeItem(ACCESS);
  sessionStorage.removeItem('stitchbook_payment_token');
  for(const key of [ACCESS,REFRESH,USER]) localStorage.removeItem(key);
}

export async function restoreSavedSession(requestSession) {
  if (getToken()) return;
  // A saved profile is a hint to attempt cookie-based restoration, never proof of authentication.
  if (!getUser()) return;
  try {
    const session = await requestSession();
    if (session?.token) saveTokens(session);
    else clearSession();
  } catch (error) {
    // A missing refresh cookie is returned as 400 by the backend.
    if ([400, 401, 403].includes(error.response?.status)) clearSession();
    else throw error;
  }
}
