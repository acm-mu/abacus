import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'semantic-ui-react'
import { Block, Countdown, Unauthorized } from '../../components'
import config from '../../environment'
import { Link } from 'react-router-dom'
import { Problem } from 'abacus'
import { AppContext } from '../../AppContext'

const Problems = (): JSX.Element => {
  const [isMounted, setMounted] = useState<boolean>(false)
  const { user } = useContext(AppContext)
  const [problems, setProblems] = useState<Problem[]>()

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/problems?division=gold`)
      .then(res => res.json())
      .then(probs => {
        if (isMounted) {
          probs = Object.values(probs)
          probs.sort((a: Problem, b: Problem) => a.id.localeCompare(b.id))
          setProblems(probs)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted])

  return (
    <>
      {user ?
        <>
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
                {problems ? problems.map((problem: Problem, index: number) => (
                  <Table.Row key={index}>
                    <Table.HeaderCell collapsing>{problem.id}</Table.HeaderCell>
                    <Table.Cell>
                      <Link to={`/gold/problems/${problem.id}`}>{problem.name}</Link>
                    </Table.Cell>
                  </Table.Row>
                )) : <></>}
              </Table.Body>
            </Table>
          </Block>
        </> :
        <Unauthorized />
      }
    </>
  )
}

export default Problems