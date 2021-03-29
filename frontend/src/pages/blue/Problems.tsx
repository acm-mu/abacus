import { Problem } from "abacus";
import React, { useContext, useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Block, Countdown, PageLoading } from "components";
import config from 'environment'
import AppContext from "AppContext";
import 'components/Table.scss'
import { Helmet } from "react-helmet";


const Problems = (): JSX.Element => {
  const { settings } = useContext(AppContext);
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [problems, setProblems] = useState<Problem[]>()

  const helmet = <Helmet> <title>Abacus | Blue Problems</title> </Helmet>

  useEffect(() => {
    loadProblems()
    return () => { setMounted(false) }
  }, [])

  const loadProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?type=list&division=blue`, {
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`
      }
    })

    if (!isMounted) return

    if (response.ok) {
      let problems = Object.values(await response.json()) as Problem[]
      problems = problems.sort((p1: Problem, p2: Problem) => p1.id.localeCompare(p2.id))
      setProblems(problems)
    }
    setLoading(false)
  }

  if (!settings || new Date() < settings.start_date)
    return <>
      {helmet}
      <Countdown />
      <Block size='xs-12'>
        <h1>Competition not yet started!</h1>
        <p>Problem&apos;s will become available as soon as the competition begins.</p>
      </Block>
    </>


  if (isLoading) return <PageLoading />

  return <>
    {helmet}
    <Countdown />
    <Block size="xs-12" transparent>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Problem Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!(problems?.length) ?
            <Table.Row>
              <Table.Cell colSpan={'100%'} textAlign='center'>We can&apos;t find any problems. If you believe this is an error please contact us.</Table.Cell>
            </Table.Row> :
            problems.map((problem: Problem) =>
              <Table.Row key={problem.pid}>
                <Table.HeaderCell collapsing textAlign='center'>{problem.id}</Table.HeaderCell>
                <Table.Cell>
                  <Link to={`/blue/problems/${problem.id}`}>{problem.name}</Link>
                </Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table>
    </Block>
  </>
};

export default Problems;
