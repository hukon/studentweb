'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, CalendarCheck, Compass, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function Services() {
  const t = useTranslations();

  const services = [
    {
      id: 'app',
      icon: <FileText size={32} strokeWidth={1.5} />,
      titleRaw: 'svc_app_title',
      descRaw: 'svc_app_desc',
      linkRaw: 'svc_start'
    },
    {
      id: 'appt',
      icon: <CalendarCheck size={32} strokeWidth={1.5} />,
      titleRaw: 'svc_appt_title',
      descRaw: 'svc_appt_desc',
      linkRaw: 'svc_book',
      featured: true
    },
    {
      id: 'consult',
      icon: <Compass size={32} strokeWidth={1.5} />,
      titleRaw: 'svc_consult_title',
      descRaw: 'svc_consult_desc',
      linkRaw: 'svc_ask'
    },
    {
      id: 'doc',
      icon: <CheckCircle size={32} strokeWidth={1.5} />,
      titleRaw: 'svc_doc_title',
      descRaw: 'svc_doc_desc',
      linkRaw: 'svc_learn'
    }
  ];

  return (
    <section className="relative py-24 border-t border-black/5 dark:border-white/5" id="services">
      <div className="max-w-[1200px] mx-auto px-5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
            {t('services_tag')}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t('services_title_1')}<span className="gradient-text">{t('services_title_2')}</span>
          </h2>
          <p className="text-base text-text-secondary max-w-[520px] mx-auto">
            {t('services_subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative bg-bg-glass border border-black/5 dark:border-white/5 rounded-2xl p-8 md:p-9 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(0,180,216,0.15)] group hover:border-accent-primary/20 ${svc.featured ? 'bg-gradient-to-br from-accent-primary/5 to-transparent border-accent-primary/25' : ''}`}
            >
              {svc.featured && (
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-[0.65rem] font-semibold uppercase tracking-[1px] gradient-btn text-text-primary px-3.5 py-1 rounded-full z-10">
                  {t('most_popular')}
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/[0.06] to-accent-deep/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 mb-5">
                <div className="w-[56px] h-[56px] flex items-center justify-center bg-accent-primary/10 border border-accent-primary/15 rounded-2xl text-accent-primary group-hover:bg-accent-primary/20 group-hover:shadow-[0_0_24px_rgba(0,180,216,0.15)] transition-all duration-300">
                  {svc.icon}
                </div>
              </div>

              <h3 className="font-heading text-xl font-semibold mb-3 relative z-10 text-text-primary">
                {t(svc.titleRaw)}
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed mb-5 relative z-10">
                {t(svc.descRaw)}
              </p>

              <Link href="#consultation" className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-accent-primary relative z-10 group/link">
                <span className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1">
                  {t(svc.linkRaw)}
                </span>
                <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1 rtl:rotate-180" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
