export type DateRange = {
  from: Date;
  to: Date;
};

export type StepResult = {
  step: string;
  success: boolean;
  rowsProcessed?: number;
  error?: string;
  durationMs?: number;
};

export type SyncResult = {
  clientId: string;
  steps: StepResult[];
  success: boolean;
  startedAt: Date;
  finishedAt: Date;
};

export type SyncJob = {
  clientId: string;
  triggeredBy: "schedule" | "manual";
  dateRange?: DateRange;
};
