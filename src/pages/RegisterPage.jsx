import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/Logo.jsx';
import { registerWithPassword } from '../api/authApi.js';

const validEmail=(value)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value||'').trim());
const validPhone=(value)=>{const d=String(value||'').replace(/\D/g,'');return d.length===10||(d.length===12&&d.startsWith('91'));};
const validPassword=(value)=>String(value||'').length>=8&&/[A-Za-z]/.test(value)&&/\d/.test(value);

export default function RegisterPage(){
  const navigate=useNavigate();
  const [form,setForm]=useState({name:'',email:'',phone:'',password:'',confirm:''});
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const set=(key)=>(event)=>{setForm(prev=>({...prev,[key]:event.target.value}));setError('');};

  const submit=async(event)=>{
    event.preventDefault();
    if(form.name.trim().length<2){setError('Enter your name.');return;}
    if(!validEmail(form.email)){setError('Enter a valid email address.');return;}
    if(!validPhone(form.phone)){setError('Enter a valid 10-digit mobile number.');return;}
    if(!validPassword(form.password)){setError('Password must be at least 8 characters with a letter and a number.');return;}
    if(form.password!==form.confirm){setError("Passwords don't match.");return;}
    setLoading(true);setError('');
    try{
      await registerWithPassword({
        name:form.name.trim(),
        email:form.email.trim().toLowerCase(),
        phone:form.phone.trim(),
        password:form.password,
      },{name:navigator.userAgent});
      navigate('/dashboard',{replace:true});
    }catch(err){
      setError(err.response?.data?.message||err.message||'Could not create account');
    }finally{setLoading(false);}
  };

  return <main className="auth-page auth-register brand-soft min-h-screen text-ink">
    <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="surface-card order-last rounded-3xl bg-white p-6 sm:p-8 lg:order-first">
        <div className="flex items-center gap-3"><LogoMark/><div><p className="text-2xl font-semibold">StitchBook</p><p className="text-sm text-muted">Tailoring shop manager</p></div></div>
        <h1 className="mt-7 text-4xl font-semibold leading-tight">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Use the same email, mobile number and password on StitchBook mobile and web.</p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Your name</span><input className="w-full rounded-xl border border-ink/15 px-4 py-3.5 outline-none focus:border-brass focus:ring-4 focus:ring-brass/10" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Full name"/></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><input className="w-full rounded-xl border border-ink/15 px-4 py-3.5 outline-none focus:border-brass focus:ring-4 focus:ring-brass/10" autoComplete="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com"/></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Mobile number</span><input className="w-full rounded-xl border border-ink/15 px-4 py-3.5 outline-none focus:border-brass focus:ring-4 focus:ring-brass/10" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="98765 43210"/></label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <div className="flex items-center rounded-xl border border-ink/15 pr-3 focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10">
              <input className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 outline-none" autoComplete="new-password" type={showPassword?'text':'password'} value={form.password} onChange={set('password')} placeholder="Create a password"/>
              <button type="button" className="rounded-lg p-2 text-muted hover:bg-bone" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button>
            </div>
            <p className="mt-2 text-xs text-muted">8 or more characters, with a letter and a number.</p>
          </label>
          <label className="block"><span className="mb-2 block text-sm font-semibold">Confirm password</span><input className="w-full rounded-xl border border-ink/15 px-4 py-3.5 outline-none focus:border-brass focus:ring-4 focus:ring-brass/10" autoComplete="new-password" type={showPassword?'text':'password'} value={form.confirm} onChange={set('confirm')} placeholder="Re-enter your password"/></label>

          {error?<div role="alert" className="rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">{error}</div>:null}
          <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={loading} type="submit">{loading?'Creating account…':'Create account'}</button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-brass hover:underline" to="/login">Sign in</Link></p>
      </div>

      <div className="brand-solid relative overflow-hidden rounded-3xl p-7 text-white sm:p-9">
        <div className="absolute inset-0 bg-brass/80"/>
        <div className="relative flex min-h-[26rem] flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold"><ShieldCheck size={16}/>Secure account setup</span>
          <div><h2 className="text-4xl font-semibold leading-tight">Your business data stays attached to one identity.</h2><p className="mt-5 max-w-xl text-base leading-7 text-white/80">Email and mobile number are both stored on the account, so either can be used to sign in with your password.</p></div>
          <p className="text-sm font-semibold text-white/80">Phone OTP and email OTP can be added later without changing the core account model.</p>
        </div>
      </div>
    </section>
  </main>;
}
