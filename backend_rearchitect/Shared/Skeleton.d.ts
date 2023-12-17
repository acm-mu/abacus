declare module 'abacus' {
  export interface SkeletonType extends Record<string, unknown> {
    language: string
    source: string
    file_name: string
  }
}