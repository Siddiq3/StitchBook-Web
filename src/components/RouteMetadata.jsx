import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pages = {
  '/': ['Tailoring Shop App', 'Manage customers, measurements, orders, payments and delivery dates with StitchBook, built for Indian tailors and boutiques.'],
  '/about': ['About Us', 'Learn how StitchBook helps tailoring shops keep customer details, measurements, orders and payments together.'],
  '/terms': ['Terms & Support', 'Read the terms for using StitchBook and find contact details for subscription and account support.'],
  '/privacy': ['Privacy Policy', 'Learn how StitchBook handles your account information and tailoring shop data.'],
  '/delete-account': ['Delete Your Account', 'Find instructions to request or complete deletion of your StitchBook account and shop data.'],
  '/login': ['Sign In', 'Sign in to StitchBook with your email or mobile number to manage your account and subscription.'],
  '/register': ['Create an Account', 'Create your StitchBook account to start managing your tailoring shop.'],
  '/forgot-password': ['Reset Your Password', 'Recover access to your StitchBook account using an email verification code.'],
  '/dashboard': ['Your Account', 'View your StitchBook account and subscription status.'],
  '/billing': ['Plans & Billing', 'Choose, renew or upgrade your StitchBook subscription.'],
  '/checkout': ['Order Payment', 'Review your tailoring order and complete a secure payment.'],
  '/payment-success': ['Payment Result', 'View the result of your StitchBook order payment.'],
  '/payment-failure': ['Payment Incomplete', 'Find the next steps when your order payment could not be completed.'],
};
const publicPages = new Set(['/', '/about', '/privacy', '/terms']);

function setMeta(name, content) {
  let element = document.head.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function RouteMetadata() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const [title, description] = pages[path] || (/^\/upgrade\/session\/[^/]+$/.test(path)
      ? ['Upgrade Your Plan', 'Review and complete your StitchBook subscription upgrade.']
      : ['Page Not Found', 'This page could not be found. Return to StitchBook home or contact support.']);
    document.title = `StitchBook | ${title}`;
    setMeta('description', description);
    setMeta('robots', publicPages.has(path) ? 'index, follow' : 'noindex, follow');
  }, [pathname]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        let id;
        try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
        document.getElementById(id)?.scrollIntoView();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
