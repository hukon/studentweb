'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { submitConsultation } from '@/app/actions';

export default function ConsultationForm() {
  const t = useTranslations();
  const [state, formAction, isPending] = useActionState(submitConsultation as any, null) as [any, (payload: FormData) => void, boolean];
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <section className="py-24" id="consultation">
      <div className="max-w-[1200px] mx-auto px-5">
        
        <div className="bg-bg-glass border border-black/5 dark:border-white/5 rounded-[32px] p-6 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 relative z-10">
            
            {/* Info Side */}
            <div className="lg:col-span-2">
              <span className="inline-block text-[0.75rem] font-semibold uppercase tracking-[3px] text-accent-primary bg-accent-primary/10 px-5 py-2 rounded-full border border-accent-primary/20 mb-5">
                {t('consult_tag')}
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-4 text-text-primary">
                {t('consult_title_1')}<span className="gradient-text">{t('consult_title_2')}</span>
              </h2>
              <p className="text-[0.95rem] text-text-secondary leading-[1.8] mb-10">
                {t('consult_desc')}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-accent-light flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:border-accent-primary/30 group-hover:-translate-y-1 transition-all flex-shrink-0 mt-1">
                    <Phone size={20} />
                  </div>
                  <div className="w-full">
                    <div className="text-xs uppercase tracking-wider text-text-muted mb-3">{t('contact_call')}</div>
                    
                    <div className="space-y-3">
                      {[
                        { name: "Holi", number: "0542163007", wa: "213542163007" },
                        { name: "Messaoud", number: "0554605561", wa: "213554605561" },
                        { name: "Redha", number: "0796257560", wa: "213796257560" }
                      ].map(contact => (
                        <div key={contact.name} className="flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-text-primary whitespace-nowrap min-w-[70px]">
                            {contact.name}:
                          </span>
                          <span className="text-text-secondary whitespace-nowrap">
                            {contact.number}
                          </span>
                          <a 
                            href={`https://wa.me/${contact.wa}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-accent-light flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:border-accent-primary/30 group-hover:-translate-y-1 transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-muted mb-1">{t('contact_email')}</div>
                    <div className="font-semibold text-text-primary/90">digital.dream.visa@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-accent-light flex items-center justify-center group-hover:bg-accent-primary/20 group-hover:border-accent-primary/30 group-hover:-translate-y-1 transition-all">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-muted mb-1">{t('contact_visit')}</div>
                    <div className="font-semibold text-text-primary/90">{t('contact_address')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:col-span-3">
              {state?.success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full bg-bg-primary/50 border border-green-500/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">{t('form_thanks')}</h3>
                  <p className="text-text-secondary">{t('form_success_msg')}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:bg-white/5 text-sm font-medium transition-colors"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form action={formAction} ref={formRef} className="space-y-5">
                  
                  {state?.error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {state.error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fullName" className="text-[0.85rem] font-medium text-text-secondary">{t('form_name')}</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        placeholder="John Doe" 
                        required 
                        className="w-full bg-bg-primary border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                      />
                      {state?.validationErrors?.fullName && <span className="text-xs text-red-400">{state.validationErrors.fullName[0]}</span>}
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-[0.85rem] font-medium text-text-secondary">{t('form_email')}</label>
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="john@example.com" 
                        required 
                        className="w-full bg-bg-primary border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                      />
                      {state?.validationErrors?.email && <span className="text-xs text-red-400">{state.validationErrors.email[0]}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-[0.85rem] font-medium text-text-secondary">{t('form_phone')}</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        id="phone" 
                        placeholder="+1 (555) 000-0000" 
                        className="w-full bg-bg-primary border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="visaType" className="text-[0.85rem] font-medium text-text-secondary">{t('form_visa')}</label>
                      <select 
                        name="visaType" 
                        id="visaType" 
                        required 
                        defaultValue=""
                        className="w-full bg-bg-primary border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors appearance-none"
                      >
                        <option value="" disabled>{t('form_select')}</option>
                        <option value="china-tourist">China Tourist Visa (L)</option>
                        <option value="china-business">China Business Visa (M)</option>
                        <option value="china-student">China Student Visa (X)</option>
                        <option value="schengen-tourist">Schengen Tourist Visa</option>
                        <option value="schengen-business">Schengen Business Visa</option>
                        <option value="europe-student">Europe Student Visa</option>
                        <option value="us-b1b2">US B1/B2 Visa</option>
                        <option value="uk-visitor">UK Standard Visitor Visa</option>
                        <option value="canada">Canada Visitor Visa</option>
                        <option value="australia">Australia Visitor Visa</option>
                        <option value="other">Other</option>
                      </select>
                      {state?.validationErrors?.visaType && <span className="text-xs text-red-400">{state.validationErrors.visaType[0]}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-[0.85rem] font-medium text-text-secondary">{t('form_message')}</label>
                    <textarea 
                      name="message" 
                      id="message" 
                      rows={5}
                      placeholder="Tell us about your travel plans..." 
                      required 
                      className="w-full bg-bg-primary border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none"
                    />
                    {state?.validationErrors?.message && <span className="text-xs text-red-400">{state.validationErrors.message[0]}</span>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full gradient-btn text-text-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_8px_24px_rgba(0,180,216,0.25)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : null}
                    {t('form_submit')}
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
