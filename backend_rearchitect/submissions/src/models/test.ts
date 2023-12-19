import { TestType } from 'abacus'
import { Schema } from "mongoose"

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


interface Test extends TestType, Document { }
export const testSchema = new Schema<Test>({

})
