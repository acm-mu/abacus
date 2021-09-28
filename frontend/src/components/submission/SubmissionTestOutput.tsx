import React, { useContext, useState, MouseEvent } from 'react'
import { Loader, Menu, MenuItemProps } from 'semantic-ui-react'
import { capitalize, format_text } from 'utils'
import SubmissionContext from './SubmissionContext'

const SubmissionTestOutput = (): JSX.Element => {
  const { submission, rerunning } = useContext(SubmissionContext)

  const [activeTestItem, setActiveTestItem] = useState(0)
  const handleTestItemClick = (_event: MouseEvent, { tab }: MenuItemProps) => setActiveTestItem(tab)

  if (!submission) return <></>

  return (
    <div style={{ display: 'flex' }}>
      {rerunning ? (
        <Loader active size="large" inline="centered" content="Retesting..." />
      ) : (
        <>
          <Menu secondary vertical>
            {submission.tests?.map((test, index) => (
              <Menu.Item
                key={`test-case-${index}`}
                name={`Test Case #${index + 1}`}
                active={activeTestItem === index}
                tab={index}
                onClick={handleTestItemClick}
              />
            ))}
          </Menu>

          {submission.tests?.map((test, index) => (
            <React.Fragment key={`test-result-${index}`}>
              {index == activeTestItem ? (
                <div className="testRun">
                  <h3 className={test.result}>{capitalize(test.result || '')}</h3>
                  <b>Input</b>
                  <pre>{format_text(test.in)}</pre>

                  <div>
                    <div>
                      <b>Output</b>
                      <pre>{format_text(test.stdout || '')}</pre>
                    </div>
                    <div>
                      <b>Expected</b>
                      <pre>{format_text(test.out)}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  )
}

export default SubmissionTestOutput
