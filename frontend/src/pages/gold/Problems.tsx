import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'semantic-ui-react'
import { Block, Countdown, Unauthorized } from '../../components'
import { ProblemType } from '../../types'
import config from '../../environment'
import { useAuth } from '../../authlib'
import { UserContext } from '../../context/user'
import { Link } from 'react-router-dom'

const Problems = (): JSX.Element => {
  const [isMounted, setMounted] = useState<boolean>(false)
  const { user } = useContext(UserContext)
  const [isAuthenticated] = useAuth(user, isMounted)
  const [problems, setProblems] = useState<ProblemType[]>()

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/problems?division=gold`)
      .then(res => res.json())
      .then(probs => {
        if (isMounted) {
          probs = Object.values(probs)
          probs.sort((a: ProblemType, b: ProblemType) => a.id.localeCompare(b.id))
          setProblems(probs)
        }
      })
    return () => { setMounted(false) }
  }, [isMounted])

  return (
    <>
      {isAuthenticated ?
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
                {problems ? problems.map((problem: ProblemType, index: number) => (
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