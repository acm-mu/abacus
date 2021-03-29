import { Problem, Submission } from "abacus";
import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "semantic-ui-react";
import MDEditor from "@uiw/react-md-editor";
import { Block, Countdown, NotFound, ClarificationModal, PageLoading } from 'components'
import config from 'environment'
import AppContext from "AppContext";
import "./Problem.scss";
import { Helmet } from "react-helmet";

const problem = (): JSX.Element => {
  const { user } = useContext(AppContext);
  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<Problem>();
  const [submissions, setSubmissions] = useState<Submission[]>()
  const { pid } = useParams<{ pid: string }>()

  const [isMounted, setMounted] = useState(true)

  useEffect(() => {
    loadProblem().then(() => {
      setLoading(false)
      if (user) loadSubmissions()
    })
    return () => { setMounted(false) }
  }, []);

  const loadProblem = async () => {
    const response = await fetch(`${config.API_URL}/problems?division=blue&columns=description&id=${pid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (response.ok && isMounted) {
      setProblem(Object.values(await response.json())[0] as Problem)
    }

    setLoading(false)
  }

  const loadSubmissions = async () => {
    if (!problem) return

    const submissions = await fetch(`${config.API_URL}/submissions?tid=${user?.uid}&pid=${problem?.pid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    setSubmissions(Object.values(await submissions.json()))
  }

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return <>
    <Helmet> <title>Abacus | {problem.name}</title> </Helmet>
    <Countdown />
    <Block size='xs-9' className='problem'>
      <h1>Problem {problem.id}: {problem.name}</h1>
      <hr />
      <MDEditor.Markdown source={problem.description || ''} />
    </Block>
    <Block size='xs-3' className='problem-panel'>
      {!submissions || submissions.filter((e) => e.status == "accepted").length == 0 ?
        <Button
          as={Link}
          to={`/blue/problems/${problem?.id}/submit`}
          content="Submit"
          icon="upload"
        /> : <></>
      }
      <ClarificationModal title={`${problem.name} | `} trigger={
        <Button content="Ask" icon="question" />
      } />
      <p><b>Problem ID:</b> {problem.id}</p>
      <p><b>CPU Time limit:</b> {problem.cpu_time_limit}</p>
      <p><b>Memory limit:</b> {problem.memory_limit}</p>
      <p><b>Download:</b> <a href={`${config.API_URL}/sample_files?pid=${problem.pid}`}>Sample data files</a></p>
    </Block>
  </>
}

export default problem;
