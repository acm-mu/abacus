import MDEditor from '@uiw/react-md-editor'
import { Problem as ProblemType } from 'abacus'
import { Block, Countdown, NotFound, PageLoading } from 'components'
import SolutionsEditor from 'components/editor/SolutionsEditor'
import TestDataEditor from 'components/editor/TestDataEditor'
import config from 'environment'
import './Problem.scss'
import { useIsMounted, usePageTitle } from 'hooks'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Divider, Menu, MenuItemProps } from 'semantic-ui-react'

const Problem = (): React.JSX.Element => {
  const isMounted = useIsMounted()

  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<ProblemType>()
  const { pid } = useParams<{ pid: string }>()

  usePageTitle(`Abacus | Proctor ${problem?.name ?? ""}`)

  useEffect(() => {
    loadProblem()
  }, [])

  const loadProblem = async () => {
    const response = await fetch(
      `${config.API_URL}/problems?division=blue&columns=description,solutions,tests&pid=${pid}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.accessToken}`
        }
      }
    )

    if (!isMounted()) return

    if (response.ok) {
      const problem = Object.values(await response.json())[0] as ProblemType
      setProblem(problem)
    }

    setLoading(false)
  }

  const [activeItem, setActiveItem] = useState('problem')
  const handleItemClick = (_event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { tab }: MenuItemProps) =>
    setActiveItem(tab)

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return (
    <>
      <Countdown />

      <Menu attached="top" tabular>
        <Menu.Item
          name="Problem Description"
          tab="problem"
          active={activeItem === 'problem'}
          onClick={handleItemClick}
        />
        <Menu.Item name="Solution" tab="solution" active={activeItem === 'solution'} onClick={handleItemClick} />
        <Menu.Item name="Test Data" tab="test-data" active={activeItem === 'test-data'} onClick={handleItemClick} />
      </Menu>

      <Block size="xs-12" menuAttached="top" className="problem">
        {(() => {
          switch (activeItem) {
            case 'problem':
              return (
                <>
                  <h1>
                    Problem {problem.id}: {problem.name}
                  </h1>
                  <Divider />
                  <MDEditor.Markdown source={problem.description || ''} />
                </>
              )
            case 'solution':
              return <SolutionsEditor problem={problem} />
            case 'test-data':
              return <TestDataEditor problem={problem} />
            default:
              return <></>
          }
        })()}
      </Block>
    </>
  )
}

export default Problem
