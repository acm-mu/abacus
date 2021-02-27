import { User } from "../../types";

declare global {
  namespace Express {
    export interface Request {
      user: User
    }
  }
}