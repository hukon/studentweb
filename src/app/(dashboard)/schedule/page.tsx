"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarClock, Plus, Pencil, Trash2 } from 'lucide-react';
import styles from './schedule.module.css';

interface ClassRow {
  id: number;
  name: string;
}

interface ScheduleRow {
  id: number;
  class_id: number;
  class_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string | null;
  room: string | null;
}

interface FormState {
  id: number | null;
  class_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  room: string;
}

const CLASS_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
const TEACHER_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const ALL_DAYS = TEACHER_DAYS;

// 30-minute slots from 08:00 to 17:30
const TIME_SLOTS: string[] = [];
for (let h = 8; h <= 17; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`, `${String(h).padStart(2, '0')}:30`);
}

const hhmm = (t: string) => t.slice(0, 5);
const toMinutes = (t: string) => {
  const [h, m] = hhmm(t).split(':').map(Number);
  return h * 60 + m;
};

// Snap a start time down to its 30-minute slot so off-grid entries still render
const slotOf = (t: string) => {
  const mins = toMinutes(t);
  const snapped = mins - (mins % 30);
  return `${String(Math.floor(snapped / 60)).padStart(2, '0')}:${String(snapped % 60).padStart(2, '0')}`;
};

const emptyForm = (classId: string): FormState => ({
  id: null,
  class_id: classId,
  day_of_week: CLASS_DAYS[0],
  start_time: '08:00',
  end_time: '09:00',
  subject: '',
  teacher: '',
  room: '',
});

export default function SchedulePage() {
  const [view, setView] = useState<'class' | 'teacher'>('class');
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [classId, setClassId] = useState('');
  const [teacher, setTeacher] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const [cRes, sRes] = await Promise.all([fetch('/api/classes'), fetch('/api/schedules')]);
      if (!cRes.ok || !sRes.ok) throw new Error();
      const cls: ClassRow[] = await cRes.json();
      setClasses(cls);
      setSchedules(await sRes.json());
      setClassId(prev => prev || (cls[0] ? String(cls[0].id) : ''));
      setError('');
    } catch {
      setError('Impossible de charger les emplois du temps.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const teachers = Array.from(new Set(schedules.map(s => s.teacher).filter((t): t is string => !!t))).sort();
  const activeTeacher = teachers.includes(teacher) ? teacher : teachers[0] || '';

  const visible =
    view === 'class'
      ? schedules.filter(s => String(s.class_id) === classId)
      : schedules.filter(s => s.teacher === activeTeacher);
  const days = view === 'class' ? CLASS_DAYS : TEACHER_DAYS;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.end_time <= form.start_time) {
      setError("L'heure de fin doit être après l'heure de début.");
      return;
    }
    const url = form.id ? `/api/schedules/${form.id}` : '/api/schedules';
    const res = await fetch(url, {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Erreur lors de l'enregistrement.");
      return;
    }
    setForm(null);
    setError('');
    load();
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    const res = await fetch(`/api/schedules/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    if (!res.ok) {
      setError('Erreur lors de la suppression.');
      return;
    }
    load();
  };

  const openAdd = () => setForm(emptyForm(classId));
  const openEdit = (s: ScheduleRow) =>
    setForm({
      id: s.id,
      class_id: String(s.class_id),
      day_of_week: s.day_of_week,
      start_time: hhmm(s.start_time),
      end_time: hhmm(s.end_time),
      subject: s.subject,
      teacher: s.teacher || '',
      room: s.room || '',
    });

  // Build the grid: item at its start slot, with a rowspan; covered cells are skipped
  const starts = new Map<string, ScheduleRow>();
  const covered = new Set<string>();
  const sorted = [...visible].sort((a, b) => a.start_time.localeCompare(b.start_time));
  for (const s of sorted) {
    const startSlot = slotOf(s.start_time);
    const key = `${s.day_of_week}|${startSlot}`;
    if (starts.has(key) || covered.has(key)) continue; // overlapping entry: shown in the list view only
    const span = Math.max(1, Math.ceil((toMinutes(s.end_time) - toMinutes(startSlot)) / 30));
    starts.set(key, s);
    const idx = TIME_SLOTS.indexOf(startSlot);
    for (let i = 1; i < span && idx + i < TIME_SLOTS.length; i++) {
      covered.add(`${s.day_of_week}|${TIME_SLOTS[idx + i]}`);
    }
  }

  const renderItem = (s: ScheduleRow) => (
    <div className={styles.item}>
      <span className={styles.itemSubject}>{s.subject}</span>
      <span className={styles.itemMeta}>
        {hhmm(s.start_time)}–{hhmm(s.end_time)}
      </span>
      <span className={styles.itemMeta}>
        {view === 'teacher' ? s.class_name : s.teacher}
        {s.room ? ` · ${s.room}` : ''}
      </span>
      <div className={styles.itemActions}>
        <button className={styles.iconBtn} onClick={() => openEdit(s)} aria-label="Modifier">
          <Pencil size={14} />
        </button>
        <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteId(s.id)} aria-label="Supprimer">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  if (isLoading) return <div className="loader">Chargement...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Emploi du temps</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${view === 'class' ? styles.activeTab : ''}`} onClick={() => setView('class')}>
            Par classe
          </button>
          <button className={`${styles.tab} ${view === 'teacher' ? styles.activeTab : ''}`} onClick={() => setView('teacher')}>
            Par enseignant
          </button>
        </div>

        {view === 'class' ? (
          <select className={styles.select} value={classId} onChange={e => setClassId(e.target.value)} aria-label="Classe">
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <select className={styles.select} value={activeTeacher} onChange={e => setTeacher(e.target.value)} aria-label="Enseignant">
            {teachers.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        <button className={styles.addBtn} onClick={openAdd} disabled={classes.length === 0}>
          <Plus size={18} /> Ajouter un cours
        </button>
      </div>

      {classes.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>Créez d&apos;abord une classe dans « Classes &amp; Étudiants ».</div>
      ) : visible.length === 0 ? (
        <div className={`${styles.card} ${styles.empty}`}>
          {view === 'class'
            ? 'Aucun cours pour cette classe. Cliquez sur « Ajouter un cours ».'
            : 'Aucun enseignant renseigné. Ajoutez un cours avec un nom d’enseignant.'}
        </div>
      ) : (
        <>
          <div className={`${styles.card} ${styles.desktopOnly}`}>
            <div className={styles.tableWrap}>
              <table className={styles.timetable}>
                <thead>
                  <tr>
                    <th className={styles.timeSlot}>Heure</th>
                    {days.map(d => (
                      <th key={d}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(slot => (
                    <tr key={slot}>
                      <td className={styles.timeSlot}>{slot}</td>
                      {days.map(d => {
                        const key = `${d}|${slot}`;
                        if (covered.has(key)) return null;
                        const s = starts.get(key);
                        if (!s) return <td key={d} className={styles.cell} />;
                        const rows = Math.max(1, Math.ceil((toMinutes(s.end_time) - toMinutes(slotOf(s.start_time))) / 30));
                        const span = Math.min(rows, TIME_SLOTS.length - TIME_SLOTS.indexOf(slot));
                        return (
                          <td key={d} className={styles.cell} rowSpan={span}>
                            {renderItem(s)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.mobileOnly}>
            {days.map(d => {
              const list = visible.filter(s => s.day_of_week === d).sort((a, b) => a.start_time.localeCompare(b.start_time));
              return (
                <div key={d} className={`${styles.card} ${styles.dayCard}`}>
                  <div className={styles.dayTitle}>{d}</div>
                  {list.length === 0 ? (
                    <div className={styles.itemMeta}>Aucun cours</div>
                  ) : (
                    list.map(s => <div key={s.id} style={{ marginBottom: '0.5rem' }}>{renderItem(s)}</div>)
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {form && (
        <div className={styles.modalOverlay} onClick={() => setForm(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{form.id ? 'Modifier le cours' : 'Ajouter un cours'}</h2>
            <form onSubmit={save}>
              <div className={styles.formGroup}>
                <label>Classe</label>
                <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} required>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Jour</label>
                <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })} required>
                  {ALL_DAYS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Début</label>
                  <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Fin</label>
                  <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Matière</label>
                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label>Enseignant (optionnel)</label>
                <input type="text" value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Salle (optionnel)</label>
                <input type="text" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setForm(null)}>
                  Annuler
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {form.id ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Supprimer ce cours ?</h2>
            <p>Cette action est irréversible.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)}>
                Annuler
              </button>
              <button className={styles.deleteBtn} onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
