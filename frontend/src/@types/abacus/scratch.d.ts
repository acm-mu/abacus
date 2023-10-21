declare module 'abacus' {
  export interface IScratchProject {
    title: string
    description: string
    public: boolean
    visibility: string
    is_published: boolean
    author: {
      username: string
    },
    history: {
      created: string
      modified: string
      shared: string
    }
  }
}