"use client";

import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2 } from 'lucide-react';
import styles from './classes.module.css';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
      setSearchQuery('all');
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const filteredStudents = students.filter(s => {
    if (searchQuery === 'all') return true;
    return s[searchQuery] === true || s[searchQuery] === 1;
  });

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
    if (data.length > 0 && !selectedClass) {
      setSelectedClass(data[0].id.toString());
    }
    setIsLoading(false);
  };

  const fetchStudents = async (classId: string) => {
    const res = await fetch(`/api/students?classId=${classId}`);
    const data = await res.json();
    setStudents(data);
  };

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newClassName })
    });
    setNewClassName('');
    fetchClasses();
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !newStudentName.trim()) return;
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: selectedClass, name: newStudentName })
    });
    setNewStudentName('');
    fetchStudents(selectedClass);
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cet étudiant ?')) return;
    await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
    fetchStudents(selectedClass);
  };

  const updateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    await fetch(`/api/students/${editingStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingStudent)
    });
    
    setEditingStudent(null);
    fetchStudents(selectedClass);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0000-00-00' || dateStr.includes('1970')) return '-';
    // Clean string formats from DB if needed
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
  };

  if (isLoading) return <div className={styles.loader}>Chargement...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Users size={28} className={styles.headerIcon} />
          <h1>Classes & Étudiants</h1>
        </div>
        <p className={styles.subtitle}>Gérez vos listes de classes facilement.</p>
      </header>

      <div className={styles.grid}>
        {/* Sidebar for Classes */}
        <aside className={styles.classSidebar}>
          <h2 className={styles.sectionTitle}>Vos Classes</h2>
          <div className={styles.classList}>
            {classes.map(cls => (
              <button 
                key={cls.id} 
                className={`${styles.classBtn} ${selectedClass === cls.id.toString() ? styles.active : ''}`}
                onClick={() => setSelectedClass(cls.id.toString())}
              >
                {cls.name}
              </button>
            ))}
          </div>

          <form onSubmit={addClass} className={styles.addForm}>
            <input 
              type="text" 
              placeholder="Nouvelle classe..." 
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.primaryBtn} disabled={!newClassName.trim()}>
              <Plus size={18} />
            </button>
          </form>
        </aside>

        {/* Main Content for Students in Selected Class */}
        <main className={styles.studentMain}>
          {selectedClass ? (
            <>
              <div className={styles.studentHeader}>
                <h2 className={styles.sectionTitle}>Étudiants</h2>
                <form onSubmit={addStudent} className={styles.addForm}>
                  <input 
                    type="text" 
                    placeholder="Nom de l'étudiant..." 
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className={styles.input}
                  />
                  <button type="submit" className={styles.primaryBtn} disabled={!newStudentName.trim()}>
                    <Plus size={18} /> Ajouter
                  </button>
                </form>
              </div>

              <div className={styles.tableWrapper}>
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-input)' }}>
                  <select 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  >
                    <option value="all">Tous les étudiants</option>
                    <option value="comprehension_orale">Difficulté: Compréhension Orale</option>
                    <option value="ecriture">Difficulté: Écriture</option>
                    <option value="vocabulaire">Difficulté: Vocabulaire</option>
                    <option value="grammaire">Difficulté: Grammaire</option>
                    <option value="conjugaison">Difficulté: Conjugaison</option>
                    <option value="production_ecrite">Difficulté: Production Écrite</option>
                  </select>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>N°</th>
                      <th>Nom complet</th>
                      <th>Date de naissance</th>
                      <th>Moyenne / Info</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyState}>Aucun étudiant trouvé.</td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, index) => (
                        <tr key={s.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className={styles.studentNameWrapper}>
                              <div className={styles.avatar}>{s.name.charAt(0).toUpperCase()}</div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className={styles.studentName}>{s.name}</span>
                                <div className={styles.tagsContainer}>
                                  {s.comprehension_orale === true && <span className={styles.tag}>C. Orale</span>}
                                  {s.ecriture === true && <span className={styles.tag}>Écriture</span>}
                                  {s.vocabulaire === true && <span className={styles.tag}>Vocabulaire</span>}
                                  {s.grammaire === true && <span className={styles.tag}>Grammaire</span>}
                                  {s.conjugaison === true && <span className={styles.tag}>Conjugaison</span>}
                                  {s.production_ecrite === true && <span className={styles.tag}>P. Écrite</span>}
                                  {s.category1 && <span className={styles.tag} style={{backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderColor: 'var(--warning)'}}>{s.category1}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(s.dob)}</td>
                          <td>{s.bio || '-'}</td>
                          <td>
                            <div className={styles.actions}>
                              <button className={styles.iconBtnEdit} title="Modifier" onClick={() => setEditingStudent(s)}>
                                <Edit2 size={16} />
                              </button>
                              <button className={styles.iconBtnDelete} onClick={() => deleteStudent(s.id.toString())} title="Supprimer">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>Veuillez sélectionner ou créer une classe.</div>
          )}
        </main>
      </div>

      {editingStudent && (
        <div className={styles.modalOverlay} onClick={() => setEditingStudent(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Modifier l'étudiant</h2>
            <form onSubmit={updateStudent}>
              <div className={styles.formGroup}>
                <label>Nom complet</label>
                <input 
                  type="text" 
                  value={editingStudent.name || ''} 
                  onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date de naissance</label>
                <input 
                  type="date" 
                  value={editingStudent.dob ? new Date(editingStudent.dob).toISOString().split('T')[0] : ''} 
                  onChange={e => setEditingStudent({...editingStudent, dob: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Moyenne Année Précédente / Info</label>
                <input 
                  type="text" 
                  placeholder="Ex: Moyenne: 15.43/20"
                  value={editingStudent.bio || ''} 
                  onChange={e => setEditingStudent({...editingStudent, bio: e.target.value})} 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Difficultés d'apprentissage</label>
                <div className={styles.checkboxGrid}>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.comprehension_orale === true || editingStudent.comprehension_orale === 1} onChange={e => setEditingStudent({...editingStudent, comprehension_orale: e.target.checked})} />
                    C. Orale
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.ecriture === true || editingStudent.ecriture === 1} onChange={e => setEditingStudent({...editingStudent, ecriture: e.target.checked})} />
                    Écriture
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.vocabulaire === true || editingStudent.vocabulaire === 1} onChange={e => setEditingStudent({...editingStudent, vocabulaire: e.target.checked})} />
                    Vocabulaire
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.grammaire === true || editingStudent.grammaire === 1} onChange={e => setEditingStudent({...editingStudent, grammaire: e.target.checked})} />
                    Grammaire
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.conjugaison === true || editingStudent.conjugaison === 1} onChange={e => setEditingStudent({...editingStudent, conjugaison: e.target.checked})} />
                    Conjugaison
                  </label>
                  <label className={styles.checkboxItem}>
                    <input type="checkbox" checked={editingStudent.production_ecrite === true || editingStudent.production_ecrite === 1} onChange={e => setEditingStudent({...editingStudent, production_ecrite: e.target.checked})} />
                    P. Écrite
                  </label>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.classBtn} style={{width: 'auto', border: '1px solid var(--border-color)'}} onClick={() => setEditingStudent(null)}>Annuler</button>
                <button type="submit" className={styles.primaryBtn}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
