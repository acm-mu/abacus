import { SkeletonType } from "abacus";
import { Schema } from "mongoose";

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

interface Skeleton extends SkeletonType, Document { }
export const skeletonSchema = new Schema<Skeleton>({

})
