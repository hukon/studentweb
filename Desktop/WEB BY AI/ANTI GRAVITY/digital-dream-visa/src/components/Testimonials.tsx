'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Testimonials() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    { text: 'review_1', author: 'Amira K.', visa: 'review_1_visa', avatar: 'AK' },
    { text: 'review_2', author: 'Mohamed B.', visa: 'review_2_visa', avatar: 'MB' },
    { text: 'review_3', author: 'Sara L.', visa: 'review_3_visa', avatar: 'SL' },
    { text: 'review_4', author: 'Youssef D.', visa: 'review_4_visa', avatar: 'YD' }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-24 relative overflow-hidden border-t border-black/5 dark:border-white/5" id="testimonials">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
            {t('test_tag')}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-4 text-text-primary">
            {t('test_title_1')}<span className="gradient-text">{t('test_title_2')}</span>
          </h2>
          <p className="text-base text-text-secondary max-w-[520px] mx-auto">
            {t('test_subtitle')}
          </p>
        </motion.div>

        <div className="max-w-[800px] mx-auto relative cursor-grab active:cursor-grabbing">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
            >
              {reviews.map((rev, i) => (
                <div key={i} className="min-w-full px-4">
                  <div className="bg-bg-glass border border-black/5 dark:border-white/5 rounded-2xl p-8 md:p-12 text-center relative hover:border-black/10 dark:border-white/10 transition-colors">
                    <div className="text-accent-primary text-2xl tracking-widest mb-6">★★★★★</div>
                    <p className="text-lg md:text-xl font-medium leading-[1.8] text-text-primary/90 mb-10 italic">
                      {t(rev.text as any)}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-btn flex items-center justify-center font-heading font-bold text-text-primary shadow-md">
                        {rev.avatar}
                      </div>
                      <div className="text-start rtl:text-end">
                        <div className="font-heading font-bold text-text-primary text-[1.05rem]">{rev.author}</div>
                        <div className="text-[0.8rem] text-accent-light">{t(rev.visa as any)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center items-center gap-6 mt-10">
            <button onClick={handlePrev} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary/70 hover:bg-black/5 dark:bg-white/5 hover:text-text-primary transition-all">
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={clsx(
                    "w-2 h-2 rounded-full transition-all duration-300", 
                     i === currentIndex ? "w-8 bg-accent-primary" : "bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:bg-white/40"
                  )} 
                />
              ))}
            </div>
            <button onClick={handleNext} className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary/70 hover:bg-black/5 dark:bg-white/5 hover:text-text-primary transition-all">
              <ChevronRight size={20} className="rtl:rotate-180" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
