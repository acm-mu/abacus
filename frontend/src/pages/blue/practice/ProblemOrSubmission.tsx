import { Problem, Submission } from 'abacus'
import { NotFound } from 'components'
import { useIsMounted, usePageTitle } from 'hooks'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import PracticeProblem from './Problem'
import PracticeSubmission from './Submission'

const ProblemOrSubmission = (): React.JSX.Element => {
  usePageTitle("Abacus | Practice")
  const isMounted = useIsMounted()

  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>([])
  const submissions: { [key: string]: Submission } = localStorage.submissions
    ? JSON.parse(localStorage.submissions)
    : {}

  const { id } = useParams<{ id: string }>()

  const loadProblems = async () => {
    const response = await fetch('/problems/index.json')
    if (!isMounted()) return
    setProblems(await response.json())
    setLoading(false)
  }

  useEffect(() => {
    loadProblems()
  }, [])

  const subsForId = (id: string) => Object.values(submissions).filter((submission) => submission.pid == id)

  if (isLoading) {
    return <Loader active inline="centered" content="Loading..." />
  }

  if (id) {
    if (id in submissions) return <PracticeSubmission submission={submissions[id]} />
    if (id in problems) return <PracticeProblem submissions={subsForId(id)} />
  }

  return <NotFound />
}

export default ProblemOrSubmission
