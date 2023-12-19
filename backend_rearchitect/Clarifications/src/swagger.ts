import { Request, Response, Router } from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from 'swagger-ui-express'

const swagger = Router()

swagger.use('/swagger.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(
    swaggerJSDoc({
      swaggerDefinition: {
        openapi: '3.0.0',
        info: {
          title: 'Clarification API',
          version: '2.0.0',
          description: 'API for codeabac.us'
        }
      },
      apis: ['**/*.ts', '**/*.d.ts']
    })
  )
})

swagger.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: '/v2/swagger.json'
  }
}))

export default swagger