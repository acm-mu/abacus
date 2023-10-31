import MDEditor from '@uiw/react-md-editor'
import type { IBlueProblem, IProblem } from 'abacus'
import { ProblemRepository } from 'api'
import { Block, Countdown, NotFound, PageLoading } from 'components'
import SolutionsEditor from 'components/editor/SolutionsEditor'
import TestDataEditor from 'components/editor/TestDataEditor'
import { usePageTitle } from 'hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Divider, Menu, MenuItemProps } from 'semantic-ui-react'

const Problem = (): React.JSX.Element => {
  const problemRepository = new ProblemRepository()

  const [isLoading, setLoading] = useState(true)
  const [problem, setProblem] = useState<IProblem>()
  const { pid } = useParams<{ pid: string }>()

  usePageTitle(`Abacus | Proctor ${problem?.name ?? ""}`)

  useEffect(() => {
    loadProblem()
      .catch(console.error)
  }, [])

  const loadProblem = async () => {
    const response = await problemRepository.getMany({
      filterBy: {
        division: 'blue',
        problemId: pid
      }
    })

    if (response.ok) {
      setProblem(response.data ? response.data.items[0] : undefined)
    }

    setLoading(false)
  }

  const [activeItem, setActiveItem] = useState('problem')
  const handleItemClick = (_event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { tab }: MenuItemProps) =>
    setActiveItem(tab)

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />

  const activeView = useMemo(() => {
    switch (activeItem) {
      case'problem':
        return <>
          <h1>
            Problem {problem.id}: {problem.name}
          </h1>
          <Divider />
          <MDEditor.Markdown source={problem.description || ''} />
        </>
      case'solution':
        return <SolutionsEditor problem={problem as IBlueProblem} />
      case'test-data':
        return <TestDataEditor problem={problem as IBlueProblem} />
      default:
        return <></>
    }
  }, [activeItem, problem])

  return (
    <>
      <Countdown />

      <Menu attached="top" tabular>
        <Menu.Item name="Problem Description" tab="problem" active={activeItem === 'problem'} onClick={handleItemClick} />
        <Menu.Item name="Solution" tab="solution" active={activeItem === 'solution'} onClick={handleItemClick} />
        <Menu.Item name="Test Data" tab="test-data" active={activeItem === 'test-data'} onClick={handleItemClick} />
      </Menu>

      <Block size="xs-12" menuAttached="top" className="problem">
        {activeView}
      </Block>
    </>
  )
}

export default Problem
