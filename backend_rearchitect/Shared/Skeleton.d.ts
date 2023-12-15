declare module 'abacus' {
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
  export interface SkeletonModel extends Record<string, unknown> {
    language: string
    source: string
    file_name: string
  }
}