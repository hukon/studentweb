import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarClock, CalendarDays, Users } from 'lucide-react';
import { query } from '@/lib/db';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Tableau de bord | Suivi des élèves',
};

// Always show the live schedule for "today", never a build-time snapshot
export const dynamic = 'force-dynamic';

const TIME_ZONE = 'Africa/Algiers';

interface Lesson {
  id: number;
  class_name: string;
  subject: string;
  teacher: string | null;
  room: string | null;
  start_time: string;
  end_time: string;
}

interface EventRow {
  id: number;
  title: string;
  date: string;
  notes: string | null;
}

interface ClassOverview {
  id: number;
  name: string;
  students: number | string;
  with_difficulty: number | string;
  without_photo: number | string;
}

const hhmm = (t: string) => t.slice(0, 5);

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatEventDate(iso: string) {
  // iso is YYYY-MM-DD; format as a calendar date with no timezone shift
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
}

async function safe<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const now = new Date();
  const weekday = capitalize(new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: TIME_ZONE }).format(now));
  const longDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TIME_ZONE }).format(now);
  const nowTime = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TIME_ZONE }).format(now);

  const [lessons, events, classes] = await Promise.all([
    safe(
      query<Lesson>(
        `SELECT s.id, c.name AS class_name, s.subject, s.teacher, s.room, s.start_time, s.end_time
         FROM schedules s JOIN classes c ON s.class_id = c.id
         WHERE s.day_of_week = ? ORDER BY s.start_time`,
        [weekday]
      )
    ),
    safe(
      query<EventRow>(
        `SELECT id, title, CAST(date AS VARCHAR(10)) AS date, notes
         FROM holidays WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 5`
      )
    ),
    safe(
      query<ClassOverview>(
        `SELECT c.id, c.name,
                COUNT(s.id) AS students,
                COUNT(CASE WHEN COALESCE(s.comprehension_orale,0) + COALESCE(s.ecriture,0) + COALESCE(s.vocabulaire,0)
                                + COALESCE(s.grammaire,0) + COALESCE(s.conjugaison,0) + COALESCE(s.production_ecrite,0) > 0
                           THEN 1 END) AS with_difficulty,
                COUNT(CASE WHEN s.id IS NOT NULL AND s.photo IS NULL THEN 1 END) AS without_photo
         FROM classes c LEFT JOIN students s ON s.class_id = c.id
         GROUP BY c.id, c.name ORDER BY c.name`
      )
    ),
  ]);

  const totalStudents = classes.reduce((n, c) => n + Number(c.students), 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{weekday}</h1>
        <p>{longDate}</p>
      </header>

      {classes.length === 0 ? (
        <section className={styles.firstRun}>
          <Users size={32} />
          <h2>Commencez par créer une classe</h2>
          <p>Ajoutez vos classes et vos élèves, puis l&apos;emploi du temps et les évaluations apparaîtront ici.</p>
          <Link href="/classes" className={styles.primaryLink}>
            Créer une classe <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <>
          <div className={styles.columns}>
            <section className={styles.panel} aria-labelledby="lessons-title">
              <div className={styles.panelHead}>
                <h2 id="lessons-title">
                  <CalendarClock size={18} /> Cours d&apos;aujourd&apos;hui
                </h2>
                <Link href="/schedule" className={styles.panelLink}>
                  Emploi du temps
                </Link>
              </div>
              {lessons.length === 0 ? (
                <p className={styles.empty}>
                  Aucun cours prévu ce {weekday.toLowerCase()}. <Link href="/schedule">Ajouter un cours</Link>
                </p>
              ) : (
                <ul className={styles.lessons}>
                  {lessons.map(l => {
                    const start = hhmm(l.start_time);
                    const end = hhmm(l.end_time);
                    const state = nowTime >= end ? 'past' : nowTime >= start ? 'now' : 'next';
                    return (
                      <li key={l.id} className={`${styles.lesson} ${state === 'past' ? styles.past : ''}`}>
                        <div className={styles.time}>
                          <span>{start}</span>
                          <span className={styles.timeEnd}>{end}</span>
                        </div>
                        <div className={styles.lessonBody}>
                          <span className={styles.subject}>{l.subject}</span>
                          <span className={styles.lessonMeta}>
                            {l.class_name}
                            {l.room ? ` · Salle ${l.room}` : ''}
                            {l.teacher ? ` · ${l.teacher}` : ''}
                          </span>
                        </div>
                        {state === 'now' && <span className={styles.badge}>En cours</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className={styles.panel} aria-labelledby="events-title">
              <div className={styles.panelHead}>
                <h2 id="events-title">
                  <CalendarDays size={18} /> À venir
                </h2>
                <Link href="/calendar" className={styles.panelLink}>
                  Calendrier
                </Link>
              </div>
              {events.length === 0 ? (
                <p className={styles.empty}>
                  Aucun événement prévu. <Link href="/calendar">Ajouter un événement</Link>
                </p>
              ) : (
                <ul className={styles.events}>
                  {events.map(ev => (
                    <li key={ev.id} className={styles.event}>
                      <span className={styles.eventDate}>{formatEventDate(ev.date)}</span>
                      <span className={styles.eventTitle}>{ev.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className={styles.panel} aria-labelledby="classes-title">
            <div className={styles.panelHead}>
              <h2 id="classes-title">
                <Users size={18} /> Mes classes
                <span className={styles.count}>{totalStudents} élève{totalStudents > 1 ? 's' : ''}</span>
              </h2>
              <Link href="/classes" className={styles.panelLink}>
                Gérer
              </Link>
            </div>
            <ul className={styles.classRows}>
              {classes.map(c => {
                const diff = Number(c.with_difficulty);
                const nophoto = Number(c.without_photo);
                return (
                  <li key={c.id}>
                    <Link href="/classes" className={styles.classRow}>
                      <span className={styles.classRowName}>{c.name}</span>
                      <span className={styles.classRowStat}>
                        {Number(c.students)} élève{Number(c.students) > 1 ? 's' : ''}
                      </span>
                      <span className={styles.classRowStat}>{diff > 0 ? `${diff} en difficulté` : 'Aucune difficulté signalée'}</span>
                      <span className={nophoto > 0 ? styles.classRowTodo : styles.classRowStat}>
                        {nophoto > 0 ? `${nophoto} photo${nophoto > 1 ? 's' : ''} à ajouter` : 'Photos complètes'}
                      </span>
                      <ArrowRight size={16} className={styles.classRowArrow} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
