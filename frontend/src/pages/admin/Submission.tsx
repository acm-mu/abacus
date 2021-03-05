import React, { useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, Label, Menu, MenuItemProps, Table } from 'semantic-ui-react'
import { Block } from '../../components'
import config from '../../environment'
import Moment from 'react-moment'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { capitalize, syntax_lang } from "../../utils"
import "../Submission.scss"
import { Submission, Test } from 'abacus'

const format_text = (str: string): string => str.replace(/(^.*$)/gm, (c: string) => isNaN(+c) ? `"${c}"` : c)

const submission = (): JSX.Element => {
  const history = useHistory()
  const { sid } = useParams<{ sid: string }>()
  const [submission, setSubmission] = useState<Submission>()

  const [activeItem, setActiveItem] = useState('source-code')
  const [activeTestItem, setActiveTestItem] = useState(0)

  useEffect(() => {
    loadSubmission()
  }, [])

  const loadSubmission = () => {
    fetch(`${config.API_URL}/submissions?sid=${sid}`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setSubmission(data)
      })
  }

  const deleteSubmission = () => {
    fetch(`${config.API_URL}/submissions`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sid })
    }).then(res => {
      if (res.status == 200) {
        history.push("/admin/submissions")
      }
    })
  }

  const rerun = () => {
    fetch(`${config.API_URL}/submissions/rerun`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sid })
    }).then(res => res.json())
      .then(res => {
        if (sid in res.submissions)
          setSubmission({ team: submission?.team, problem: submission?.problem, ...res.submissions[sid], })
      })
  }

  const handleItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)
  const handleTestItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveTestItem(data.tab)

  return (
    <>
      {
        submission ?
          <>
            <Block transparent size='xs-12' >
              <Button content="Rerun" icon="redo" labelPosition="left" onClick={rerun} />
              <Button content="Delete" icon="trash" negative labelPosition="left" onClick={deleteSubmission} />

              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
                    <Table.HeaderCell>TEAM</Table.HeaderCell>
                    <Table.HeaderCell>DATE</Table.HeaderCell>
                    <Table.HeaderCell>PROBLEM</Table.HeaderCell>
                    <Table.HeaderCell>STATUS</Table.HeaderCell>
                    <Table.HeaderCell>CPU</Table.HeaderCell>
                    <Table.HeaderCell>SCORE</Table.HeaderCell>
                    <Table.HeaderCell>LANGUAGE</Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell colSpan={7}>TEST CASES</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell rowSpan={2}>
                      <Link to={`/admin/submissions/${submission.sid}`}>{submission.sid.substring(0, 7)}</Link>
                    </Table.Cell>
                    <Table.Cell>{submission.team.display_name}</Table.Cell>
                    <Table.Cell><Moment fromNow date={submission?.date * 1000} /></Table.Cell>
                    <Table.Cell><Link to={`/admin/problems/${submission.pid}`}>{submission.problem.name}</Link></Table.Cell>
                    <Table.Cell><span className={`icn status ${submission.status}`} /></Table.Cell>
                    <Table.Cell>{Math.floor(submission.runtime)}</Table.Cell>
                    <Table.Cell>{submission.score}</Table.Cell>
                    <Table.Cell>{submission.language}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell colSpan={7}>
                      {submission?.tests.map((test: Test, index: number) => {
                        switch (test.result) {
                          case 'accepted':
                            return <span key={`test-${index}`} className='result icn accepted' />
                          case 'rejected':
                            return <span key={`test-${index}`} className='result icn rejected' />
                          default:
                            return <span key={`test-${index}`} className='result icn' />
                        }
                      })}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Block>

            <Menu attached='top' tabular>
              <Menu.Item name='Source Code' tab='source-code' active={activeItem === 'source-code'} onClick={handleItemClick} />

              {submission.status !== "pending" ?
                <Menu.Item name='Test Run Result' tab='test-cases' active={activeItem === 'test-cases'} onClick={handleItemClick} /> :
                <Menu.Item><Label>Test Run Pending...</Label></Menu.Item>}
            </Menu>


            <Block size="xs-12" style={{ padding: '20px', background: 'white', border: '1px solid #d4d4d5', borderTop: 'none' }}>
              {activeItem == 'source-code' ? <>
                <p>Submission contains 1 file:</p>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>FILENAME</Table.HeaderCell>
                      <Table.HeaderCell>FILESIZE</Table.HeaderCell>
                      <Table.HeaderCell>MD5</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{submission?.filename}</Table.Cell>
                      <Table.Cell>{submission?.filesize} bytes</Table.Cell>
                      <Table.Cell>{submission?.md5}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>

                <h3>{submission?.filename}</h3>
                <pre>
                  {submission?.source &&
                    <SyntaxHighlighter language={syntax_lang(submission.language)}>{submission.source}</SyntaxHighlighter>
                  }
                </pre>
              </> :
                activeItem == 'test-cases' ? <div style={{ display: 'flex' }}>
                  <Menu secondary vertical>
                    {submission.tests.map((test: Test, index: number) =>
                      <Menu.Item key={`test-case-${index}`} name={`Test Case #${index + 1}`} active={activeTestItem === index} tab={index} onClick={handleTestItemClick} />
                    )}</Menu>

                  {submission.tests.map((test: Test, index: number) => (
                    <React.Fragment key={`test-result-${index}`}>
                      {index == activeTestItem ?
                        <div className='testRun'>
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
                        : <></>}
                    </React.Fragment>
                  ))}
                </div>
                  : <></>}
            </Block>
          </>
          : <></>}
    </>
  )
}

export default submission