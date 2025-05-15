
// Utility functions shared between CallTracker, ContactManager, etc

// Format call duration from seconds to MM:SS
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format date to local human-readable string
export function formatDate(dateString: string, language: string = 'en') {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

// Get time since
export function getTimeSince(dateString: string, language: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 0) {
    return language === 'de'
      ? `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`
      : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffHours > 0) {
    return language === 'de'
      ? `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`
      : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMinutes > 0) {
    return language === 'de'
      ? `vor ${diffMinutes} ${diffMinutes === 1 ? 'Minute' : 'Minuten'}`
      : `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return language === 'de' ? 'gerade eben' : 'just now';
  }
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
