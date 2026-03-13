'use client';

import { useState } from 'react';

import { getInitials, cn } from '@/lib/utils';

interface PatientAvatarProps {
  name: string;
  photoUrl: string | null;
  size?: 'sm' | 'md';
}

const avatarSizes = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-8 w-8 text-[11px]',
};

export function PatientAvatar({
  name,
  photoUrl,
  size = 'md',
}: PatientAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const showImage = Boolean(photoUrl) && !hasImageError;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-full border border-slate-200 bg-[#dfeaff] text-[#2f67d8]',
        avatarSizes[size],
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasImageError(true)}
          src={photoUrl ?? undefined}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#dfeaff] font-semibold">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
