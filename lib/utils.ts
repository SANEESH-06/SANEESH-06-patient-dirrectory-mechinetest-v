import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function formatIssue(issue: string) {
  return issue
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatAgeRange(minimum: number | null, maximum: number | null) {
  if (minimum === null && maximum === null) {
    return 'Any age';
  }

  if (minimum !== null && maximum !== null) {
    return `${minimum}-${maximum}`;
  }

  if (minimum !== null) {
    return `${minimum}+`;
  }

  return `Up to ${maximum}`;
}

export function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || 'PT';
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while loading the patient directory.';
}
