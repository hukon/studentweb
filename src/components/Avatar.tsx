"use client";

import React, { useState } from 'react';
import styles from './avatar.module.css';

export interface PhotoStudent {
  id: number;
  name: string;
  has_photo?: boolean;
  photo_updated_at?: string | null;
}

export function photoUrl(student: PhotoStudent) {
  return `/api/students/${student.id}/photo?v=${encodeURIComponent(student.photo_updated_at || '')}`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.length === 1 ? parts[0].slice(0, 1) : parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1);
  return letters.toUpperCase();
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
    <div className={styles.avatar} style={style} aria-label={student.name}>
      {initials(student.name)}
    </div>
  );
}
