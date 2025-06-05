import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  // const options: Intl.DateTimeFormatOptions = {
  //   day: 'numeric',
  //   month: 'long',
  //   year: 'numeric',
  // };
  // return date.toLocaleDateString('en-US', options); // 'en-US' untuk format bulan bahasa Inggris

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
};
