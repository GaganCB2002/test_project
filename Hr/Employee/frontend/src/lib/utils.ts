import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, differenceInMinutes } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch {
    return dateString;
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'HIGH':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'MEDIUM':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'LOW':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'REVIEW':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'PENDING':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'APPROVED':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}