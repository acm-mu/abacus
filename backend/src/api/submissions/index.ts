import { Router, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { hasRole, isAuthenticated } from '../../abacus/authlib'
import { deleteSubmissions, schema as deleteSchema } from './deleteSubmissions'
import { getSubmissions, schema as getSchema } from './getSubmissions'
import { postSubmissions, schema as postSchema } from './postSubmissions'
import { putSubmissions, schema as putSchema } from './putSubmissions'
import { rerunSubmission, schema as rerunSchema } from './rerunSubmission'
import { submissionsQueue } from './submissionsQueue'
//import { doublyLinkedList } from './unranSubmissionsDoublyLinkedList'
/**
 * @swagger
 * tags:
 *   name: Submissions
 */

const submissions = Router()

submissions.get('/submissions', isAuthenticated, checkSchema(getSchema), getSubmissions)
submissions.post('/submissions', isAuthenticated, checkSchema(postSchema), postSubmissions)
submissions.put('/submissions', hasRole('proctor'), checkSchema(putSchema), putSubmissions)
submissions.delete('/submissions', hasRole('admin'), checkSchema(deleteSchema), deleteSubmissions)

submissions.post('/submissions/rerun', hasRole('judge'), checkSchema(rerunSchema), rerunSubmission)

submissions.get('/submissions/submissionsQueue', isAuthenticated, (_req: Request, res: Response) => {
    res.json(submissionsQueue.get())
})

submissions.post('/submissions/submissionsDequeue', isAuthenticated, (req: Request, _res: Response) => {
    const { sid } = req.body
    submissionsQueue.dequeue(sid)
    //console.log("backend/src/api/submissions/index.ts dequeue:", submissionsQueue);
    //res.status(200).json({message: 'Submission with sid: ${sid dequeued'})
})

submissions.post('/submissions/submissionsEnqueue', isAuthenticated, (req: Request, _res: Response) => {
    const { submission } = req.body
    submissionsQueue.enqueue(submission)
})

export default submissions
