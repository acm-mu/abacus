import { Router, Request, Response } from 'express'
import auth from './auth'
import clarifications from './clarifications'
import contest from './contest'
import problems from './problems'
import scratch from './scratch'
import standings from './standings'
import submissions from './submissions'
import users from './users'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const api = Router()

// Only show swagger docs on local environment
if (process.env.NODE_ENV == 'development') {
  api.use('/swagger.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(
      swaggerJsdoc({
        swaggerDefinition: {
          openapi: '3.0.0',
          info: {
            title: 'Abacus API',
            version: '1.0.0',
            description: 'API for codeabac.us'
          }
        },
        apis: ['**/*.ts', '**/*.d.ts']
      })
    )
  })

  api.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json'
      }
    })
  )
  api.get('/', (_, res) => res.redirect('/docs')) // Redirects to docss
} else {
  api.get('/', (_, res) => res.send(' ')) // Sends 200 OK when AWS EBS pings server for health check
}

api.use(auth, problems, clarifications, contest, standings, submissions, users, scratch)

export default api
