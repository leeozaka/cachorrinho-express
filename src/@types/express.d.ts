import { User } from 'dtos/UserDTO';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
