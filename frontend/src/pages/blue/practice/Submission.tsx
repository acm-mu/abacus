import { Submission, Test } from 'abacus'
import React, { MouseEvent, useState } from 'react'
import { Block, Countdown } from 'components'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { Breadcrumb, Label, Menu, MenuItemProps, Message, Table } from 'semantic-ui-react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { capitalize, format_text, syntax_lang } from 'utils'
import { Helmet } from 'react-helmet'

interface PracticeSubmissionProps {
  submission: Submission
}

const PracticeSubmission = ({ submission }: PracticeSubmissionProps): JSX.Element => {
  const [activeItem, setActiveItem] = useState('source-code')
  const [activeTestItem, setActiveTestItem] = useState(0)

  const handleItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)
  const handleTestItemClick = (event: MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)

  return (
    <>
      <Helmet>
        <title>Abacus | Practice Submission</title>
      </Helmet>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/practice" content="Practice" />
          <Breadcrumb.Divider />
          <Breadcrumb.Section
            as={Link}
            to={`/blue/practice/${submission.problem.id}`}
            content={submission.problem.name}
          />
          <Breadcrumb.Divider />
          <Breadcrumb.Section active content={submission.sid.substring(0, 7)} />
        </Breadcrumb>
      </Block>
      <Block transparent size="xs-12">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
              <Table.HeaderCell>PROBLEM</Table.HeaderCell>
              <Table.HeaderCell>DATE</Table.HeaderCell>
              <Table.HeaderCell>STATUS</Table.HeaderCell>
              <Table.HeaderCell>TEST CASES</Table.HeaderCell>
              <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell rowSpan={2}>
                <Link to={`/blue/practice/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
              </Table.Cell>
              <Table.Cell>
                <Link to={`/blue/practice/${submission.pid}`}>{submission.problem?.name}</Link>
              </Table.Cell>
              <Table.Cell>
                <Moment fromNow date={submission?.date * 1000} />
              </Table.Cell>
              <Table.Cell>
                <span className={`icn status ${submission.status}`} />
              </Table.Cell>
              <Table.Cell>
                {submission?.tests?.map((test: Test, index: number) => {
                  switch (test.result) {
                    case 'accepted':
                      return <span key={`test-${index}`} className="result icn accepted" />
                    case 'rejected':
                      return <span key={`test-${index}`} className="result icn rejected" />
                    default:
                      return <span key={`test-${index}`} className="result icn" />
                  }
                })}
              </Table.Cell>
              {/* TODO: LANGUAGE */}
              <Table.Cell>{submission.language}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Block>

      <Menu attached="top" tabular>
        <Menu.Item
          name="Source Code"
          tab="source-code"
          active={activeItem === 'source-code'}
          onClick={handleItemClick}
        />

        {submission.status !== 'pending' ? (
          <Menu.Item
            name="Test Run Result"
            tab="test-cases"
            active={activeItem === 'test-cases'}
            onClick={handleItemClick}
          />
        ) : (
          <Menu.Item>
            <Label>Test Run Pending...</Label>
          </Menu.Item>
        )}
      </Menu>

      <Block size="xs-12" menuAttached="top">
        {activeItem == 'source-code' ? (
          <>
            <p>Submission contains 1 file:</p>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>FILENAME</Table.HeaderCell>
                  <Table.HeaderCell>FILESIZE</Table.HeaderCell>
                  {/* <Table.HeaderCell>MD5</Table.HeaderCell> */}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{submission?.filename}</Table.Cell>
                  <Table.Cell>{submission?.filesize} bytes</Table.Cell>
                  {/* <Table.Cell>{submission?.md5}</Table.Cell> */}
                </Table.Row>
              </Table.Body>
            </Table>

            <h3>{submission?.filename}</h3>
            <pre>
              {/* TODO: LANGUAGE */}
              {submission?.source && (
                <SyntaxHighlighter language={syntax_lang(submission.language)}>{submission.source}</SyntaxHighlighter>
              )}
            </pre>
          </>
        ) : activeItem == 'test-cases' ? (
          <>
            <Message
              warning
              icon="warning triangle"
              header="Heads Up!"
              content="This section will not be visible during the competition"
            />
            <div style={{ display: 'flex' }}>
              <Menu secondary vertical>
                {submission.tests?.map((test: Test, index: number) => (
                  <Menu.Item
                    key={`test-case-${index}`}
                    name={`Test Case #${index + 1}`}
                    active={activeTestItem === index}
                    tab={index}
                    onClick={handleTestItemClick}
                  />
                ))}
              </Menu>

              {submission.tests?.map((test: Test, index: number) => (
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
            </div>
          </>
        ) : (
          <></>
        )}
      </Block>
    </>
  )
}

export default PracticeSubmission
