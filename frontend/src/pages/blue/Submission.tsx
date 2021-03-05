import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { Link, useParams } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Block, Countdown, NotFound } from '../../components'
import config from '../../environment'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { syntax_lang } from '../../utils'
import { Submission } from 'abacus'

const submission = (): JSX.Element => {
  // const { user } = useContext(AppContext)
  const [isMounted, setMounted] = useState<boolean>(false)
  const [submission, setSubmission] = useState<Submission>()
  const { sid } = useParams<{ sid: string }>()

  useEffect(() => {
    setMounted(true)
    if (sid) {
      fetch(`${config.API_URL}/submissions?sid=${sid}`)
        .then(res => res.json())
        .then(res => {
          if (isMounted)
            setSubmission(Object.values(res)[0] as Submission)
        })
    }
    return () => { setMounted(false) }
  }, [sid, isMounted])

  return (
    <>
      {sid ?
        <>
          <Countdown />
          <Block transparent size="xs-12">
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan={2}>ID</Table.HeaderCell>
                  <Table.HeaderCell>DATE</Table.HeaderCell>
                  <Table.HeaderCell>PROBLEM</Table.HeaderCell>
                  <Table.HeaderCell>STATUS</Table.HeaderCell>
                  <Table.HeaderCell>CPU</Table.HeaderCell>
                  <Table.HeaderCell>LANG</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell colSpan={5}>TEST CASES</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell rowSpan={2}><Link to={`/blue/submissions/${submission?.sid}`}>{submission?.sid.substring(0, 7)}</Link></Table.Cell>
                  <Table.Cell>{submission && <Moment fromNow date={submission.date * 1000} />}</Table.Cell>
                  <Table.Cell><Link to={`/blue/problems/${submission?.problem.id}`}>{submission?.problem.name}</Link></Table.Cell>
                  <Table.Cell><span className={`status icn ${submission?.status}`} /></Table.Cell>
                  <Table.Cell>{Math.floor(submission?.runtime || 0)}</Table.Cell>
                  <Table.Cell>{submission?.language}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell colSpan="5">
                    {submission?.tests.map((test, index) => {
                      switch (test.result) {
                        case 'accepted':
                          return <span key={index} className='result icn accepted' />
                        case 'rejected':
                          return <span key={index} className='result icn rejected' />
                        default:
                          return <span key={index} className='result icn' />
                      }
                    })}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Block>

          <Block size="xs-12">
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
          </Block>
        </> :
        <NotFound />
      }
    </>
  )
}

export default submission