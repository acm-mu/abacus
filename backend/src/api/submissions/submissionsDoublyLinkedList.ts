import { RawSubmission, Submission } from "abacus"

class Node_<Submission extends RawSubmission>
{
    data: Submission;
    next: Node_<Submission> | null = null
    prev: Node_<Submission> | null = null

    constructor(data: Submission)
    {
        this.data = data
    }
}

class DoublyLinkedList<Submission extends RawSubmission>
{
    head: Node_<Submission> | null = null
    tail: Node_<Submission> | null = null
    size: number = 0

    append(data: Submission): void
    {
        const newNode = new Node_(data)
        if (this.tail)
        {
            this.tail.next = newNode
            newNode.prev = this.tail
            this.tail = newNode
        }
        else
        {
            this.head = this.tail = newNode
        }
        this.size++
        console.log("backend/src/api/submissions/unranSubmissionsDoublyLL append:", this.print())
    }

    prepend(data: Submission): void
    {
        const newNode = new Node_(data)
        if (this.head)
        {
            newNode.next = this.head
            this.head.prev = newNode
            this.head = newNode
        }
        else
        {
            this.head = this.tail = newNode
        }
        this.size++
    }

    remove(): void
    {
        if (this.tail)
        {
            if (this.tail.prev)
            {
                this.tail = this.tail.prev
                this.tail.next = null
            }
            else
            {
                this.head = this.tail = null
            }
            this.size--
        }
    }

    removeFirst(): void
    {
        if (this.head)
        {
            if (this.head.next)
            {
                this.head = this.head.next
                this.head.prev = null
            }
            else
            {
                this.head = this.tail = null
            }
            this.size--
            console.log("backend/src/api/submissions/unranSubmissionsDoublyLL removeFirst:", this.print())
        }
    }

    getNodeAt(index: number): Node_<Submission> | null
    {
        //if(index < 0 || index >= this.size) return null;

        let currentNode = this.head;
        for (let i = 0; i < index; i++)
        {
            currentNode = currentNode?.next || null;
        }

        //this.removeFirst();

        console.log("backend/src/api/submissions/unranSubmissionsDoublyLL getNodeAt:", currentNode)

        return currentNode;
    }

    clear(): void
    {
        this.head = this.tail = null
        this.size = 0
    }

    isEmpty(): boolean
    {
        return this.size === 0
    }

    print(): void {
        let currentNode = this.head
        let result = ""
        while (currentNode) {
            result += currentNode.data + "<->"
            currentNode = currentNode.next
        }
        console.log(result.slice(0, -4))
    }
}

export const doublyLinkedList = new DoublyLinkedList<Submission>()
//doublyLinkedList.clear();
