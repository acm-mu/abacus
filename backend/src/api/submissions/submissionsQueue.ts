import { RawSubmission, Submission, User } from "abacus"
import { doublyLinkedList } from "./submissionsDoublyLinkedList"
import { io, sendNotification } from '../../server'

// Class that represents the submissions queue
export class SubmissionsQueue<Submission extends RawSubmission>
{
    private submissions: Submission[] = []
    private maxSize: number = 5

    /* Function that adds a new submission to the queue if the queue size is not exceeded. 
       If the queue is full, the submission is added to the doubly linked list and the judge is notified
       that rerun is currently unavailable. */
    enqueue(item: Submission): void
    {
        if (this.submissions.length >= this.maxSize)
        {
            doublyLinkedList.append(item as import("abacus").Submission)
            const judgeInfo = item.claimed as User
            sendNotification({
                to: `uid:${judgeInfo.uid}`,
                header: 'Scoring Currently Unavailable!',
                content: `Submission ${item.sid.substring(0, 7)} is not in the queue, so it cannot be scored yet`,
                context: {
                    type: 'sid',
                    id: item.sid as string
                }
            })
            return
        }
        this.submissions.push(item)
        io.emit('update_queue', { sid: item.sid })
    }

    /* Removes a submission for the queue by its submission ID (sid). 
       If there is a submission in the doubly linked list, the submission will be moved to the queue. 
       Notifies the judge that the submission is now available to be run. */
    dequeue(sid: string): void
    {
        const index = this.submissions.findIndex(submission => submission.sid === sid)

        if (index !== -1)
        {
            io.emit('update_queue', { sid: this.submissions[index].sid })
            this.submissions.splice(index, 1)
        }

        if (!doublyLinkedList.isEmpty())
        {
            const submission = doublyLinkedList.getNodeAt(0)?.data as Submission
            this.enqueue(submission)
            doublyLinkedList.removeFirst()
            const judgeInfo = submission.claimed as User
            sendNotification({
                to: `uid:${judgeInfo.uid}`,
                header: 'Scoring Now Available!',
                content: `Submission ${submission.sid.substring(0, 7)} can now be scored`,
                context: {
                    type: 'sid',
                    id: submission.sid as string
                }
            })
        }
    }

    // Returns the current list of submissions in the queue
    get(): Submission[]
    {
        return this.submissions
    }

    // Checks if the queue is empty
    isEmpty(): boolean
    {
        return this.submissions.length == 0
    }

    // Returns the size of the queue
    size(): number
    {
        return this.submissions.length
    }

    // Clears the queue
    clear(): void
    {
        this.submissions = []
        io.emit('update_queue')
    }

    // Checks if the specified submission is already in the queue
    contains(submission: Submission): boolean
    {
        return this.submissions.includes(submission)
    }
}

// Create a new instance of SubmissionsQueue
export const submissionsQueue = new SubmissionsQueue<Submission>()