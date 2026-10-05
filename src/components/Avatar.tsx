"use client";

import React, { useState } from 'react';
import styles from './avatar.module.css';

export interface PhotoStudent {
  id: number;
  name: string;
  has_photo?: boolean;
  photo_updated_at?: string | null;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#14b8a6'];

export function photoUrl(student: PhotoStudent) {
  return `/api/students/${student.id}/photo?v=${encodeURIComponent(student.photo_updated_at || '')}`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.length === 1 ? parts[0].slice(0, 1) : parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1);
  return letters.toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  student: PhotoStudent;
  size?: number;
}

export default function Avatar({ student, size = 32 }: AvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const url = photoUrl(student);
  const showPhoto = !!student.has_photo && failedUrl !== url;
  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.4)) };

  if (showPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={student.name} className={styles.avatar} style={style} onError={() => setFailedUrl(url)} />
    );
  }
  return (
    <div className={styles.avatar} style={{ ...style, background: colorFor(student.name), color: '#fff' }} aria-label={student.name}>
      {initials(student.name)}
    </div>
  );
}
