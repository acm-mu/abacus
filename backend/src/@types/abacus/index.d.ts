import { AttributeValue } from "@aws-sdk/client-dynamodb";

declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     Settings:
   *       properties:
   *         competition_name:
   *           type: string
   *           example: "Example Competition"
   *         points_per_yes:
   *           type: string
   *           example: "0"
   *         points_per_no:
   *           type: string
   *           example: "20"
   *         points_per_compilation_error:
   *           type: string
   *           example: "0"
   *         points_per_minute:
   *           type: string
   *           example: "1"
   *         start_date:
   *           type: string
   *           example: "1618496100"
   *         end_date:
   *           type: string
   *           example: "1618516800"
   *       required: [competition_name, points_per_yes, points_per_no, points_per_compilation_error, points_per_minute, start_date, end_date]
   */
  export interface Settings extends Record<string, string | number> {
    competition_name: string
    points_per_yes: number
    points_per_no: number
    points_per_compilation_error: number
    points_per_minute: number
    start_date: number
    end_date: number
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     Test:
   *       properties:
   *         in:
   *           type: string
   *         out:
   *           type: string
   *         result:
   *           type: string
   *       required: [in, out, result]
   */
  export interface Test extends Record<string, unknown> {
    in: string
    out: string
    result: string
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     Skeleton:
   *       properties:
   *         language:
   *           type: string
   *         source:
   *           type: string
   *         file_name:
   *           type: string
   *       required: [language, source, file_name]
   */
  export interface Skeleton extends Record<string, unknown> {
    language: string
    source: string
    file_name: string
  }
  export interface ProblemScore extends Record<string, unknown> {
    num_submissions: number
    problem_score: number
    solved: boolean
    submissions: Submission[]
  }
  export interface StandingsUser extends Record<string, unknown> {
    display_name: string
    uid: string
    username: string
    solved: number
    time: number
    problems: { [key: string]: ProblemScore }
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     Context:
   *       properties:
   *         type:
   *           type: string
   *           enum: [cid, pid, sid]
   *         id:
   *           type: string
   *       required: [type, id]
   */
  export interface Context extends Record<string, unknown> {
    type: 'pid' | 'cid' | 'sid'
    id: string
  }

  export interface Notification extends Record<string, unknown> {
    header?: string
    to?: string
    content: string
    id?: string
    context?: Context
    type?: 'success' | 'warning' | 'error'
  }

  export type Item = Record<string, unknown>
  
  export type Items<T = Item> = {
    totalItems: number
    items: T[]
  }
  
  export type Args = Record<string, unknown>
}