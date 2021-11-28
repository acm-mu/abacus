import { Problem, Submission } from 'abacus'
import { NotFound } from 'components'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Loader } from 'semantic-ui-react'
import PracticeProblem from './Problem'
import PracticeSubmission from './Submission'

const ProblemOrSubmission = (): JSX.Element => {
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>([])
  const submissions: { [key: string]: Submission } = localStorage.submissions
    ? JSON.parse(localStorage.submissions)
    : {}

  const { id } = useParams<{ id: string }>()

  const loadProblems = async () => {
    const response = await fetch('/problems/index.json')
    if (!isMounted) return
    setProblems(await response.json())
    setLoading(false)
  }

  useEffect(() => {
    loadProblems()
    return () => {
      setMounted(false)
    }
  }, [])

  const subsForId = (id: string) => Object.values(submissions).filter((submission) => submission.pid == id)

  if (isLoading) {
    return (
      <>
        <title>Abacus | Practice</title>
        <Loader active inline="centered" content="Loading..." />
      </>
    )
  }

  if (id in submissions) return <PracticeSubmission submission={submissions[id]} />
  if (id in problems) return <PracticeProblem submissions={subsForId(id)} />

  return <NotFound />
}

export default ProblemOrSubmission
