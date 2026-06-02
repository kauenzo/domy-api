declare module 'passport-jwt' {
  export interface StrategyOptions {
    jwtFromRequest: (request: unknown) => string | null;
    ignoreExpiration?: boolean;
    secretOrKey: string;
  }

  export class Strategy {
    constructor(
      options: StrategyOptions,
      verify: (
        payload: unknown,
        done: (error: unknown, user?: unknown) => void,
      ) => void,
    );
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken: () => (request: unknown) => string | null;
    fromBodyField: (field: string) => (request: unknown) => string | null;
  };
}
