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
   *         practice_name:
   *           type: string
   *           example: "Pre-Competition Practice"
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
   *         practice_start_date:
   *           type: string
   *           example: "1618495200"
   *         practice_end_date:
   *           type: string
   *           example: "1618496100"
   *       required: [competition_name, practice_name, points_per_yes, points_per_no, points_per_compilation_error, points_per_minute, start_date, end_date, practice_start_date, practice_end_date]
   */
  export interface Settings extends Record<string, string | number> {
    competition_name: string
    practice_name: string
    points_per_yes: number
    points_per_no: number
    points_per_compilation_error: number
    points_per_minute: number
    start_date: number
    end_date: number
    practice_start_date: number
    practice_end_date: number
  }

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

  /**
   * @swagger
   * components:
   *   schemas:
   *     NewProblem:
   *       properties:
   *         practice:
   *           type: boolean
   *         id:
   *           type: string
   *         division:
   *           type: string
   *         name:
   *           type: string
   *         description:
   *           type: string
   *         cpu_time_limit:
   *           type: integer
   *         memory_limit:
   *           type: integer
   *         skeletons:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Skeleton'
   *         tests:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/Test'
   *         capped_points:
   *           type: integer
   *         max_points:
   *           type: integer
   *         project_id:
   *           type: string
   *         design_document:
   *           type: boolean
   *     Problem:
   *       allOf:
   *         - type: object
   *           properties:
   *             pid:
   *               type: string
   *         - $ref: '#/components/schemas/NewProblem'
   */
  export interface Problem extends Record<string, unknown> {
    pid: string
    practice?: boolean
    id: string
    division: string
    name: string
    description: string
    cpu_time_limit: number
    memory_limit: number
    skeletons?: Skeleton[]
    tests: Test[]
  }

  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       properties:
   *         uid:
   *           type: string
   *         role:
   *           type: string
   *           enum: [admin, judge, user]
   *         username:
   *           type: string
   *         password:
   *           type: string
   *         display_name:
   *           type: string
   *         division:
   *           type: string
   *         school:
   *           type: string
   *         disabled:
   *           type: boolean
   *       required: [uid, role, username, password, display_name]
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     AuthUser:
   *       properties:
   *         accessToken:
   *           type: string
   *         uid:
   *           type: string
   *         display_name:
   *           type: string
   *         role:
   *           type: string
   *           enum: [user, judge, admin]
   *           example: 'user'
   *         username:
   *           type: string
   */
  export interface User extends Record<string, unknown> {
    uid: string
    role: string
    username: string
    password: string
    display_name: string
    division?: string
    school?: string
    disabled?: boolean
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

  /**
   * @swagger
   * components:
   *   schemas:
   *     NewClarification:
   *       properties:
   *         body:
   *           type: string
   *         parent:
   *           type: string
   *         division:
   *           type: string
   *         title:
   *           type: string
   *         type:
   *           type: string
   *         context:
   *           $ref: '#/components/schemas/Context'
   *       required: [body]
   *     Clarification:
   *       allOf:
   *         - type: object
   *           properties:
   *             cid:
   *               type: string
   *             uid:
   *               type: string
   *             date:
   *               type: string
   *               format: date
   *             open:
   *               type: boolean
   *             children:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Clarification'
   *           required: [cid, body, uid, date]
   *         - $ref: '#/components/schemas/NewClarification'
   */
  export interface Clarification extends Record<string, unknown> {
    cid: string
    body: string
    uid: string
    date: number
    open?: boolean
    parent?: string
    division?: string
    type?: string
    title?: string
    context?: Context
    children?: Clarification[]
  }

  export interface Notification extends Record<string, unknown> {
    header?: string
    to?: string
    content: string
    id?: string
    context?: Context
    type?: 'success' | 'warning' | 'error'
  }

  export interface Standing extends Record<string, unknown> {
    division: string
    problems: Problem[]
    standings: any
    time_updated: number
  }
  
  export type Item = Record<string, unknown>
  export type Args = Record<string, unknown>
}
