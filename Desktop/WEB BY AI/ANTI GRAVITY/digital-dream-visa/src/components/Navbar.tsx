'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const navLinks = [
    { href: '#services', label: t('nav_services') },
    { href: '#visas', label: t('nav_visas') },
    { href: '#how-it-works', label: t('nav_how') },
    { href: '#testimonials', label: t('nav_testimonials') },
    { href: '#find-us', label: t('nav_find') },
  ];

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-bg-primary/95 backdrop-blur-md py-3 shadow-md border-b border-black/5 dark:border-white/5' : 'py-5 bg-transparent'
    )}>
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="Digital Dream Visa" width={40} height={40} className="rounded-lg object-cover" />
          <span className="font-heading font-bold text-lg text-text-primary whitespace-nowrap">
            Digital Dream <span className="gradient-text transition-all duration-300">Visa</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className={clsx(
          "hidden md:flex flex-row items-center gap-7 transition-all rtl:flex-row-reverse"
        )}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[14px] font-medium text-text-secondary hover:text-text-primary relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-btn after:transition-all after:duration-300 hover:after:w-full">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="#consultation" className="gradient-btn text-text-primary px-5 py-2.5 rounded-full text-[14px] font-semibold hover:shadow-[0_4px_20px_rgba(0,180,216,0.3)] hover:-translate-y-[1px] transition-all">
              {t('nav_cta')}
            </Link>
          </li>
        </ul>

        {/* Right Nav (Lang + Hamburger) */}
        <div className="flex items-center gap-4">
          <div className="flex bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full overflow-hidden p-0.5">
            {['en', 'fr', 'ar'].map((l) => (
              <button
                key={l}
                onClick={() => changeLocale(l)}
                className={clsx(
                  'px-3 py-1 text-xs font-semibold rounded-full transition-all tracking-wider uppercase',
                  locale === l ? 'gradient-btn text-text-primary' : 'text-text-muted hover:text-text-primary'
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          <button 
            className="md:hidden text-text-primary p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={clsx(
        'absolute top-full left-0 right-0 bg-bg-secondary/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 ease-in-out md:hidden',
        isMobileMenuOpen ? 'max-h-[400px] py-4' : 'max-h-0 py-0 border-transparent'
      )}>
        <ul className="flex flex-col items-center gap-4 px-5">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[16px] font-medium text-text-secondary hover:text-text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-2 w-full max-w-[200px]">
            <Link 
              href="#consultation" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-center gradient-btn text-text-primary px-5 py-3 rounded-full text-[15px] font-semibold"
            >
              {t('nav_cta')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
