/**
 * Extend Request interface by declaration merging
 */
declare namespace Express {
    interface Request {
      auth?: {
        username: string,
        role: string,
        iat: number,
        exp: number
      };
    }
  }