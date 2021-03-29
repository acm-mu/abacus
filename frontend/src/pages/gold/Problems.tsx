import { Problem } from 'abacus'
import React, { useState, useEffect, useContext } from 'react'
import { Loader, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Block, Countdown } from 'components'
import config from 'environment'
import AppContext from 'AppContext'
import { Helmet } from 'react-helmet'

const Problems = (): JSX.Element => {
  const { settings } = useContext(AppContext)
  const [isMounted, setMounted] = useState<boolean>(true)
  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>()

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  const loadProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?division=gold`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    if (response.ok) {
      const problems = Object.values(await response.json()) as Problem[]
      setProblems(problems.sort((p1, p2) => p1.id.localeCompare(p2.id)))
    }
    setLoading(false)
  }

  if (!settings || new Date() < settings.start_date) {
    return <>
      <Countdown />
      <Block size='xs-12'>
        <h1>Competition not yet started!</h1>
        <p>Problem&apos;s will become available as soon as the competition begins.</p>
      </Block>
    </>
  }

  if (isLoading) return <Loader active inline='centered' content="Loading" />

  return <>
    <Helmet>
      Abacus | Gold Problems
  </Helmet>
    <Countdown />
    <Block size='xs-12' transparent>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Problem Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!(problems?.length) ?
            <Table.Row>
              <Table.Cell colspan={2} style={{ textAlign: 'center' }}>We can&apos;t find any problems. If you believe this is an error please contact us.</Table.Cell>
            </Table.Row> :
            problems.map((problem: Problem, index: number) => (
              <Table.Row key={index}>
                <Table.HeaderCell collapsing>{problem.id}</Table.HeaderCell>
                <Table.Cell>
                  <Link to={`/gold/problems/${problem.id}`}>{problem.name}</Link>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Block>
  </>
}

export default Problems