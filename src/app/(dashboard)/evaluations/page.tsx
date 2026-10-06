"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Check } from 'lucide-react';
import Avatar from '@/components/Avatar';
import styles from './evaluations.module.css';

interface ClassRow {
  id: number;
  name: string;
}

type Grade = 'A' | 'B' | 'C' | 'D';

interface EvalRow {
  student_id: number;
  student_name: string;
  has_photo: boolean;
  photo_updated_at: string | null;
  [key: string]: string | number | boolean | null;
}

const GROUPS = [
  { label: 'Oral', keys: ['oral_1', 'oral_2', 'oral_3'] },
  { label: 'Lecture', keys: ['reading_1', 'reading_2', 'reading_3'] },
  { label: 'Compréhension', keys: ['comp_1', 'comp_2', 'comp_3'] },
  { label: 'Production écrite', keys: ['prod_1', 'prod_2', 'prod_3', 'prod_4'] },
  { label: 'Bilan', keys: ['global_mastery'] },
];

const COLUMNS = GROUPS.flatMap(g =>
  g.keys.map((key, i) => ({ key, label: g.keys.length === 1 ? 'Global' : String(i + 1), group: g.label }))
);

const GRADES: { grade: Grade; meaning: string }[] = [
  { grade: 'A', meaning: 'Très satisfaisante' },
  { grade: 'B', meaning: 'Satisfaisante' },
  { grade: 'C', meaning: 'Fragile' },
  { grade: 'D', meaning: 'Insuffisante' },
];

const snapshot = (rows: EvalRow[]) => JSON.stringify(rows.map(r => COLUMNS.map(c => r[c.key] || '')));

export default function EvaluationsPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [rows, setRows] = useState<EvalRow[]>([]);
  const [saved, setSaved] = useState('[]');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const dirty = snapshot(rows) !== saved;

  const loadEvaluations = useCallback(async (classId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/evaluations?classId=${classId}`);
      if (!res.ok) throw new Error();
      const data: EvalRow[] = await res.json();
      setRows(data);
      setSaved(snapshot(data));
    } catch {
      setMessage({ text: 'Impossible de charger les évaluations.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/classes');
        const data: ClassRow[] = await res.json();
        setClasses(data);
        if (data.length > 0) setSelectedClass(String(data[0].id));
        else setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedClass) loadEvaluations(selectedClass);
  }, [selectedClass, loadEvaluations]);

  const changeClass = (id: string) => {
    if (dirty && !confirm('Des notes ne sont pas sauvegardées. Changer de classe quand même ?')) return;
    setSelectedClass(id);
  };

  const save = useCallback(async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluations: rows }),
      });
      if (!res.ok) throw new Error();
      setSaved(snapshot(rows));
      setMessage({ text: 'Évaluations enregistrées.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: "L'enregistrement a échoué. Vos notes sont toujours à l'écran, réessayez.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [rows]);

  // Ctrl/Cmd+S saves; warn before leaving with unsaved grades
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && !isSaving) save();
      }
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [dirty, isSaving, save]);

  const focusCell = (r: number, c: number) => {
    const el = tableRef.current?.querySelector<HTMLInputElement>(`input[data-r="${r}"][data-c="${c}"]`);
    el?.focus();
    el?.select();
  };

  const setCell = (r: number, key: string, value: string) => {
    setRows(prev => prev.map((row, i) => (i === r ? { ...row, [key]: value } : row)));
  };

  const onCellChange = (r: number, c: number, raw: string) => {
    const letter = raw.trim().slice(-1).toUpperCase();
    if (letter === '') {
      setCell(r, COLUMNS[c].key, '');
      return;
    }
    if (!/^[A-D]$/.test(letter)) return; // ignore anything that is not a grade
    setCell(r, COLUMNS[c].key, letter);
    // Move right, wrapping to the next student
    if (c < COLUMNS.length - 1) focusCell(r, c + 1);
    else if (r < rows.length - 1) focusCell(r + 1, 0);
  };

  const onCellKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    const move = (dr: number, dc: number) => {
      e.preventDefault();
      const nr = Math.min(rows.length - 1, Math.max(0, r + dr));
      const nc = Math.min(COLUMNS.length - 1, Math.max(0, c + dc));
      focusCell(nr, nc);
    };
    if (e.key === 'ArrowRight') move(0, 1);
    else if (e.key === 'ArrowLeft') move(0, -1);
    else if (e.key === 'ArrowDown' || e.key === 'Enter') move(1, 0);
    else if (e.key === 'ArrowUp') move(-1, 0);
    else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setCell(r, COLUMNS[c].key, '');
    }
  };

  // Summary
  const counts: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0 };
  let filled = 0;
  rows.forEach(row =>
    COLUMNS.forEach(col => {
      const v = row[col.key];
      if (typeof v === 'string' && v in counts) {
        counts[v as Grade]++;
        filled++;
      }
    })
  );
  const total = rows.length * COLUMNS.length;

  if (isLoading && classes.length === 0) return <div className={styles.loader}>Chargement...</div>;

  if (classes.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Évaluations</h1>
        </header>
        <div className={styles.emptyPanel}>
          <h2>Aucune classe pour le moment</h2>
          <p>Créez une classe et ajoutez vos élèves pour commencer à saisir des évaluations.</p>
          <a className={styles.primaryLink} href="/classes">
            Aller aux classes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Évaluations</h1>
          <p className={styles.subtitle}>Tapez A, B, C ou D : le curseur passe à la case suivante. Flèches pour se déplacer, Retour arrière pour effacer.</p>
        </div>

        <div className={styles.headerActions}>
          <select value={selectedClass} onChange={e => changeClass(e.target.value)} className={styles.classSelect} aria-label="Classe">
            {classes.map(c => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button className={styles.saveBtn} onClick={save} disabled={isSaving || !dirty}>
            {dirty || isSaving ? <Save size={16} /> : <Check size={16} />}
            {isSaving ? 'Enregistrement...' : dirty ? 'Enregistrer' : 'Enregistré'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`${styles.messageBanner} ${message.type === 'success' ? styles.success : styles.error}`} role={message.type === 'error' ? 'alert' : 'status'}>
          {message.text}
        </div>
      )}

      <div className={styles.summary}>
        <div className={styles.legend}>
          {GRADES.map(g => (
            <span key={g.grade} className={styles.legendItem}>
              <span className={`${styles.chip} ${styles['grade' + g.grade]}`}>{g.grade}</span>
              {g.meaning}
              <span className={styles.legendCount}>{counts[g.grade]}</span>
            </span>
          ))}
        </div>
        <span className={styles.progress}>
          {filled} / {total} cases remplies
        </span>
      </div>

      {rows.length === 0 ? (
        <div className={styles.emptyPanel}>
          <h2>Cette classe n&apos;a pas d&apos;élèves</h2>
          <p>Ajoutez des élèves pour pouvoir les évaluer.</p>
          <a className={styles.primaryLink} href="/classes">
            Ajouter des élèves
          </a>
        </div>
      ) : (
        <div className={styles.spreadsheetWrapper}>
          <table className={styles.spreadsheet} ref={tableRef}>
            <thead>
              <tr>
                <th className={styles.stickyCol} rowSpan={2}>
                  Élève
                </th>
                {GROUPS.map(g => (
                  <th key={g.label} colSpan={g.keys.length} className={styles.groupHead}>
                    {g.label}
                  </th>
                ))}
              </tr>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} className={styles.subHead}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={row.student_id}>
                  <td className={styles.stickyCol}>
                    <div className={styles.nameCell}>
                      <Avatar student={{ id: row.student_id, name: row.student_name, has_photo: row.has_photo, photo_updated_at: row.photo_updated_at }} size={28} />
                      <span className={styles.studentName}>{row.student_name}</span>
                    </div>
                  </td>
                  {COLUMNS.map((col, c) => {
                    const v = String(row[col.key] || '');
                    return (
                      <td key={col.key} className={styles.cell}>
                        <input
                          type="text"
                          autoComplete="off"
                          maxLength={2}
                          data-r={r}
                          data-c={c}
                          aria-label={`${row.student_name}, ${col.group} ${col.label}`}
                          className={`${styles.cellInput} ${v ? styles['grade' + v] : ''}`}
                          value={v}
                          onChange={e => onCellChange(r, c, e.target.value)}
                          onKeyDown={e => onCellKeyDown(e, r, c)}
                          onFocus={e => e.target.select()}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
