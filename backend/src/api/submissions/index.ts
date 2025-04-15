import { Router, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { hasRole, isAuthenticated } from '../../abacus/authlib'
import { deleteSubmissions, schema as deleteSchema } from './deleteSubmissions'
import { getSubmissions, schema as getSchema } from './getSubmissions'
import { postSubmissions, schema as postSchema } from './postSubmissions'
import { putSubmissions, schema as putSchema } from './putSubmissions'
import { rerunSubmission, schema as rerunSchema } from './rerunSubmission'
import { submissionsQueue } from './submissionsQueue'
import { doublyLinkedList } from './submissionsDoublyLinkedList'

/**
 * @swagger
 * tags:
 *   name: Submissions
 */

// Creating an Express Router to handle routes related to submissions
const submissions = Router()

// Route to get submissions
submissions.get('/submissions', isAuthenticated, checkSchema(getSchema), getSubmissions)

// Route to create a new submission
submissions.post('/submissions', isAuthenticated, checkSchema(postSchema), postSubmissions)

// Route to update an existing submission
submissions.put('/submissions', hasRole('proctor'), checkSchema(putSchema), putSubmissions)

// Route to delete a submission
submissions.delete('/submissions', hasRole('admin'), checkSchema(deleteSchema), deleteSubmissions)

// Route to rerun a submission
submissions.post('/submissions/rerun', hasRole('judge'), checkSchema(rerunSchema), rerunSubmission)

// Route to get the current state of the submissions queue
submissions.get('/submissions/submissionsQueue', isAuthenticated, (_req: Request, res: Response) => {
    res.json(submissionsQueue.get())
})

// Route to dequeue a submission
submissions.post('/submissions/submissionsDequeue', isAuthenticated, (req: Request, _res: Response) => {
    const { sid } = req.body
    submissionsQueue.dequeue(sid)
})

// Route to enqueue a submission
submissions.post('/submissions/submissionsEnqueue', isAuthenticated, (req: Request, _res: Response) => {
    const { submission } = req.body
    submissionsQueue.enqueue(submission)
})

// Route to get the current state of the doubly linked list
submissions.get('/submissions/submissionsDoublyLinkedList', isAuthenticated, (_req: Request, res: Response) => {
    res.json(doublyLinkedList.get())
})

// Route to remove submission from doubly linked list
submissions.post('/submissions/removeAtDoublyLinkedList', isAuthenticated, (req: Request, _res: Response) => {
    const { sid } = req.body
    doublyLinkedList.removeAt(sid)
})

// Route to clear both the queue and the doubly linked list
submissions.post('/submissions/clearQueueAndDoublyLinkedList', isAuthenticated, (_req: Request, _res: Response) => {
    submissionsQueue.clear()
    doublyLinkedList.clear()
})

// Export the 'submissions' router to be used in the main app
export default submissions
