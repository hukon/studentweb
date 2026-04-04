'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-bg-secondary pt-20 pb-8 border-t border-black/10 dark:border-white/10 mt-auto">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <Image src="/logo.png" alt="Digital Dream Visa" width={40} height={40} className="rounded-lg object-cover" />
              <span className="font-heading font-bold text-lg text-text-primary whitespace-nowrap">
                Digital Dream <span className="gradient-text">Visa</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              {t('footer_desc')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61571892927362" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61571892927362" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary/50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.682 7.199V22l3.382-1.853c.903.25 1.86.385 2.936.385 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.066 12.463l-2.545-2.715-4.97 2.715 5.46-5.798 2.61 2.715 4.9-2.715-5.455 5.798z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-text-primary mb-6 text-lg">{t('footer_quick')}</h4>
            <ul className="space-y-3">
              <li><Link href="#services" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('nav_services')}</Link></li>
              <li><Link href="#visas" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('nav_visas')}</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('nav_how')}</Link></li>
              <li><Link href="#consultation" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('nav_cta')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-text-primary mb-6 text-lg">{t('footer_visa_svc')}</h4>
            <ul className="space-y-3">
              <li><Link href="#visas" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('tab_china')} Visa</Link></li>
              <li><Link href="#visas" className="text-sm text-text-secondary hover:text-accent-light transition-colors">Schengen Visa</Link></li>
              <li><Link href="#visas" className="text-sm text-text-secondary hover:text-accent-light transition-colors">US Visa</Link></li>
              <li><Link href="#visas" className="text-sm text-text-secondary hover:text-accent-light transition-colors">UK Visa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-text-primary mb-6 text-lg">{t('footer_contact')}</h4>
            <ul className="space-y-4">
              <li>
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-text-muted uppercase tracking-wider">Agents via WhatsApp</div>
                  {[
                    { name: "Holi", wa: "213542163007" },
                    { name: "Messaoud", wa: "213554605561" },
                    { name: "Redha", wa: "213796257560" }
                  ].map(contact => (
                    <a 
                      key={contact.name}
                      href={`https://wa.me/${contact.wa}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-text-secondary hover:text-[#25D366] transition-colors flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                      {contact.name}
                    </a>
                  ))}
                </div>
              </li>
              <li className="text-sm text-text-secondary mt-2">digital.dream.visa@gmail.com</li>
              <li><a href="https://maps.app.goo.gl/ABvnVNxnUH5zhxG76" target="_blank" className="text-sm text-text-secondary hover:text-accent-light transition-colors">{t('find_directions')}</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Digital Dream Visa. {t('footer_rights')}
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            Crafted with <span className="text-accent-primary">✈</span> for world travelers
          </p>
        </div>

      </div>
    </footer>
  );
}
