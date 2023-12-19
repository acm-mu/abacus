import express, { RequestHandler } from 'express'
import request from 'supertest'
import ProblemController from '../src/controller'
import Validation from '../src/validation'

const app = express()
app.use(express.json())

jest.mock('../src/service', () => ({
  getAllProblems: jest.fn(() => []),
  getProblemById: jest.fn(() => ({ id: '1' })),
  searchProblems: jest.fn(() => []),
  createProblem: jest.fn(() => ({ id: '2' })),
  updateProblem: jest.fn(() => ({ id: '1' })),
  deleteProblem: jest.fn(() => ({ id: '1' }))
}))

app.get('/problems/:id', (async (req, res) => {
  await ProblemController.getProblemById(req, res)
}) as RequestHandler)

app.post('/problems', Validation.createProblem, (async (req, res) => {
  await ProblemController.createProblem(req, res)
}) as RequestHandler)

describe('ProblemController', () => {
  describe('getProblemById', () => {
    it('should return a problem when a valid ID is provided', async () => {
      const response = await request(app).get('/problems/1')
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ id: '1' })
    })

    it('should return 400 when an invalid ID is provided', async () => {
      const response = await request(app).get('/problems/invalid-id')
      expect(response.status).toBe(400)
    })

    it('should return 404 when the problem is not found', async () => {
      jest.spyOn(require('../src/service'), 'getProblemById').mockResolvedValue(null)

      const response = await request(app).get('/problems/999')
      expect(response.status).toBe(404)
    })
  })

  describe('createProblem', () => {
    it('should create a new problem', async () => {
      const newProblem = { name: '' }
      const response = await request(app).post('/problems').send(newProblem)
      expect(response.status).toBe(201)
      expect(response.body).toEqual({ id: '2', name: '' })
    })

    it('should return 400 for invalid input', async () => {
      const invalidProblem = { name: 3 }
      const response = await request(app).post('/problems').send(invalidProblem)
      expect(response.status).toBe(400)
    })
  })
})