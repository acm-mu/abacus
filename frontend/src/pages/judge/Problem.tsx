import { Problem as ProblemType } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Divider } from 'semantic-ui-react'
import MDEditor from '@uiw/react-md-editor'
import { Block, Countdown, NotFound, PageLoading } from 'components'
import { AppContext } from 'context'
import './Problem.scss'
import { usePageTitle } from 'hooks'
import {ProblemRepository} from 'api'

const Problem = (): React.JSX.Element => {
  const problemRepository = new ProblemRepository()
  const { user } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<ProblemType>()
  const { pid } = useParams<{ pid: string }>()

  const [isMounted, setMounted] = useState(true)

  usePageTitle(`Abacus | ${problem?.name ?? ""}`)

  useEffect(() => {
    loadProblem()
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {
    const response = await problemRepository.getMany({
      filterBy: {
        division: user?.division,
        problemId: pid
      }
    })

    if (!isMounted) return

    if (response.ok) {
      setProblem(response.data[0])
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return (
    <>
      <Countdown />

      <Block size="xs-9" className="problem">
        <h1>
          Problem {problem.id}: {problem.name}
        </h1>
        <Divider />
        <MDEditor.Markdown source={problem.description || ''} />
      </Block>
      <Block size="xs-3" className="problem-panel">
        <p>
          <b>Problem ID:</b> {problem.id}
        </p>
        <p>
          <b>Problem Name:</b> {problem.name}
        </p>
        {problem.cpu_time_limit ? (
          <p>
            <b>CPU Time limit:</b> {problem.cpu_time_limit}
          </p>
        ) : (
          <></>
        )}
        {problem.memory_limit ? (
          <p>
            <b>Memory limit:</b> {problem.memory_limit}
          </p>
        ) : (
          <></>
        )}
        <Divider />
        <p>
          <b>Test Data</b>
        </p>
      </Block>
    </>
  )
}

export default Problem
