import MDEditor from '@uiw/react-md-editor'
import type { IProblem } from 'abacus'
import { ProblemRepository } from 'api'
import { Block, Countdown, PageLoading, Unauthorized } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { useContext, useEffect, useState } from 'react'
import { Divider } from 'semantic-ui-react'

const Home = (): React.JSX.Element => {
  usePageTitle("Abacus | Eagle Problem")

  const { user, settings } = useContext(AppContext)
  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<IProblem>()
  const [isMounted, setMounted] = useState(true)

  useEffect(() => {
    loadProblem().catch(console.error)
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {
    const problems = new ProblemRepository()
    const response = await problems.getMany()

    if (!isMounted) return

    if (response.ok && response.data) {
      setProblem(response.data.items[0])
    }

    setLoading(false)
  }

  if (isLoading) return <PageLoading />
  if (user?.division != 'eagle' && user?.role != 'admin') return <Unauthorized />

  return (
    <>
      <Countdown />
      <Block size="xs-12" className="problem">
        {!settings || new Date() < settings.start_date ? (
          <p>The problem cannot be viewed because the competition has not yet started.</p>
        ) : !problem ? (
          <h2>There are no a problems, yet.</h2>
        ) : (
          <>
            <h1>
              Problem {problem?.id}: {problem?.name}
            </h1>
            <Divider />
            <MDEditor.Markdown source={problem?.description || ''} />
          </>
        )}
      </Block>
    </>
  )
}

export default Home
