import { config } from 'dotenv';

// Singleton Config Class
export class Config {
  private static instance: Config;
  private env: NodeJS.ProcessEnv;

  private constructor() {
    config();
    this.env = process.env;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // Encapsulation - getter methods
  get mongoUri(): string {
    return this.env.MONGODB_URI || 'mongodb://localhost:27017/popcat';
  }

  get apiPort(): number {
    // Support both BACKEND_PORT and API_PORT for backwards compatibility
    return parseInt(this.env.BACKEND_PORT || this.env.API_PORT || '3001');
  }

  get isDevelopment(): boolean {
    return this.env.NODE_ENV !== 'production';
  }

  get corsOrigin(): string {
    return this.env.CORS_ORIGIN || '*';
  }
}
