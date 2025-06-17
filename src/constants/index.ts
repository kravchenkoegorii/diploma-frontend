export enum STAGES {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export const STAGE = (import.meta.env.VITE_STAGE ||
  STAGES.DEVELOPMENT) as STAGES;

export const MAX_MESSAGE_LENGTH = 200;
