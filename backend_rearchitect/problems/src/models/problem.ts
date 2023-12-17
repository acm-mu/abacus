import { ProblemType } from 'abacus'
import mongoose, { Document, Schema } from 'mongoose'
import { skeletonSchema } from './skeleton'
import { testSchema } from './test'


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

export interface Problem extends ProblemType, Document { }

const problemSchema = new Schema<Problem>({
  pid: { type: String, required: true },
  id: { type: String },
  division: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  cpu_time_limit: { type: Number },
  memory_limit: { type: Number },
  skeletons: { type: [skeletonSchema] },
  tests: { type: [testSchema] }
})

const ProblemModel = mongoose.model<Problem>('Problem', problemSchema, 'problem')

export default ProblemModel


