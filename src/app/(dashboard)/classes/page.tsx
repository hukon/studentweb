"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Plus, Trash2, Pencil, LayoutGrid, List, Camera, Search, ListPlus, X } from 'lucide-react';
import Avatar from '@/components/Avatar';
import PhotoDialog from '@/components/PhotoDialog';
import styles from './classes.module.css';

interface ClassRow {
  id: number;
  name: string;
  student_count: number | string;
}

interface Student {
  id: number;
  class_id: number;
  name: string;
  dob: string | null;
  bio: string | null;
  category1: string | null;
  has_photo: boolean;
  photo_updated_at: string | null;
  comprehension_orale: number | boolean;
  ecriture: number | boolean;
  vocabulaire: number | boolean;
  grammaire: number | boolean;
  conjugaison: number | boolean;
  production_ecrite: number | boolean;
}

const DIFFICULTIES = [
  { key: 'comprehension_orale', label: 'Compréhension orale', short: 'C. orale' },
  { key: 'ecriture', label: 'Écriture', short: 'Écriture' },
  { key: 'vocabulaire', label: 'Vocabulaire', short: 'Vocabulaire' },
  { key: 'grammaire', label: 'Grammaire', short: 'Grammaire' },
  { key: 'conjugaison', label: 'Conjugaison', short: 'Conjugaison' },
  { key: 'production_ecrite', label: 'Production écrite', short: 'P. écrite' },
] as const;

type DifficultyKey = (typeof DIFFICULTIES)[number]['key'];

const isOn = (v: unknown) => v === true || v === 1;

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | DifficultyKey>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [photoStudent, setPhotoStudent] = useState<Student | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [view, setView] = useState<'list' | 'wall'>('wall');
  const [error, setError] = useState('');
  const [studentsLoading, setStudentsLoading] = useState(false);
  // Students already fetched per class: switching back to a class shows them instantly
  const cache = useRef<Map<string, Student[]>>(new Map());
  const inflight = useRef<Set<string>>(new Set());
  const currentClass_ = useRef('');

  useEffect(() => {
    try {
      if (localStorage.getItem('students-view') === 'list') setView('list');
    } catch {}
  }, []);

  const changeView = (v: 'list' | 'wall') => {
    setView(v);
    try {
      localStorage.setItem('students-view', v);
    } catch {}
  };

  const fetchClasses = useCallback(async (preferId?: string) => {
    try {
      const res = await fetch('/api/classes');
      if (!res.ok) throw new Error();
      const data: ClassRow[] = await res.json();
      setClasses(data);
      setSelectedClass(prev => {
        const wanted = preferId || prev;
        if (wanted && data.some(c => String(c.id) === wanted)) return wanted;
        return data[0] ? String(data[0].id) : '';
      });
      setError('');
    } catch {
      setError('Impossible de charger les classes. Vérifiez votre connexion et rechargez la page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStudents = useCallback(async (classId: string) => {
    const cached = cache.current.get(classId);
    if (classId === currentClass_.current) {
      if (cached) setStudents(cached);
      else {
        setStudents([]);
        setStudentsLoading(true);
      }
    }
    if (inflight.current.has(classId)) return;
    inflight.current.add(classId);
    try {
      const res = await fetch(`/api/students?classId=${classId}`);
      if (!res.ok) throw new Error();
      const data: Student[] = await res.json();
      cache.current.set(classId, data);
      if (classId === currentClass_.current) setStudents(data);
    } catch {
      setError('Impossible de charger les élèves.');
    } finally {
      inflight.current.delete(classId);
      if (classId === currentClass_.current) setStudentsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Start loading the last-used class's students at the same time as the class list
    let last = '';
    try {
      last = localStorage.getItem('last-class') || '';
    } catch {}
    if (last) {
      currentClass_.current = last;
      fetchStudents(last);
    }
    fetchClasses(last || undefined);
  }, [fetchClasses, fetchStudents]);

  useEffect(() => {
    setSearch('');
    setDifficulty('all');
    currentClass_.current = selectedClass;
    if (selectedClass) {
      try {
        localStorage.setItem('last-class', selectedClass);
      } catch {}
      fetchStudents(selectedClass);
    } else {
      setStudents([]);
    }
  }, [selectedClass, fetchStudents]);

  const refresh = () => {
    cache.current.delete(selectedClass);
    fetchStudents(selectedClass);
    fetchClasses(selectedClass);
  };

  const needle = search.trim().toLowerCase();
  const visible = students.filter(s => {
    if (needle && !s.name.toLowerCase().includes(needle)) return false;
    if (difficulty !== 'all' && !isOn(s[difficulty])) return false;
    return true;
  });
  const withoutPhoto = students.filter(s => !s.has_photo).length;
  const currentClass = classes.find(c => String(c.id) === selectedClass);

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newClassName.trim();
    if (!name) return;
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setError(`Impossible de créer la classe « ${name} ». Ce nom existe peut-être déjà.`);
      return;
    }
    setNewClassName('');
    setError('');
    const list: ClassRow[] = await (await fetch('/api/classes')).json();
    const created = list.find(c => c.name === name);
    setClasses(list);
    if (created) setSelectedClass(String(created.id));
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStudentName.trim();
    if (!selectedClass || !name) return;
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: selectedClass, name }),
    });
    if (!res.ok) {
      setError("Impossible d'ajouter l'élève.");
      return;
    }
    setNewStudentName('');
    setError('');
    refresh();
  };

  const addBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    const names = bulkText.split('\n').map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return;
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: selectedClass, names }),
    });
    if (!res.ok) {
      setError("Impossible d'ajouter la liste d'élèves.");
      return;
    }
    setBulkText('');
    setBulkOpen(false);
    setError('');
    refresh();
  };

  const deleteStudent = async (s: Student) => {
    if (!confirm(`Supprimer ${s.name} ? Ses évaluations et sa place dans le plan de classe seront aussi supprimées.`)) return;
    await fetch(`/api/students/${s.id}`, { method: 'DELETE' });
    refresh();
  };

  const updateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    await fetch(`/api/students/${editingStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingStudent),
    });
    setEditingStudent(null);
    refresh();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr.includes('1970')) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR');
  };

  const bulkCount = bulkText.split('\n').filter(n => n.trim()).length;

  if (isLoading) return <div className={styles.loader}>Chargement...</div>;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>Classes & étudiants</h1>
      </header>

      {error && (
        <div className={styles.errorBanner} role="alert">
          {error}
          <button onClick={() => setError('')} aria-label="Fermer le message">
            <X size={16} />
          </button>
        </div>
      )}

      {classes.length === 0 ? (
        <section className={styles.firstRun}>
          <Users size={32} className={styles.firstRunIcon} />
          <h2>Créez votre première classe</h2>
          <p>Donnez-lui un nom, par exemple « 3A ». Vous pourrez ensuite ajouter vos élèves un par un ou coller toute la liste d&apos;un coup.</p>
          <form onSubmit={addClass} className={styles.inlineForm}>
            <input
              type="text"
              placeholder="Nom de la classe"
              value={newClassName}
              onChange={e => setNewClassName(e.target.value)}
              className={styles.input}
              aria-label="Nom de la classe"
              autoFocus
            />
            <button type="submit" className={styles.primaryBtn} disabled={!newClassName.trim()}>
              <Plus size={16} /> Créer la classe
            </button>
          </form>
        </section>
      ) : (
        <div className={styles.layout}>
          <aside className={styles.classPanel} aria-label="Classes">
            <ul className={styles.classList}>
              {classes.map(cls => (
                <li key={cls.id}>
                  <button
                    className={`${styles.classBtn} ${selectedClass === String(cls.id) ? styles.classActive : ''}`}
                    onClick={() => setSelectedClass(String(cls.id))}
                    aria-current={selectedClass === String(cls.id) ? 'true' : undefined}
                  >
                    <span className={styles.className}>{cls.name}</span>
                    <span className={styles.classCount}>{Number(cls.student_count)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={addClass} className={styles.newClassForm}>
              <input
                type="text"
                placeholder="Nouvelle classe"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                className={styles.input}
                aria-label="Nom de la nouvelle classe"
              />
              <button type="submit" className={styles.iconPrimary} disabled={!newClassName.trim()} aria-label="Créer la classe">
                <Plus size={18} />
              </button>
            </form>
          </aside>

          <section className={styles.studentPanel}>
            <div className={styles.panelHead}>
              <div>
                <h2 className={styles.panelTitle}>{currentClass?.name}</h2>
                <p className={styles.panelMeta}>
                  {students.length} élève{students.length > 1 ? 's' : ''}
                  {students.length > 0 && withoutPhoto > 0 && ` · ${withoutPhoto} sans photo`}
                </p>
              </div>
              <form onSubmit={addStudent} className={styles.inlineForm}>
                <input
                  type="text"
                  placeholder="Nom de l'élève"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className={styles.input}
                  aria-label="Nom du nouvel élève"
                />
                <button type="submit" className={styles.primaryBtn} disabled={!newStudentName.trim()}>
                  <Plus size={16} /> Ajouter
                </button>
                <button type="button" className={styles.secondaryBtn} onClick={() => setBulkOpen(true)}>
                  <ListPlus size={16} /> Coller une liste
                </button>
              </form>
            </div>

            {students.length > 0 && (
              <div className={styles.toolbar}>
                <label className={styles.searchBox}>
                  <Search size={16} />
                  <input
                    type="search"
                    placeholder="Rechercher un élève"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Rechercher un élève"
                  />
                </label>
                <select
                  className={styles.select}
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as 'all' | DifficultyKey)}
                  aria-label="Filtrer par difficulté"
                >
                  <option value="all">Toutes les difficultés</option>
                  {DIFFICULTIES.map(d => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <div className={styles.viewToggle} role="group" aria-label="Affichage">
                  <button className={`${styles.viewBtn} ${view === 'wall' ? styles.viewActive : ''}`} onClick={() => changeView('wall')} aria-pressed={view === 'wall'}>
                    <LayoutGrid size={16} /> Photos
                  </button>
                  <button className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`} onClick={() => changeView('list')} aria-pressed={view === 'list'}>
                    <List size={16} /> Liste
                  </button>
                </div>
              </div>
            )}

            {studentsLoading && students.length === 0 ? (
              <div className={styles.wall} aria-busy="true" aria-label="Chargement des élèves">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <span className={styles.skeletonAvatar} />
                    <span className={styles.skeletonLine} />
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Cette classe est vide</h3>
                <p>Ajoutez un premier élève ci-dessus, ou collez la liste complète de la classe (un nom par ligne).</p>
                <button className={styles.primaryBtn} onClick={() => setBulkOpen(true)}>
                  <ListPlus size={16} /> Coller une liste d&apos;élèves
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>Aucun résultat</h3>
                <p>Aucun élève ne correspond à ces critères.</p>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setSearch('');
                    setDifficulty('all');
                  }}
                >
                  Effacer les filtres
                </button>
              </div>
            ) : view === 'wall' ? (
              <div className={styles.wall}>
                {visible.map(s => (
                  <div key={s.id} className={styles.wallCard}>
                    <button className={styles.wallPhoto} onClick={() => setPhotoStudent(s)} aria-label={`Photo de ${s.name}`}>
                      <span className={styles.avatarWrap}>
                        <Avatar student={s} size={96} />
                        <span className={styles.cameraBadge}>
                          <Camera size={13} />
                        </span>
                      </span>
                    </button>
                    <span className={styles.wallName}>{s.name}</span>
                    <div className={styles.tags}>
                      {DIFFICULTIES.filter(d => isOn(s[d.key])).map(d => (
                        <span key={d.key} className={styles.tag}>
                          {d.short}
                        </span>
                      ))}
                    </div>
                    <div className={styles.wallActions}>
                      <button className={styles.iconBtn} onClick={() => setEditingStudent(s)} aria-label={`Modifier ${s.name}`} title="Modifier">
                        <Pencil size={15} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={() => deleteStudent(s)} aria-label={`Supprimer ${s.name}`} title="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Difficultés</th>
                      <th>Naissance</th>
                      <th>Info</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div className={styles.nameCell}>
                            <button className={styles.avatarBtn} onClick={() => setPhotoStudent(s)} aria-label={`Photo de ${s.name}`}>
                              <span className={styles.avatarWrap}>
                                <Avatar student={s} size={36} />
                                <span className={`${styles.cameraBadge} ${styles.cameraSmall}`}>
                                  <Camera size={10} />
                                </span>
                              </span>
                            </button>
                            <span className={styles.studentName}>{s.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.tags}>
                            {DIFFICULTIES.filter(d => isOn(s[d.key])).map(d => (
                              <span key={d.key} className={styles.tag}>
                                {d.short}
                              </span>
                            ))}
                            {s.category1 && <span className={styles.tag}>{s.category1}</span>}
                          </div>
                        </td>
                        <td className={styles.muted}>{formatDate(s.dob) || '-'}</td>
                        <td className={styles.muted}>{s.bio || '-'}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className={styles.iconBtn} onClick={() => setEditingStudent(s)} aria-label={`Modifier ${s.name}`} title="Modifier">
                              <Pencil size={15} />
                            </button>
                            <button className={`${styles.iconBtn} ${styles.iconDanger}`} onClick={() => deleteStudent(s)} aria-label={`Supprimer ${s.name}`} title="Supprimer">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {photoStudent && <PhotoDialog student={photoStudent} onClose={() => setPhotoStudent(null)} onChanged={refresh} />}

      {bulkOpen && (
        <div className={styles.modalOverlay} onClick={() => setBulkOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-label="Ajouter plusieurs élèves">
            <h2>Ajouter plusieurs élèves à {currentClass?.name}</h2>
            <form onSubmit={addBulk}>
              <div className={styles.formGroup}>
                <label htmlFor="bulk">Un nom par ligne</label>
                <textarea
                  id="bulk"
                  rows={10}
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={'Amine Benali\nSara Khelifi\nYacine Mebarki'}
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setBulkOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={bulkCount === 0}>
                  {bulkCount > 0 ? `Ajouter ${bulkCount} élève${bulkCount > 1 ? 's' : ''}` : 'Ajouter les élèves'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingStudent && (
        <div className={styles.modalOverlay} onClick={() => setEditingStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} role="dialog" aria-label="Modifier l'élève">
            <h2>Modifier l&apos;élève</h2>
            <form onSubmit={updateStudent}>
              <div className={styles.formGroup}>
                <label htmlFor="edit-name">Nom complet</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingStudent.name || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-dob">Date de naissance</label>
                <input
                  id="edit-dob"
                  type="date"
                  value={editingStudent.dob ? new Date(editingStudent.dob).toISOString().split('T')[0] : ''}
                  onChange={e => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-bio">Moyenne de l&apos;année précédente ou information</label>
                <input
                  id="edit-bio"
                  type="text"
                  placeholder="Ex : moyenne 15,43/20"
                  value={editingStudent.bio || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, bio: e.target.value })}
                />
              </div>

              <fieldset className={styles.fieldset}>
                <legend>Difficultés d&apos;apprentissage</legend>
                <div className={styles.checkboxGrid}>
                  {DIFFICULTIES.map(d => (
                    <label key={d.key} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={isOn(editingStudent[d.key])}
                        onChange={e => setEditingStudent({ ...editingStudent, [d.key]: e.target.checked })}
                      />
                      {d.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setEditingStudent(null)}>
                  Annuler
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
