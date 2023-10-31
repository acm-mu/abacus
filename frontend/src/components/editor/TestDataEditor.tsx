import type { IBlueProblem, IGoldProblem, IProblem } from "abacus"
import React, { ChangeEvent, MouseEvent, useMemo, useState } from 'react'
import { Form, Grid, Menu, MenuItemProps, TextArea } from 'semantic-ui-react'

interface TestDataEditorProps {
  problem: IBlueProblem
  setProblem?: React.Dispatch<React.SetStateAction<IGoldProblem | IProblem | IBlueProblem>>
}

const TestDataEditor = ({ problem, setProblem }: TestDataEditorProps): React.JSX.Element => {
  const [activeItem, setActiveItem] = useState(0)

  if (!problem) return <></>

  const activeTestItem = useMemo(() => {
    return problem.tests ? problem.tests[activeItem] : undefined
  }, [problem, activeItem])

  const handleTestItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)
  const handleNewTest = () => {
    if (setProblem !== undefined) {
      setProblem({ ...problem, tests: [...(problem.tests || []), { in: '', out: '', include: false }] })
      setActiveItem(problem.tests?.length || 0)
    }
  }

  const handleDeleteTest = () => {
    if (setProblem !== undefined) {
      if (problem.tests && problem.tests.length > 0) {
        setActiveItem(problem.tests.length - 2)
        setProblem({ ...problem, tests: problem.tests.filter((_, index) => index != activeItem) })
      }
    }
  }

  const handleTestChange = ({ target: { name, value } }: ChangeEvent<HTMLTextAreaElement>) => {
    if (setProblem !== undefined) {
      setProblem({
        ...problem,
        tests: problem.tests?.map((test, index) => {
          if (name == `${index}-in`) test.in = value
          else if (name == `${index}-out`) test.out = value
          return test
        })
      })
    }
  }

  return (
    <Form>
      <Menu>
        {problem?.tests?.map((_test, index) => (
          <Menu.Item
            name={`${index + 1}`}
            key={`${index}-test-tab`}
            tab={index}
            active={activeItem === index}
            onClick={handleTestItemClick}
          />
        ))}
        {setProblem && (
          <Menu.Menu position="right">
            <Menu.Item onClick={handleNewTest}>New</Menu.Item>
            {problem.tests && problem.tests?.length > 1 &&
              <Menu.Item onClick={handleDeleteTest}>Delete</Menu.Item>}
          </Menu.Menu>
        )}
      </Menu>

      <div>
        {activeTestItem && <>
          {setProblem !== undefined ? (
            <Form.Group widths="equal">
              <Form.Field
                label="Input"
                onChange={handleTestChange}
                control={TextArea}
                rows={10}
                value={activeTestItem.in}
              />
              <Form.Field
                label="Answer"
                onChange={handleTestChange}
                control={TextArea}
                rows={10}
                value={activeTestItem.out}
              />
            </Form.Group>
          ) : (
            <Grid columns={2}>
              <Grid.Column>
                <b>Input</b>
                <pre>{activeTestItem.in}</pre>
              </Grid.Column>
              <Grid.Column>
                <b>Output</b>
                <pre>{activeTestItem.out}</pre>
              </Grid.Column>
            </Grid>
          )}
        </>}
      </div>
    </Form>
  )
}

export default TestDataEditor
