'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function FindUs() {
  const t = useTranslations();

  return (
    <section className="py-24 border-t border-black/5 dark:border-white/5" id="find-us">
      <div className="max-w-[1200px] mx-auto px-5">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
            {t('find_tag')}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t('find_title_1')}<span className="gradient-text">{t('find_title_2')}</span>
          </h2>
          <p className="text-base text-text-secondary max-w-[520px] mx-auto">
            {t('find_subtitle')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-bg-glass border border-black/5 dark:border-white/5 rounded-[32px] p-2 md:p-4 flex flex-col lg:flex-row gap-6 relative"
        >
          {/* Map Container */}
          <div className="flex-1 min-h-[350px] md:min-h-[450px] relative rounded-[24px] overflow-hidden bg-text-primary/5">
            <iframe
              src="https://maps.google.com/maps?q=Digital+Dream+Visa,+El+Eulma&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Digital Dream Visa Location"
            />
          </div>

          {/* Info Container */}
          <div className="w-full lg:w-[400px] flex flex-col justify-center p-6 md:p-8 space-y-8">
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex flex-shrink-0 items-center justify-center border border-accent-primary/20">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-text-primary mb-2">{t('find_address_label')}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t('find_address')}<br/>
                  El Eulma, Sétif, Algeria
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex flex-shrink-0 items-center justify-center border border-accent-primary/20">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-text-primary mb-2">{t('find_hours_label')}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t('find_hours')}
                </p>
              </div>
            </div>

            <Link 
              href="https://maps.app.goo.gl/ABvnVNxnUH5zhxG76" 
              target="_blank" 
              className="mt-4 flex items-center justify-center gap-2 gradient-btn text-text-primary px-6 py-4 rounded-xl font-semibold shadow-[0_4px_24px_rgba(0,180,216,0.25)] hover:shadow-[0_8px_32px_rgba(0,180,216,0.35)] transition-all hover:-translate-y-0.5"
            >
              <Navigation size={20} />
              {t('find_directions')}
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
