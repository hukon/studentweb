"use client";

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Save, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './seating.module.css';

interface Student {
  id: number;
  name: string;
}

interface Seat {
  row_num: number;
  col_num: number;
  student_id: number | null;
}

export default function SeatingPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const ROWS = 6;
  const COLS = 6;

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      loadClassData(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
    if (data.length > 0) setSelectedClass(data[0].id.toString());
    setIsLoading(false);
  };

  const loadClassData = async (classId: string) => {
    setIsLoading(true);
    const [studentsRes, seatsRes] = await Promise.all([
      fetch(`/api/students?classId=${classId}`),
      fetch(`/api/seating?classId=${classId}`)
    ]);
    const studentData: Student[] = await studentsRes.json();
    const seatData: any[] = await seatsRes.json();

    setStudents(studentData);

    // Initialize full grid
    const grid: Seat[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const existing = seatData.find(s => s.row_num === r && s.col_num === c);
        // Ensure the student actually still exists in this class
        const studentExists = existing ? studentData.some(stu => stu.id === existing.student_id) : false;
        
        grid.push({
          row_num: r,
          col_num: c,
          student_id: studentExists ? existing.student_id : null,
        });
      }
    }
    setSeats(grid);
    setIsLoading(false);
  };

  const saveSeating = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = seats.filter(s => s.student_id !== null).map((s, index) => ({
        ...s,
        seat_num: index // legacy schema required seat_num
      }));

      const res = await fetch('/api/seating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass, seats: payload })
      });

      if (!res.ok) throw new Error();
      setMessage({ text: 'Plan de classe sauvegardé !', type: 'success' });
    } catch (e) {
      setMessage({ text: 'Erreur lors de la sauvegarde.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const generateAISeating = () => {
    // Simple AI algorithm: scatter students alphabetically across the grid
    const grid = [...seats];
    grid.forEach(s => s.student_id = null); // clear grid
    
    // Sort students alphabetically
    const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));
    
    let studentIdx = 0;
    // We try to fill starting from the front (row 0), alternating columns
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // pattern to ensure some spacing if few students (e.g., skip every other seat)
        if (studentIdx < sortedStudents.length) {
          if ((r + c) % 2 === 0 || sortedStudents.length > (ROWS * COLS) / 2) {
             const cellIndex = grid.findIndex(s => s.row_num === r && s.col_num === c);
             if (cellIndex !== -1 && !grid[cellIndex].student_id) {
               grid[cellIndex].student_id = sortedStudents[studentIdx].id;
               studentIdx++;
             }
          }
        }
      }
    }
    
    // Fill remaining if the alternating pattern skipped too many
    for (let i = 0; i < grid.length && studentIdx < sortedStudents.length; i++) {
      if (!grid[i].student_id) {
        grid[i].student_id = sortedStudents[studentIdx].id;
        studentIdx++;
      }
    }
    setSeats(grid);
  };

  const handleDragStart = (e: React.DragEvent, sourceStudentId: number, sourceIndex: number | 'unassigned') => {
    e.dataTransfer.setData('studentId', sourceStudentId.toString());
    e.dataTransfer.setData('sourceIndex', sourceIndex.toString());
  };

  const handleDrop = (e: React.DragEvent, targetRow: number, targetCol: number) => {
    e.preventDefault();
    const studentId = parseInt(e.dataTransfer.getData('studentId'));
    const sourceIndex = e.dataTransfer.getData('sourceIndex');
    
    if (isNaN(studentId)) return;

    const newSeats = [...seats];
    const targetSeatIndex = newSeats.findIndex(s => s.row_num === targetRow && s.col_num === targetCol);
    
    // Determine existing occupant of target cell
    const targetOccupantId = newSeats[targetSeatIndex].student_id;

    if (sourceIndex !== 'unassigned') {
      // It came from another cell, swap them
      const srcIdx = parseInt(sourceIndex);
      newSeats[srcIdx].student_id = targetOccupantId;
    } 

    newSeats[targetSeatIndex].student_id = studentId;
    setSeats(newSeats);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Find students not currently assigned a seat
  const getUnassignedStudents = () => {
    const assignedIds = seats.map(s => s.student_id).filter(id => id !== null);
    return students.filter(s => !assignedIds.includes(s.id));
  };

  const unassigned = getUnassignedStudents();

  if (isLoading) return <div className={styles.loader}>Chargement du plan de classe...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <LayoutGrid size={28} className={styles.headerIcon} />
            <h1>Plan de Classe</h1>
          </div>
          <p className={styles.subtitle}>Organisez les places par simple glisser-déposer.</p>
        </div>

        <div className={styles.headerActions}>
           <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.classSelect}
            >
              {classes.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          <button className={styles.aiBtn} onClick={generateAISeating}>
            <Sparkles size={18} />
            Placement Magique
          </button>
          <button className={styles.saveBtn} onClick={saveSeating} disabled={isSaving}>
            <Save size={18} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`${styles.messageBanner} ${message.type === 'success' ? styles.success : styles.error}`}>
          <AlertCircle size={18} /> {message.text}
        </div>
      )}

      <div className={styles.workspace}>
        <div className={styles.unassignedPanel}>
          <h3 className={styles.panelTitle}>Élèves à placer ({unassigned.length})</h3>
          <div className={styles.unassignedList}>
            <AnimatePresence>
              {unassigned.map(student => (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={styles.studentChip}
                  draggable
                  onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, student.id, 'unassigned')}
                >
                  <div className={styles.avatar}>{student.name.charAt(0).toUpperCase()}</div>
                  <span className={styles.chipName}>{student.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {unassigned.length === 0 && (
              <p className={styles.emptyText}>Tous les élèves sont placés.</p>
            )}
          </div>
          {/* A drop zone to remove a student from the grid */}
          <div 
             className={styles.removeFromGridZone}
             onDragOver={handleDragOver}
             onDrop={(e) => {
                e.preventDefault();
                const sourceIndex = e.dataTransfer.getData('sourceIndex');
                if (sourceIndex !== 'unassigned') {
                  const newSeats = [...seats];
                  newSeats[parseInt(sourceIndex)].student_id = null;
                  setSeats(newSeats);
                }
             }}
          >
             Faites glisser ici pour retirer de la grille
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.teacherDesk}>Bureau du Professeur</div>
          <div className={styles.seatingGrid}>
            {seats.map((seat, index) => {
              const student = seat.student_id ? students.find(s => s.id === seat.student_id) : null;
              
              return (
                <div 
                  key={index} 
                  className={`${styles.seatCell} ${student ? styles.occupied : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, seat.row_num, seat.col_num)}
                >
                  {student ? (
                    <motion.div 
                      layoutId={`student-${student.id}`}
                      className={styles.seatedStudent}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, student.id, index)}
                    >
                      <div className={styles.avatarSeated}>{student.name.charAt(0).toUpperCase()}</div>
                      <span className={styles.seatedName}>{student.name.split(' ')[0]}</span>
                    </motion.div>
                  ) : (
                    <span className={styles.emptySeatText}>Vide</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
