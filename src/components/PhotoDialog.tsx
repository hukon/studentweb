"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Trash2, X } from 'lucide-react';
import Avatar, { PhotoStudent } from './Avatar';
import styles from './photoDialog.module.css';

const PREVIEW = 280; // crop box, in CSS px
const OUTPUT = 400; // saved image, in px
const MAX_BYTES = 200 * 1024;

interface PhotoDialogProps {
  student: PhotoStudent;
  onClose: () => void;
  onChanged: () => void;
}

export default function PhotoDialog({ student, onClose, onChanged }: PhotoDialogProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const scaleOf = useCallback((image: HTMLImageElement, z: number) => Math.max(PREVIEW / image.width, PREVIEW / image.height) * z, []);

  // Keep the image covering the whole crop box
  const clamp = useCallback(
    (image: HTMLImageElement, z: number, o: { x: number; y: number }) => {
      const s = scaleOf(image, z);
      return {
        x: Math.min(0, Math.max(PREVIEW - image.width * s, o.x)),
        y: Math.min(0, Math.max(PREVIEW - image.height * s, o.y)),
      };
    },
    [scaleOf]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement, size: number) => {
      if (!img) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const r = size / PREVIEW;
      const s = scaleOf(img, zoom);
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, offset.x * r, offset.y * r, img.width * s * r, img.height * s * r);
    },
    [img, zoom, offset, scaleOf]
  );

  useEffect(() => {
    if (canvasRef.current) draw(canvasRef.current, PREVIEW);
  }, [draw]);

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("Ce fichier n'est pas une image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setZoom(1);
      const s = Math.max(PREVIEW / image.width, PREVIEW / image.height);
      // Start centred
      setOffset({ x: (PREVIEW - image.width * s) / 2, y: (PREVIEW - image.height * s) / 2 });
      setError('');
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError("Impossible de lire cette image.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const changeZoom = (z: number) => {
    if (!img) return;
    // Zoom around the centre of the crop box
    const old = scaleOf(img, zoom);
    const next = scaleOf(img, z);
    const cx = (PREVIEW / 2 - offset.x) / old;
    const cy = (PREVIEW / 2 - offset.y) / old;
    setZoom(z);
    setOffset(clamp(img, z, { x: PREVIEW / 2 - cx * next, y: PREVIEW / 2 - cy * next }));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!img) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!img || !drag.current) return;
    setOffset(clamp(img, zoom, { x: drag.current.ox + e.clientX - drag.current.x, y: drag.current.oy + e.clientY - drag.current.y }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const toWebp = (quality: number) =>
    new Promise<Blob | null>(resolve => {
      const out = document.createElement('canvas');
      out.width = OUTPUT;
      out.height = OUTPUT;
      draw(out, OUTPUT);
      out.toBlob(resolve, 'image/webp', quality);
    });

  const save = async () => {
    if (!img) return;
    setBusy(true);
    setError('');
    try {
      let blob = await toWebp(0.8);
      if (blob && blob.size > MAX_BYTES) blob = await toWebp(0.6);
      if (!blob || blob.type !== 'image/webp') throw new Error("Ce navigateur ne sait pas créer d'image WebP.");
      if (blob.size > MAX_BYTES) throw new Error('Photo trop lourde, essayez une autre image.');

      const res = await fetch(`/api/students/${student.id}/photo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/webp' },
        body: blob,
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Échec de l'enregistrement.");
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/students/${student.id}/photo`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      onChanged();
      onClose();
    } catch {
      setError('Échec de la suppression.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()} role="dialog" aria-label={`Photo de ${student.name}`}>
        <div className={styles.header}>
          <h2>Photo de {student.name}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {img ? (
          <div className={styles.cropArea}>
            <canvas
              ref={canvasRef}
              width={PREVIEW}
              height={PREVIEW}
              className={styles.canvas}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            <label className={styles.zoom}>
              Zoom
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => changeZoom(Number(e.target.value))} />
            </label>
            <p className={styles.hint}>Glissez l&apos;image pour la cadrer.</p>
          </div>
        ) : (
          <label
            className={`${styles.drop} ${dragOver ? styles.dropActive : ''}`}
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              loadFile(e.dataTransfer.files[0]);
            }}
          >
            <Avatar student={student} size={96} />
            <span className={styles.dropText}>
              <Camera size={18} /> Choisir, déposer ou prendre une photo
            </span>
            <input type="file" accept="image/*" capture="user" hidden onChange={e => loadFile(e.target.files?.[0])} />
          </label>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          {student.has_photo && !img && (
            <button className={styles.removeBtn} onClick={remove} disabled={busy}>
              <Trash2 size={16} /> Supprimer la photo
            </button>
          )}
          {img && (
            <label className={styles.secondaryBtn}>
              Autre image
              <input type="file" accept="image/*" hidden onChange={e => loadFile(e.target.files?.[0])} />
            </label>
          )}
          <button className={styles.secondaryBtn} onClick={onClose}>
            Annuler
          </button>
          {img && (
            <button className={styles.saveBtn} onClick={save} disabled={busy}>
              {busy ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
