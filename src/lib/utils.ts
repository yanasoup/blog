import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const;

  return date.toLocaleString('en-GB', options).replace(',', '');
};

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
