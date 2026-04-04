'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const t = useTranslations();

  const steps = [
    {
      num: '01',
      title: 'step1_title',
      desc: 'step1_desc',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'step2_title',
      desc: 'step2_desc',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'step3_title',
      desc: 'step3_desc',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-24 bg-bg-secondary relative border-t border-black/5 dark:border-white/5" id="how-it-works">
      <div className="max-w-[1200px] mx-auto px-5">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
            {t('how_tag')}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t('how_title_1')}<span className="gradient-text">{t('how_title_2')}</span>
          </h2>
          <p className="text-base text-text-secondary max-w-[520px] mx-auto">
            {t('how_subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-5 relative">
          
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="flex flex-col items-center text-center relative z-10 w-full lg:w-1/3"
            >
              <div className="w-[120px] h-[120px] rounded-full bg-bg-primary border-4 border-bg-secondary shadow-[0_0_40px_rgba(0,180,216,0.1)] flex items-center justify-center text-accent-light mb-8 relative transition-transform duration-500 hover:scale-105 hover:text-accent-primary">
                {step.icon}
                <div className="absolute -top-2 -right-2 bg-gradient-btn w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-text-primary text-sm shadow-md">
                  {step.num}
                </div>
              </div>
              
              <h3 className="font-heading text-xl font-semibold mb-4 text-text-primary">{t(step.title as any)}</h3>
              <p className="text-[0.95rem] text-text-secondary leading-[1.8] max-w-[340px] mx-auto">{t(step.desc as any)}</p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
