import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Popup } from 'semantic-ui-react'
import { Block, Countdown } from '../../components'
import { UserContext } from '../../context/user'
import { ProblemType, SubmissionType } from '../../types'
import config from "../../environment"
import MDEditor from '@uiw/react-md-editor'

const Problem = (): JSX.Element => {
  const [problem, setProblem] = useState<ProblemType>()
  const [submissions, setSubmissions] = useState<SubmissionType[]>()
  const { user } = useContext(UserContext)
  const { problem_id } = useParams<{ problem_id: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=gold&id=${problem_id}`)
      .then(res => res.json())
      .then(res => {
        if (res) {
          const problem = Object.values(res)[0] as ProblemType
          setProblem(problem)
          if (user)
            fetch(`${config.API_URL}/submissions?team_id=${user?.uid}&problem_id=${problem.pid}`)
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

export default Problem