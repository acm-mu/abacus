import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Popup } from 'semantic-ui-react'
import { Block, Countdown } from '../../components'
import config from "../../environment"
import MDEditor from '@uiw/react-md-editor'
import { Problem, Submission } from 'abacus'
import { AppContext } from '../../AppContext'

const problem = (): JSX.Element => {
  const [problem, setProblem] = useState<Problem>()
  const [submissions, setSubmissions] = useState<Submission[]>()
  const { user } = useContext(AppContext)
  const { pid } = useParams<{ pid: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=gold&id=${pid}`)
      .then(res => res.json())
      .then(res => {
        if (res) {
          const problem = Object.values(res)[0] as Problem
          setProblem(problem)
          if (user)
            fetch(`${config.API_URL}/submissions?team_id=${user?.uid}&pid=${problem.pid}`)
              .then(res => res.json())
              .then(res => setSubmissions(Object.values(res)))
        }
      })
  }, [])

  return (
    <>
      <Countdown />
      <Block size='xs-9'>
        <h1>Problem {problem?.id}
          <br />
          {problem?.name}
        </h1>
        <hr />
        <MDEditor.Markdown source={problem?.description || ''} />
      </Block>
      <Block size='xs-3'>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }} >
          {!submissions || submissions?.filter((e) => e.status == "accepted").length == 0 ?
            <Popup
              trigger={
                <Button
                  as={Link}
                  to={`/blue/problems/${problem?.id}/submit`}
                  content="Submit"
                  icon="upload"
                />
              }
              content="Submit"
              position="top center"
              inverted /> : <></>
          }
        </div>
        <p><b>Problem ID:</b> {problem?.id}</p>
        <p><b>CPU Time limit:</b> {problem?.cpu_time_limit}</p>
        <p><b>Memory limit:</b> {problem?.memory_limit}</p>
        <p><b>Download:</b> <a>Sample data files</a></p>
      </Block>
    </>
  )
}

export default problem