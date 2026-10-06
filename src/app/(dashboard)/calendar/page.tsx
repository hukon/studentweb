"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './calendar.module.css';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const res = await fetch('/api/calendar');
    const data = await res.json();
    setEvents(data);
    setIsLoading(false);
  };

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    
    await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, notes })
    });
    
    setTitle(''); setDate(''); setNotes('');
    fetchEvents();
  };

  const deleteEvent = async (id: number, title: string) => {
    if (!confirm(`Supprimer « ${title} » du calendrier ?`)) return;
    await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  if (isLoading) return <div className="loader">Chargement...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Calendrier scolaire</h1>
      </header>

      <div className={styles.grid}>
        <div className={styles.addSection}>
          <h2 className={styles.sectionTitle}>Nouvel événement</h2>
          <form className={styles.form} onSubmit={addEvent}>
            <div className={styles.formGroup}>
              <label>Titre de l'événement</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Notes (Optionnel)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>
              <Plus size={18} /> Ajouter au calendrier
            </button>
          </form>
        </div>

        <div className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Événements</h2>
          <div className={styles.eventsList}>
            {events.length === 0 ? (
              <p className={styles.empty}>Aucun événement programmé.</p>
            ) : (
              events.map(ev => {
                const dateObj = parseISO(ev.date.split('T')[0]);
                const isPast = dateObj < new Date();
                return (
                  <div key={ev.id} className={`${styles.eventCard} ${isPast ? styles.past : ''}`}>
                    <div className={styles.eventDate}>
                      <span className={styles.day}>{format(dateObj, 'dd', { locale: fr })}</span>
                      <span className={styles.month}>{format(dateObj, 'MMM', { locale: fr })}</span>
                    </div>
                    <div className={styles.eventDetails}>
                      <h3>{ev.title}</h3>
                      {ev.notes && <p>{ev.notes}</p>}
                    </div>
                    <button className={styles.deleteBtn} onClick={() => deleteEvent(ev.id, ev.title)} aria-label={`Supprimer ${ev.title}`} title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
