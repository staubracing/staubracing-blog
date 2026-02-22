/**
 * Mock Calendar Events
 * Based on actual racing schedule - will be replaced with Google Calendar API
 */

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string;
  location: string;
  type: 'race' | 'trackday' | 'test';
  description?: string;
  org?: string; // WERA, CVMA, etc.
}

// Realistic mock data based on actual racing schedule
export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'NCBIKE',
    start: '2025-03-08',
    end: '2025-03-09',
    location: 'Henderson, NC',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 1',
  },
  {
    id: '2',
    title: 'Road Atlanta',
    start: '2025-03-15',
    end: '2025-03-16',
    location: 'Braselton, GA',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 2',
  },
  {
    id: '3',
    title: 'NCBIKE',
    start: '2025-03-22',
    end: '2025-03-23',
    location: 'Henderson, NC',
    type: 'trackday',
    org: 'N2',
    description: 'N2 Track Days',
  },
  {
    id: '4',
    title: 'VIR',
    start: '2025-04-05',
    end: '2025-04-06',
    location: 'Alton, VA',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 3',
  },
  {
    id: '5',
    title: 'Barber Motorsports Park',
    start: '2025-04-12',
    end: '2025-04-13',
    location: 'Birmingham, AL',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 4',
  },
  {
    id: '6',
    title: 'NCBIKE',
    start: '2025-04-26',
    end: '2025-04-27',
    location: 'Henderson, NC',
    type: 'race',
    org: 'CVMA',
    description: 'CVMA Round 6',
  },
  {
    id: '7',
    title: 'Road Atlanta',
    start: '2025-05-03',
    end: '2025-05-04',
    location: 'Braselton, GA',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 5',
  },
  {
    id: '8',
    title: 'PittRace',
    start: '2025-05-17',
    end: '2025-05-18',
    location: 'Wampum, PA',
    type: 'race',
    org: 'WERA',
    description: 'WERA National Challenge Series - Round 6',
  },
];

/**
 * Format date range for display
 * e.g., "Mar 8-9" or "Mar 28-30"
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const startMonth = months[startDate.getMonth()];
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  // Same month
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startMonth} ${startDay}-${endDay}`;
  }

  // Different months (rare but handle it)
  const endMonth = months[endDate.getMonth()];
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

/**
 * Get events grouped by month
 */
export function getEventsByMonth(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  events.forEach(event => {
    const date = new Date(event.start);
    const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;

    if (!grouped.has(monthYear)) {
      grouped.set(monthYear, []);
    }
    grouped.get(monthYear)!.push(event);
  });

  return grouped;
}
