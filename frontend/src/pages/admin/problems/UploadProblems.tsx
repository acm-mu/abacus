import { Problem } from 'abacus';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Label, Message, Table } from 'semantic-ui-react';
import { Block, FileDialog } from '../../../components';
import config from "../../../environment"

interface ProblemItem extends Problem {
  checked: boolean
}

const UploadProblems = (): JSX.Element => {
  const history = useHistory()
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<string>()
  const [problems, setProblems] = useState<{ [key: string]: Problem }>({})
  const [newProblems, setNewProblems] = useState<ProblemItem[]>([])

  const uploadChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    if (files?.length) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string
        if (text) {
          setNewProblems(JSON.parse(text).map((problem: Problem) => ({ ...problem, checked: true })))
        }
      }
      reader.readAsText(files[0])
      setFile(files[0])
    }
  }

  useEffect(() => {
    fetch(`${config.API_URL}/problems`)
      .then(res => res.json())
      .then(res => setProblems(res))
  }, [])

  const filterProblem = (p1: ProblemItem, p2: Problem) => {
    if (!p2) return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checked: _, ...problem1 } = p1
    try {
      const diff = JSON.stringify(problem1, Object.keys(problem1).sort()) !== JSON.stringify(p2, Object.keys(p2).sort())
      return diff
    } catch (err) {
      setError(err)
    }
    return false
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) => {
    setNewProblems(newProblems.map(problem => problem.pid == id ? { ...problem, checked } : problem))
  }

  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) => {
    setNewProblems(newProblems.map(problem => ({ ...problem, checked })))
  }

  const handleSubmit = async () => {
    if (newProblems) {
      for (const problem of newProblems.filter(p => p.checked)) {
        await fetch(`${config.API_URL}/problems`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(problem)
        })
      }
      history.push("/admin/problems")
    }
  }

  return (<Block size='xs-12' transparent>
    <h1>Upload Problems</h1>

    {error ? <Message error><b>An Error Has Occurred! </b></Message> : <></>}

    <FileDialog file={file} onChange={uploadChange} control={(file?: File) => (
      file ?
        <>
          <h3>Your upload will include the following files:</h3>
          <ul>
            <li>{file.name} ({file.size} bytes)</li>
          </ul>
        </> : <p>
          <b>Drag & drop</b> a file here to upload <br />
          <i>(Or click and choose file)</i>
        </p>
    )} />
    {newProblems?.length ?
      <>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>
                <input type="checkbox" onChange={checkAll} />
              </Table.HeaderCell>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Problem Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {newProblems.filter(problem => filterProblem(problem, problems[problem.pid]))
              .map((problem: ProblemItem, index: number) => (
                <Table.Row key={index}>
                  <Table.HeaderCell collapsing>
                    <input
                      type="checkbox"
                      checked={problem.checked}
                      id={problem.pid}
                      onChange={handleChange} />
                  </Table.HeaderCell>
                  <Table.Cell>
                    {problem.pid}
                    {Object.keys(problems).includes(problem.pid) ?
                      <Label color='blue' style={{ float: 'right' }}>Update User</Label> :
                      <Label color='green' style={{ float: 'right' }}>Brand New</Label>}
                  </Table.Cell>
                  <Table.Cell>{problem.name}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <Button primary onClick={handleSubmit}>Import problem(s)</Button>
      </> : <></>}
  </Block>)
}

export default UploadProblems