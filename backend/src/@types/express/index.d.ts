import { User } from 'abacus'
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
