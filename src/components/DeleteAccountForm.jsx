import { useEffect, useRef, useState } from 'react';
import api from '../api/client.js';
import { clearAuthSession, getAuthToken, getSavedUser } from '../api/authApi.js';

export default function DeleteAccountForm() {
  const [proof,setProof]=useState('');
  const [confirmation,setConfirmation]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const googleButton=useRef(null);
  useEffect(()=>{
    if (!getAuthToken()) return;
    let disposed=false;
    const initialize=()=>{
      if(disposed||!window.google?.accounts?.id||!googleButton.current) return;
      const clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if(!clientId||clientId.startsWith('your-')) {setMessage('Google re-authentication is not configured. Please contact support.');return;}
      window.google.accounts.id.initialize({client_id:clientId,auto_select:false,callback:result=>{setProof(result.credential);setMessage('Identity confirmed. Type DELETE to continue.');}});
      window.google.accounts.id.renderButton(googleButton.current,{theme:'outline',size:'large',text:'signin_with',width:280});
    };
    if(window.google?.accounts?.id) initialize();
    else {
      let script=document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if(!script){script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;document.head.appendChild(script);}
      script.addEventListener('load',initialize,{once:true});
    }
    return ()=>{disposed=true;};
  },[]);
  const run=async()=>{
    setBusy(true);
    try {
      let token=sessionStorage.getItem('stitchbook_deletion_token');
      if(!token){const result=await api.post('/user/delete-account',{googleIdToken:proof,confirmation});token=result.data.data.deletionToken;sessionStorage.setItem('stitchbook_deletion_token',token);sessionStorage.setItem('stitchbook_deletion_user',String(getSavedUser()?.id));}
      for(let count=0;count<30;count++){
        setMessage('Deletion is in progress. Keep this page open.');
        const result=await api.post('/user/delete-account',{}, {headers:{'x-deletion-token':token}});
        if(result.data.data.complete){sessionStorage.removeItem('stitchbook_deletion_token');sessionStorage.removeItem('stitchbook_deletion_user');clearAuthSession();setMessage('Your account and owned shop data have been deleted.');return;}
      }
      setMessage('Cleanup is still in progress. Continue to resume safely.');
    }catch(error){if([400,401].includes(error.response?.status)){sessionStorage.removeItem('stitchbook_deletion_token');setProof('');}setMessage(error.response?.data?.message||'Could not finish deletion. Please try again.');}
    finally{setBusy(false);}
  };
  if(!getAuthToken()&&!sessionStorage.getItem('stitchbook_deletion_token')) return <p className="mt-6"><a className="underline" href="/login?redirect=%2Fdelete-account">Sign in to delete your account</a></p>;
  return <section className="mt-8 border-t border-border pt-6">
    <h2 className="text-xl font-semibold">Permanently delete account</h2>
    <p className="mt-3 text-muted">Your profile and owned shop data will be permanently removed. Sign in again to confirm your identity. Staff deletion preserves the shop’s business records.</p>
    <div className="mt-4" ref={googleButton} />
    <label className="mt-5 block font-semibold" htmlFor="deletion-confirmation">Type DELETE to confirm</label>
    <input className="mt-2 min-h-12 w-full rounded-xl border border-border p-3" id="deletion-confirmation" value={confirmation} onChange={event=>setConfirmation(event.target.value)} autoComplete="off" disabled={busy} />
    <p className="mt-4" role="status">{message}</p>
    <button className="mt-4 min-h-12 rounded-xl bg-rosewood px-5 font-semibold text-white" disabled={busy||confirmation!=='DELETE'||(!proof&&!sessionStorage.getItem('stitchbook_deletion_token'))} onClick={run}>{busy?'Deleting…':'Delete / continue deletion'}</button>
  </section>;
}
