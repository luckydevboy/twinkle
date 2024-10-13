declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET: string;
    PORT: string;
    NODE_ENV: string;
    ALLOWED_ORIGIN: string;
  }
}
