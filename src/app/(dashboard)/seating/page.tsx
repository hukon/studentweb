"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Save, Check, Sparkles, Eraser, Minus, Plus } from 'lucide-react';
import Avatar from '@/components/Avatar';
import styles from './seating.module.css';

interface ClassRow {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  has_photo?: boolean;
  photo_updated_at?: string | null;
}

interface Seat {
  row_num: number;
  col_num: number;
  student_id: number | null;
}

interface SeatRecord {
  row_num: number;
  col_num: number;
  student_id: number;
}

// What the teacher has picked up: a student from the list, or one already seated
type Picked = { studentId: number; fromSeat: number | null } | null;

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 6;
const MIN_SIZE = 2;
const MAX_SIZE = 10;

const sizeKey = (classId: string) => `seating-size-${classId}`;

const buildGrid = (rows: number, cols: number, records: SeatRecord[], valid: Set<number>): Seat[] => {
  const grid: Seat[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hit = records.find(s => s.row_num === r && s.col_num === c);
      grid.push({ row_num: r, col_num: c, student_id: hit && valid.has(hit.student_id) ? hit.student_id : null });
    }
  }
  return grid;
};

const snapshot = (seats: Seat[]) => JSON.stringify(seats.filter(s => s.student_id !== null).map(s => [s.row_num, s.col_num, s.student_id]));

export default function SeatingPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [saved, setSaved] = useState('[]');
  const [picked, setPicked] = useState<Picked>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const dirty = snapshot(seats) !== saved;
  const studentById = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const seatedCount = seats.filter(s => s.student_id !== null).length;
  const seatedIds = new Set(seats.map(s => s.student_id).filter((id): id is number => id !== null));
  const unassigned = students.filter(s => !seatedIds.has(s.id));

  const loadClassData = useCallback(async (classId: string) => {
    setIsLoading(true);
    setPicked(null);
    try {
      const [studentsRes, seatsRes] = await Promise.all([fetch(`/api/students?classId=${classId}`), fetch(`/api/seating?classId=${classId}`)]);
      if (!studentsRes.ok || !seatsRes.ok) throw new Error();
      const studentData: Student[] = await studentsRes.json();
      const seatData: SeatRecord[] = await seatsRes.json();
      const valid = new Set(studentData.map(s => s.id));
      const usable = seatData.filter(s => valid.has(s.student_id));

      // Grid is at least as big as the saved size and as the furthest seated student
      let r = DEFAULT_ROWS;
      let c = DEFAULT_COLS;
      try {
        const stored = JSON.parse(localStorage.getItem(sizeKey(classId)) || 'null');
        if (stored?.rows) r = stored.rows;
        if (stored?.cols) c = stored.cols;
      } catch {}
      r = Math.max(r, ...usable.map(s => s.row_num + 1));
      c = Math.max(c, ...usable.map(s => s.col_num + 1));

      const grid = buildGrid(r, c, usable, valid);
      setStudents(studentData);
      setRows(r);
      setCols(c);
      setSeats(grid);
      setSaved(snapshot(grid));
    } catch {
      setMessage({ text: 'Impossible de charger le plan de classe.', type: 'error' });
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
    if (selectedClass) loadClassData(selectedClass);
  }, [selectedClass, loadClassData]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = seats
        .filter(s => s.student_id !== null)
        .map((s, index) => ({ ...s, seat_num: index })); // legacy schema requires seat_num
      const res = await fetch('/api/seating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass, seats: payload }),
      });
      if (!res.ok) throw new Error();
      setSaved(snapshot(seats));
      setMessage({ text: 'Plan de classe enregistré.', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: "L'enregistrement a échoué. Votre plan est toujours à l'écran, réessayez.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [seats, selectedClass]);

  // Esc drops the selection; warn before leaving with unsaved changes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPicked(null);
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

  const changeClass = (id: string) => {
    if (dirty && !confirm('Le plan n’est pas enregistré. Changer de classe quand même ?')) return;
    setSelectedClass(id);
  };

  const resize = (nextRows: number, nextCols: number) => {
    // Never drop a seated student: refuse sizes that would cut one off
    const cut = seats.some(s => s.student_id !== null && (s.row_num >= nextRows || s.col_num >= nextCols));
    if (cut || nextRows < MIN_SIZE || nextCols < MIN_SIZE || nextRows > MAX_SIZE || nextCols > MAX_SIZE) return;
    const records = seats.filter((s): s is Seat & { student_id: number } => s.student_id !== null);
    setSeats(buildGrid(nextRows, nextCols, records, new Set(students.map(s => s.id))));
    setRows(nextRows);
    setCols(nextCols);
    try {
      localStorage.setItem(sizeKey(selectedClass), JSON.stringify({ rows: nextRows, cols: nextCols }));
    } catch {}
  };

  // Put `studentId` on seat `index`. A student already there goes back to the list,
  // or swaps places when we are moving a seated student.
  const placeOn = (index: number, studentId: number, fromSeat: number | null) => {
    setSeats(prev => {
      const next = prev.map(s => ({ ...s }));
      const occupant = next[index].student_id;
      if (fromSeat !== null) next[fromSeat].student_id = occupant;
      next[index].student_id = studentId;
      return next;
    });
  };

  const onSeatClick = (index: number) => {
    const seat = seats[index];
    if (picked) {
      if (picked.fromSeat === index) {
        setPicked(null);
        return;
      }
      placeOn(index, picked.studentId, picked.fromSeat);
      setPicked(null);
    } else if (seat.student_id !== null) {
      setPicked({ studentId: seat.student_id, fromSeat: index });
    }
  };

  const onStudentClick = (studentId: number) => {
    setPicked(picked?.studentId === studentId ? null : { studentId, fromSeat: null });
  };

  const sendBackToList = () => {
    if (picked?.fromSeat == null) return;
    const from = picked.fromSeat;
    setSeats(prev => prev.map((s, i) => (i === from ? { ...s, student_id: null } : s)));
    setPicked(null);
  };

  const autoPlace = () => {
    if (seatedCount > 0 && !confirm('Le plan actuel sera remplacé par un placement automatique (ordre alphabétique, rangée par rangée). Continuer ?')) return;
    const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
    // Grow the grid if the class is bigger than the room
    let r = rows;
    const c = cols;
    while (r * c < sorted.length && r < MAX_SIZE) r++;
    const grid = buildGrid(r, c, [], new Set());
    sorted.slice(0, r * c).forEach((s, i) => (grid[i].student_id = s.id));
    setRows(r);
    setSeats(grid);
    setPicked(null);
  };

  const clearAll = () => {
    if (seatedCount === 0) return;
    if (!confirm('Retirer tous les élèves du plan ?')) return;
    setSeats(prev => prev.map(s => ({ ...s, student_id: null })));
    setPicked(null);
  };

  // Mouse drag and drop still works alongside click-to-place
  const onDragStart = (e: React.DragEvent, studentId: number, fromSeat: number | null) => {
    e.dataTransfer.setData('studentId', String(studentId));
    e.dataTransfer.setData('fromSeat', fromSeat === null ? '' : String(fromSeat));
  };

  const onDropSeat = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const studentId = parseInt(e.dataTransfer.getData('studentId'));
    if (isNaN(studentId)) return;
    const from = e.dataTransfer.getData('fromSeat');
    placeOn(index, studentId, from === '' ? null : parseInt(from));
    setPicked(null);
  };

  const onDropList = (e: React.DragEvent) => {
    e.preventDefault();
    const from = e.dataTransfer.getData('fromSeat');
    if (from === '') return;
    const i = parseInt(from);
    setSeats(prev => prev.map((s, idx) => (idx === i ? { ...s, student_id: null } : s)));
  };

  const pickedStudent = picked ? studentById.get(picked.studentId) : null;

  if (isLoading && classes.length === 0) return <div className={styles.loader}>Chargement...</div>;

  if (classes.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Plan de classe</h1>
        </header>
        <div className={styles.emptyPanel}>
          <h2>Aucune classe pour le moment</h2>
          <p>Créez une classe et ajoutez vos élèves pour organiser les places.</p>
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
          <h1>Plan de classe</h1>
          <p className={styles.subtitle}>Cliquez un élève, puis une place. Vous pouvez aussi glisser-déposer. Cliquez un élève déjà placé pour le déplacer.</p>
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

      {isLoading ? (
        <div className={styles.loader}>Chargement du plan...</div>
      ) : students.length === 0 ? (
        <div className={styles.emptyPanel}>
          <h2>Cette classe n&apos;a pas d&apos;élèves</h2>
          <p>Ajoutez des élèves pour pouvoir les placer.</p>
          <a className={styles.primaryLink} href="/classes">
            Ajouter des élèves
          </a>
        </div>
      ) : (
        <div className={styles.workspace}>
          <aside
            className={`${styles.listPanel} ${picked?.fromSeat != null ? styles.listDroppable : ''}`}
            onDragOver={e => e.preventDefault()}
            onDrop={onDropList}
            aria-label="Élèves à placer"
          >
            <h2 className={styles.panelTitle}>
              {unassigned.length > 0 ? `À placer (${unassigned.length})` : 'Tous les élèves sont placés'}
            </h2>
            <ul className={styles.chips}>
              {unassigned.map(s => (
                <li key={s.id}>
                  <button
                    className={`${styles.chip} ${picked?.studentId === s.id ? styles.picked : ''}`}
                    onClick={() => onStudentClick(s.id)}
                    draggable
                    onDragStart={e => onDragStart(e, s.id, null)}
                    aria-pressed={picked?.studentId === s.id}
                  >
                    <Avatar student={s} size={28} />
                    <span className={styles.chipName}>{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
            {picked?.fromSeat != null && (
              <button className={styles.backBtn} onClick={sendBackToList}>
                Retirer {pickedStudent?.name.split(' ')[0]} du plan
              </button>
            )}
          </aside>

          <section className={styles.roomPanel}>
            <div className={styles.roomBar}>
              <div className={styles.sizers}>
                <span className={styles.stepper}>
                  Rangées
                  <button onClick={() => resize(rows - 1, cols)} aria-label="Moins de rangées" disabled={rows <= MIN_SIZE}>
                    <Minus size={14} />
                  </button>
                  <b>{rows}</b>
                  <button onClick={() => resize(rows + 1, cols)} aria-label="Plus de rangées" disabled={rows >= MAX_SIZE}>
                    <Plus size={14} />
                  </button>
                </span>
                <span className={styles.stepper}>
                  Colonnes
                  <button onClick={() => resize(rows, cols - 1)} aria-label="Moins de colonnes" disabled={cols <= MIN_SIZE}>
                    <Minus size={14} />
                  </button>
                  <b>{cols}</b>
                  <button onClick={() => resize(rows, cols + 1)} aria-label="Plus de colonnes" disabled={cols >= MAX_SIZE}>
                    <Plus size={14} />
                  </button>
                </span>
              </div>
              <div className={styles.tools}>
                <button className={styles.toolBtn} onClick={autoPlace}>
                  <Sparkles size={15} /> Placer automatiquement
                </button>
                <button className={styles.toolBtn} onClick={clearAll} disabled={seatedCount === 0}>
                  <Eraser size={15} /> Vider le plan
                </button>
              </div>
            </div>

            {pickedStudent && (
              <p className={styles.pickHint} role="status">
                {pickedStudent.name} est sélectionné : cliquez une place. Échap pour annuler.
              </p>
            )}

            <div className={styles.desk}>Bureau du professeur</div>

            <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {seats.map((seat, index) => {
                const student = seat.student_id !== null ? studentById.get(seat.student_id) : undefined;
                const isPicked = picked?.fromSeat === index;
                return (
                  <button
                    key={`${seat.row_num}-${seat.col_num}`}
                    className={`${styles.seat} ${student ? styles.seatFilled : ''} ${isPicked ? styles.picked : ''} ${picked && !student ? styles.seatTarget : ''}`}
                    onClick={() => onSeatClick(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => onDropSeat(e, index)}
                    draggable={!!student}
                    onDragStart={e => student && onDragStart(e, student.id, index)}
                    aria-label={student ? `Place ${seat.row_num + 1}-${seat.col_num + 1}, ${student.name}` : `Place ${seat.row_num + 1}-${seat.col_num + 1}, libre`}
                    title={student?.name}
                  >
                    {student ? (
                      <>
                        <Avatar student={student} size={40} />
                        <span className={styles.seatName}>{student.name.split(' ')[0]}</span>
                      </>
                    ) : (
                      <span className={styles.seatEmpty} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className={styles.footnote}>
              {seatedCount} élève{seatedCount > 1 ? 's' : ''} placé{seatedCount > 1 ? 's' : ''} sur {students.length}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
