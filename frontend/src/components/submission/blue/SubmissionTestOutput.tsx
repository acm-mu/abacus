import type { ITestResult } from "abacus"
import React, { useContext, useMemo, useState } from 'react'
import { Loader, Menu } from 'semantic-ui-react'
import { capitalize, format_text } from 'utils'
import BlueSubmissionContext from "./context"

const SubmissionTestOutput = (): React.JSX.Element => {
  const { submission, rerunning } = useContext(BlueSubmissionContext)

  const [activeItem, setActiveItem] = useState(0)

  if (!submission) return <></>

  const activeTestItem = useMemo(() => {
    return submission.tests[activeItem]
  }, [activeItem, submission])

  return (
    <div style={{ display: 'flex' }}>
      {rerunning ? (
        <Loader active size="large" inline="centered" content="Retesting..." />
      ) : (
        <>
          <Menu secondary vertical>
            {submission.tests?.map((test, index) => (
              <Menu.Item
                key={`test-case-${test}`}
                name={`Test Case #${index + 1}`}
                active={activeItem === index}
                tab={index}
                onClick={(_, { tab }) => setActiveItem(tab)}
              />
            ))}
          </Menu>

          <React.Fragment>
            {'result' in activeTestItem &&
              <div className="testRun">
                <h3
                  className={(activeTestItem as ITestResult).result}>{capitalize((activeTestItem as ITestResult).result || '')}</h3>
                <b>Input</b>
                <pre>{format_text(activeTestItem.in)}</pre>

                <div>
                  <div>
                    <b>Output</b>
                    <pre>{format_text((activeTestItem as ITestResult).stdout || '')}</pre>
                  </div>
                  <div>
                    <b>Expected</b>
                    <pre>{format_text(activeTestItem.out)}</pre>
                  </div>
                </div>
              </div>}
          </React.Fragment>
        </>
      )}
    </div>
  )
}

export default SubmissionTestOutput
