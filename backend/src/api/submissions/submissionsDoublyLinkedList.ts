import { RawSubmission, Submission } from "abacus"
import { io } from '../../server'

// Define a Node clas to store a Submission and links to the next and previous nodes
class Node_<Submission extends RawSubmission>
{
    data: Submission
    next: Node_<Submission> | null = null
    prev: Node_<Submission> | null = null

    constructor(data: Submission)
    {
        this.data = data
    }
}

// Define a Doubly Linked List class to manage a list of submissions
class DoublyLinkedList<Submission extends RawSubmission>
{
    head: Node_<Submission> | null = null
    tail: Node_<Submission> | null = null
    size: number = 0

    // Function to append a new node with submission data to the end of the list
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

        io.emit('update_doubly_linked_list', { sid: data.sid })
    }

    // Function to prepend a new node with submission data to the beginning of the list
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

    // Function to remove the last node in the list
    remove(): void
    {
        if (this.tail)
        {
            io.emit('update_doubly_linked_list', { sid: this.tail.data.sid })

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

    // Function to remove the first node in the list
    removeFirst(): void
    {
        if (this.head)
        {
            io.emit('update_doubly_linked_list', { sid: this.head.data.sid })

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
        }
    }

    // Function to remove node with specified sid 
    removeAt(sid: string): void
    {
        let currentNode = this.head

        while (currentNode)
        {
            if (currentNode.data.sid === sid)
            {
                if (currentNode === this.head)
                {
                    this.removeFirst()
                }
                else if (currentNode === this.tail)
                {
                    this.remove()
                }
                else
                {
                    if (currentNode.prev)
                    {
                        currentNode.prev.next = currentNode.next
                    }
                    if (currentNode.next)
                    {
                        currentNode.next.prev = currentNode.prev
                    }
                    this.size--

                    io.emit('update_doubly_linked_list', { sid: sid })
                }
                return
            }
            currentNode = currentNode.next
        }
    }

    // Function to get a node at a specific index in the list
    getNodeAt(index: number): Node_<Submission> | null
    {
        let currentNode = this.head
        for (let i = 0; i < index; i++)
        {
            currentNode = currentNode?.next || null
        }

        return currentNode
    }

    // Function to clear the entire list
    clear(): void
    {
        this.head = this.tail = null
        this.size = 0
        io.emit('update_doubly_linked_list')
    }

    // Function to check if the list is empty
    isEmpty(): boolean
    {
        return this.size === 0
    }

    // Function to print the content of the list as a string
    print(): void {
        let currentNode = this.head
        let result = ""
        while (currentNode) {
            result += currentNode.data + "<->"
            currentNode = currentNode.next
        }
        console.log(result.slice(0, -4))
    }

    // Returns the current list of submission in the doubly linked list
    get(): Submission[] {
        let currentNode = this.head
        const doublyLinkedList: Submission[] = []

        while (currentNode) {
            doublyLinkedList.push(currentNode.data)
            currentNode = currentNode.next
        }

        return doublyLinkedList
    }
}

// Create an instance of DoublyLinkedList
export const doublyLinkedList = new DoublyLinkedList<Submission>()
