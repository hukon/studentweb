'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import clsx from 'clsx';

export default function VisaTabs() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: t('tab_all'), flag: '' },
    { id: 'china', label: t('tab_china'), flag: '🇨🇳' },
    { id: 'europe', label: t('tab_europe'), flag: '🇪🇺' },
    { id: 'usa', label: t('tab_usa'), flag: '🇺🇸' },
    { id: 'uk', label: t('tab_uk'), flag: '🇬🇧' },
    { id: 'other', label: t('tab_other'), flag: '🌍' }
  ];

  const visas = [
    { id: 'china_tourist', cat: 'china', flag: '🇨🇳', title: 'china_tourist_title', desc: 'china_tourist_desc', proc: 'china_tourist_proc', dur: 'china_tourist_dur' },
    { id: 'china_biz', cat: 'china', flag: '🇨🇳', title: 'china_biz_title', desc: 'china_biz_desc', proc: 'china_tourist_proc', dur: '30-180 days' },
    { id: 'china_stu', cat: 'china', flag: '🇨🇳', title: 'china_stu_title', desc: 'china_stu_desc', proc: '7-10 days', dur: 'up_5_years' },
    { id: 'schen_tourist', cat: 'europe', flag: '🇪🇺', title: 'schen_tourist_title', desc: 'schen_tourist_desc', proc: '10-15 days', dur: 'up_90_days' },
    { id: 'schen_biz', cat: 'europe', flag: '🇪🇺', title: 'schen_biz_title', desc: 'schen_biz_desc', proc: '10-15 days', dur: 'up_90_days' },
    { id: 'eu_stu', cat: 'europe', flag: '🇪🇺', title: 'eu_stu_title', desc: 'eu_stu_desc', proc: '15-30 days', dur: '1-5 years' },
    { id: 'us', cat: 'usa', flag: '🇺🇸', title: 'us_title', desc: 'us_desc', proc: 'varies', dur: 'up_10_years' },
    { id: 'uk', cat: 'uk', flag: '🇬🇧', title: 'uk_title', desc: 'uk_desc', proc: 'uk_proc', dur: 'up_6_months' },
    { id: 'ca', cat: 'other', flag: '🇨🇦', title: 'ca_title', desc: 'ca_desc', proc: '14-30 days', dur: 'up_6_months' },
    { id: 'au', cat: 'other', flag: '🇦🇺', title: 'au_title', desc: 'au_desc', proc: '20-30 days', dur: 'up_12_months' }
  ];

  const filteredVisas = activeTab === 'all' ? visas : visas.filter(v => v.cat === activeTab);

  return (
    <section className="py-24" id="visas">
      <div className="max-w-[1200px] mx-auto px-5">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
            {t('visa_tag')}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t('visa_title_1')}<span className="gradient-text">{t('visa_title_2')}</span>
          </h2>
          <p className="text-base text-text-secondary max-w-[520px] mx-auto">
            {t('visa_subtitle')}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2',
                activeTab === tab.id 
                  ? 'bg-accent-primary/20 border-accent-primary shadow-[0_0_20px_rgba(0,180,216,0.2)] text-text-primary' 
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-text-muted hover:border-black/20 dark:border-white/20 hover:text-text-primary'
              )}
            >
              {tab.flag && <span>{tab.flag}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredVisas.map((visa) => {
              // Attempt to translate the proc/dur values if they exist as keys, else use the raw string
              // Some are hardcoded, but we can try to translate
              const rawDur = t.has(visa.dur) ? t(visa.dur as any) : visa.dur;
              const rawProc = t.has(visa.proc) ? t(visa.proc as any) : visa.proc;

              return (
                <motion.div
                  key={visa.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-bg-glass border border-black/5 dark:border-white/5 rounded-2xl p-7 relative overflow-hidden group hover:-translate-y-1 hover:border-accent-primary/20 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-accent-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="text-3xl mb-4">{visa.flag}</div>
                  <h3 className="font-heading text-lg font-semibold mb-2 text-text-primary">{t(visa.title as any)}</h3>
                  <p className="text-sm text-text-secondary mb-6 min-h-[60px]">{t(visa.desc as any)}</p>
                  
                  <ul className="space-y-2 mb-8">
                    <li className="flex justify-between items-center text-[0.85rem] border-b border-black/5 dark:border-white/5 pb-2">
                      <span className="text-text-muted">{t('processing')}</span>
                      <span className="font-medium text-text-primary">{rawProc}</span>
                    </li>
                    <li className="flex justify-between items-center text-[0.85rem]">
                      <span className="text-text-muted">{t('duration')}</span>
                      <span className="font-medium text-text-primary">{rawDur}</span>
                    </li>
                  </ul>

                  <Link href="#consultation" className="inline-flex w-full justify-center px-4 py-2 bg-gradient-btn text-text-primary text-xs font-semibold uppercase tracking-wide rounded-full hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,180,216,0.3)] transition-all">
                    {t('apply_now')}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
