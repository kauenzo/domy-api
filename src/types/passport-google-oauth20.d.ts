declare module 'passport-google-oauth20' {
  export interface Profile {
    id: string;
    displayName?: string;
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export class Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: unknown, user?: unknown) => void,
      ) => void | Promise<void>,
    );
  }
}
