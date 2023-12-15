declare module 'abacus' {
  /**
   * @swagger
   * components:
   *   schemas:
   *     NewProblem:
   *       properties:
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
  export interface ProblemModel extends Record<string, unknown> {
    pid: string
    id: string
    division: string
    name: string
    description?: string
    cpu_time_limit?: number
    memory_limit?: number
    skeletons?: SkeletonModel[]
    tests?: TestModel[]
  }
}