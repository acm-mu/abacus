import { Problem, Submission } from 'abacus'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Block, Countdown, NotFound, ClarificationModal, PageLoading } from 'components'
import { Button } from 'semantic-ui-react'
import MDEditor from '@uiw/react-md-editor'
import config from "environment"
import AppContext from 'AppContext'
import { Helmet } from 'react-helmet'

const problem = (): JSX.Element => {
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<Problem>()
  const [submissions, setSubmissions] = useState<Submission[]>()
  const { pid } = useParams<{ pid: string }>()

  const [isMounted, setMounted] = useState(true)

  useEffect(() => {
    loadProblem().then(() => {
      setLoading(false)
      if (user) loadSubmissions()
    })
    return () => { setMounted(false) }
  }, [])

  const loadProblem = async () => {
    const response = await fetch(`${config.API_URL}/problems?division=gold&id=${pid}&columns=description,project_id`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!response.ok || !isMounted) return

    setProblem(Object.values(await response.json())[0] as Problem)
  }

  const loadSubmissions = async () => {
    if (!problem) return

    const response = await fetch(`${config.API_URL}/submissions?tid=${user?.uid}&pid=${problem?.pid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!response.ok || !isMounted) return

    setSubmissions(Object.values(await response.json()))
  }

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return <>
    <Helmet> <title>Abacus | {problem.name}</title> </Helmet>
    <Countdown />
    <Block size='xs-9' className='problem'>
      <h1>Problem {problem?.id}: {problem?.name}</h1>
      <hr />
      <MDEditor.Markdown source={problem?.description || ''} />
    </Block>
    <Block size='xs-3' className='problem-panel'>
      {!submissions || submissions?.filter((e) => e.status == "accepted").length == 0 ?
        <Button
          as={Link}
          to={`/gold/problems/${problem?.id}/submit`}
          content="Submit"
          icon="upload"
        /> : <></>
      }
      <ClarificationModal
        title={`${problem.name} | `}
        context={{ type: 'pid', id: problem.pid }}
        trigger={<Button content="Ask" icon="question" />}
      />
      <a
        rel="noreferrer"
        target="_blank"
        href={`https://scratch.mit.edu/projects/${problem?.project_id}`}
      >
        <Button
          color='orange'
          content="Template"
          icon='linkify'
        />
      </a>
    </Block >
  </>
}

export default problem