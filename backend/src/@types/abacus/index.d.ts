declare module "abacus" {

  /** 
   * @swagger
   * components:
   *   schemas:
   *     Settings:
   *       properties:
   *         competition_name:
   *            type: string
   *         practice_name:
   *            type: string
   *         points_per_yes:
   *            type: number
   *         points_per_no:
   *            type: number
   *         points_per_compilation_error:
   *            type: number
   *         points_per_minute:
   *            type: number
   *         start_date:
   *            type: number
   *         end_date:
   *            type: number
   *         practice_start_date:
   *            type: number
   *         practice_end_date:
   *            type: number
   *       required:
   *         - competition_name
   *         - practice_name
   *         - points_per_yes
   *         - points_per_no
   *         - points_per_compilation_error
   *         - points_per_minute
   *         - start_date
   *         - end_date
   *         - practice_start_date
   *         - practice_end_date
   */
  export interface Settings extends Record<string, string | number> {
      competition_name: string;
      practice_name: string;
      points_per_yes: number;
      points_per_no: number;
      points_per_compilation_error: number;
      points_per_minute: number;
      start_date: number;
      end_date: number;
      practice_start_date: number;
      practice_end_date: number;
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
 *             $ref: '#/definitions/Test'
 *         claimed:
 *           type: string
 *         viewed:
 *           type: boolean
 *         flagged:
 *           type: string
 *       required:
 *         - sid
 *         - date
 *         - filename
 *         - filesize
 *         - source
 *         - language
 *         - md5
 *         - pid
 *         - runtime
 *         - released
 *         - score
 *         - status
 *         - sub_no
 *         - tid
 *         - tests
 */
  export interface Submission extends Record<string, unknown> {
      sid: string;
      date: number;
      filename: string;
      filesize: number;
      source: string;
      project_id?: string;
      language: string;
      md5: string;
      pid: string;
      runtime: number;
      released: boolean;
      score: number;
      status: string;
      sub_no: number;
      tid: string;
      tests: Test[];
      claimed?: string;
      viewed?: boolean;
      flagged?: string;
  }
  /**
   * @swagger
   * components:
   *   Problem:
   *     schemas:
   *       properties:
   *         pid: 
   *           type: string
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
   *             $ref: '#/definitions/Skeleton'
   *         tests:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Test'
   *       required:
   *         - pid
   *         - id
   *         - division
   *         - name
   *         - description
   *         - cpu_time_limit
   *         - memory_limit
   *         - tests
   */
  export interface Problem extends Record<string, unknown> {
      pid: string;
      practice?: boolean;
      id: string;
      division: string;
      name: string;
      description: string;
      cpu_time_limit: number;
      memory_limit: number;
      skeletons?: Skeleton[];
      tests: Test[];
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
   *       required:
   *         - uid
   *         - role
   *         - username
   *         - password
   *         - display_name
   */
  export interface User extends Record<string, unknown> {
      uid: string;
      role: string;
      username: string;
      password: string;
      display_name: string;
      division?: string;
      school?: string;
      disabled?: boolean;
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
   *       required:
   *         - in
   *         - out
   *         - result
   */
  export interface Test extends Record<string, unknown> {
      in: string;
      out: string;
      result: string;
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
   *       required:
   *         - language
   *         - source
   *         - file_name
   */
  export interface Skeleton extends Record<string, unknown> {
      language: string;
      source: string;
      file_name: string;
  }
  export interface ProblemScore extends Record<string, unknown> {
      num_submissions: number;
      problem_score: number;
      solved: boolean;
      submissions: Submission[];
  }
  export interface StandingsUser extends Record<string, unknown> {
      display_name: string;
      uid: string;
      username: string;
      solved: number;
      time: number;
      problems: { [key: string]: ProblemScore };
  }

  /** 
   * @swagger
   * components:
   *   schemas:
   *     Context:
   *       properties:
   *         type:
   *           type: string
   *           enum:
   *             - cid
   *             - pid
   *             - sid
   *         id:
   *           type: string
   *       required:
   *         - type
   *         - id
   */
  export interface Context extends Record<string, unknown> {
      type: 'pid' | 'cid' | 'sid';
      id: string;
  }

  /** 
   * @swagger
   * components:
   *   schemas:
   *     Clarification:
   *       properties:
   *         cid:
   *           type: string
   *         body:
   *           type: string
   *         uid:
   *           type: string
   *         date:
   *           type: integer
   *         open:
   *           type: boolean
   *         parent:
   *           type: string
   *         division:
   *           type: string
   *         type:
   *           type: string
   *         title:
   *           type: string
   *         context:
   *           $ref: '#/definition/Context'
   *         children:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Clarification'
   *       required:
   *         - cid
   *         - body
   *         - uid
   *         - date
   */
  export interface Clarification extends Record<string, unknown> {
      cid: string;
      body: string;
      uid: string;
      date: number;
      open?: boolean;
      parent?: string;
      division?: string;
      type?: string;
      title?: string;
      context?: Context;
      children?: Clarification[]
  }

  export interface Notification extends Record<string, unknown> {
      header?: string;
      to?: string;
      content: string;
      id?: string;
      context?: Context;
      type?: 'success' | 'warning' | 'error';
  }
}