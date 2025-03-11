import { RawSubmission, Submission, User } from "abacus"
import { doublyLinkedList } from "./submissionsDoublyLinkedList"
//import { notifyTeam } from "./putSubmissions"
import { sendNotification } from '../../server'

export class SubmissionsQueue<Submission extends RawSubmission>
{
    private submissions: Submission[] = []
    private maxSize: number = 5

    enqueue(item: Submission): void
    {
        if (this.submissions.length >= this.maxSize)
        {
            doublyLinkedList.append(item as import("abacus").Submission)
            //console.log("backend/src/api/submissions/submissionsQueue LL append:", doublyLinkedList);
            return
        }
        this.submissions.push(item)
        console.log("backend/src/api/submissions/submissionsQueue enqueue:", this.submissions)
    }

    dequeue(sid: string): void
    {
        const index = this.submissions.findIndex(submission => submission.sid === sid)

        if (index !== -1)
        {
            this.submissions.splice(index, 1)
            console.log("backend/src/api/submissions/submissionsQueue dequeue:", this.submissions)
        }

        if (!doublyLinkedList.isEmpty())
        {
            const submission = doublyLinkedList.getNodeAt(0)?.data as Submission
            this.submissions.push(submission)
            doublyLinkedList.removeFirst()
            console.log("backend/src/api/submissions/submissionsQueue submission.claimed:", submission.claimed)
            const judgeInfo = submission.claimed as User
            console.log("backend/src/api/submissions/submissionsQueue judgeInfo uid:", judgeInfo.uid)
            sendNotification({
                to: `uid:${judgeInfo.uid}`,
                header: 'Rerun Now Available!',
                content: `Submission ${submission.sid.substring(0, 8)} can now be ran`,
                context: {
                    type: 'sid',
                    id: judgeInfo.uid as string
                }
            })
            //io.emit('notification', { uid: judgeInfo.uid })

            console.log("backend/src/api/submissions/submissionsQueue enqueue from LL:", this.submissions)
        }
    }

    get(): Submission[]
    {
        return this.submissions
    }

    isEmpty(): boolean
    {
        return this.submissions.length == 0
    }

    size(): number
    {
        return this.submissions.length
    }

    clear(): void
    {
        this.submissions = []
    }

    contains(submission: Submission): boolean
    {
        return this.submissions.includes(submission)
    }
}

export const submissionsQueue = new SubmissionsQueue<Submission>()
//submissionsQueue.clear();