'use client';

import { useTranslations } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { Link } from '@/i18n/routing';
import HeroCanvas from './HeroCanvas';
import { ArrowRight } from 'lucide-react';
import CountUp from './CountUp';

export default function Hero() {
  const t = useTranslations();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24" id="hero">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary z-0" />
      <HeroCanvas />
      
      {/* Overlay Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(0, 180, 216, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0, 119, 182, 0.05) 0%, transparent 50%)'
        }} 
      />

      <div className="relative z-20 max-w-[800px] px-5 text-center flex flex-col items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
          
          <motion.p variants={itemVariants} className="text-sm font-semibold tracking-[3px] uppercase text-accent-primary mb-5">
            {t('hero_tag')}
          </motion.p>
          
          <motion.h1 variants={itemVariants} className="font-heading text-4xl md:text-5xl lg:text-[4.5rem] font-extrabold leading-[1.1] mb-5 tracking-tight text-text-primary">
            {t('hero_title_1')}<br/>
            <span className="gradient-text">{t('hero_title_2')}</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-text-secondary max-w-[580px] mx-auto mb-9 leading-[1.8]">
            {t('hero_desc')}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mb-14">
            <Link href="#consultation" className="flex items-center gap-2 gradient-btn text-text-primary px-8 py-3.5 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,180,216,0.35)]">
              {t('hero_cta_1')}
              <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
            <Link href="#services" className="px-8 py-3.5 rounded-full border-[1.5px] border-accent-primary/30 text-accent-light font-semibold hover:bg-accent-primary/10 transition-all hover:-translate-y-0.5">
              {t('hero_cta_2')}
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="font-heading text-3xl font-bold gradient-text"><CountUp to={15000} duration={2} />+</div>
              <div className="text-[0.72rem] text-text-muted uppercase tracking-[1.5px] mt-1">{t('stat_visas')}</div>
            </div>
            <div className="w-px h-10 bg-black/10 dark:bg-white/10 hidden md:block" />
            <div className="flex flex-col items-center">
              <div className="font-heading text-3xl font-bold gradient-text"><CountUp to={98} duration={2} />%</div>
              <div className="text-[0.72rem] text-text-muted uppercase tracking-[1.5px] mt-1">{t('stat_rate')}</div>
            </div>
            <div className="w-px h-10 bg-black/10 dark:bg-white/10 hidden md:block" />
            <div className="flex flex-col items-center">
              <div className="font-heading text-3xl font-bold gradient-text"><CountUp to={50} duration={2} />+</div>
              <div className="text-[0.72rem] text-text-muted uppercase tracking-[1.5px] mt-1">{t('stat_countries')}</div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] uppercase tracking-[2px] text-text-muted">{t('scroll_down')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent-primary to-transparent animate-pulse" />
      </div>

    </section>
  );
}
