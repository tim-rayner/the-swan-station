export interface IResetLog {
  resetTime: Date;
  user: string;
}

export interface IIncidentLog {
  incidentTime: Date;
}

export interface IEvent {
  eventTime: Date;
  eventType: string;
  details?: string;
}

export interface ICountdown extends Document {
  currentTime: number; // In seconds, the remaining time of the countdown
  startTime: Date; // When the countdown timer was started
  isRunning: boolean; // Whether the countdown timer is running
  incidentOccurred: boolean; // Whether an incident has occurred (e.g., timer reached zero)
  events: IEvent[]; // Array of events that have occurred
  lastUpdated: Date; // When the countdown was last updated
  resetLogs: IResetLog[]; // Array of reset logs
  incidentLogs: IIncidentLog[]; // Array of incident logs
}
