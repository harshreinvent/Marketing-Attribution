export class SyncStepError extends Error {
  constructor(public step: string, message: string) {
    super(`[${step}] ${message}`);
  }
}

export class IntegrationError extends Error {
  constructor(public platform: string, message: string) {
    super(`[${platform}] ${message}`);
  }
}

export class NormalisationError extends Error {
  constructor(message: string) {
    super(message);
  }
}
