import { Problem, Submission } from 'abacus'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Block, Countdown, NotFound, ClarificationModal } from 'components'
import { Button, Loader, Popup } from 'semantic-ui-react'
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
    const response = await fetch(`${config.API_URL}/problems?division=gold&id=${pid}`, {
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

  if (isLoading) return <Loader active inline='centered' />
  if (!problem) return <NotFound />

  return <>
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
      <ClarificationModal title={`${problem.name} | `} trigger={
        <Button content="Ask" icon="question" />
      } />
      <p><b>Problem ID:</b> {problem?.id}</p>
      <p><b>CPU Time limit:</b> {problem?.cpu_time_limit}</p>
      <p><b>Memory limit:</b> {problem?.memory_limit}</p>
      <p><b>Download:</b> <a>Sample data files</a></p>
    </Block >
  </>
}

export default problem