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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

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
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nom complet</th>
                      <th style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={2} className={styles.emptyState}>Aucun étudiant dans cette classe.</td>
                      </tr>
                    ) : (
                      students.map(s => (
                        <tr key={s.id}>
                          <td>
                            <div className={styles.studentNameWrapper}>
                              <div className={styles.avatar}>{s.name.charAt(0).toUpperCase()}</div>
                              <span className={styles.studentName}>{s.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <button className={styles.iconBtnEdit} title="Modifier">
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
    </div>
  );
}
