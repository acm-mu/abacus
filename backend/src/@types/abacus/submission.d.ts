import type { Test, User } from "abacus";

declare module 'abacus' {

  interface RawSubmission extends Record<string, unknown> {
    sid: string
    date: number
    filename: string
    filesize: number
    source: string
    project_id?: string
    language: string
    md5: string
    pid: string
    runtime: number
    released: boolean
    score: number
    status: string
    sub_no: number
    tid: string
    tests: Test[]
    claimed?: string | User
    viewed?: boolean
    flagged?: string | User
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     Submission:
   *       properties:
   *         sid:
   *           type: string
   *         date:
   *           type: integer
   *         filename:
   *           type: string
   *         filesize:
   *           type: integer
   *         source:
   *           type: string
   *         project_id:
   *           type: string
   *         language:
   *           type: string
   *         md5:
   *           type: string
   *         pid:
   *           type: string
   *         runtime:
   *           type: integer
   *         released:
   *           type: boolean
   *         score:
   *           type: integer
   *         status:
   *           type: string
   *         sub_no:
   *           type: integer
   *         tid:
   *           type: string
   *         tests:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Test'
   *         claimed:
   *           type: string
   *         viewed:
   *           type: boolean
   *         flagged:
   *           type: string
   *       required: [sid, date, filename, filesize, source, language, md5, pid, runtime, released, score, status, sub_no, tid, tests]
   */
  export interface Submission extends RawSubmission {
    claimed?: string
    flagged?: string
  }

  export interface ResolvedSubmission extends RawSubmission {
    team: User
    problem: Problem
    claimed?: User
    flagged?: User
  }
}