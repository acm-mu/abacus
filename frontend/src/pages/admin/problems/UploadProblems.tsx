import { Problem } from 'abacus';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Label, Message, Table } from 'semantic-ui-react';
import { Block, FileDialog } from 'components';
import config from "environment"
import { Helmet } from 'react-helmet';

interface ProblemItem extends Problem {
  checked: boolean
}

const UploadProblems = (): JSX.Element => {
  const history = useHistory()
  const [file, setFile] = useState<File>()
  const [existingProblems, setExistingProblems] = useState<{ [key: string]: Problem }>()
  const [newProblems, setNewProblems] = useState<ProblemItem[]>()
  const [isMounted, setMounted] = useState(true)

  const uploadChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    if (!files?.length) return

    const reader = new FileReader();

    reader.onload = async ({ target }: ProgressEvent<FileReader>) => {
      const text = target?.result as string
      if (text) {
        let problems: ProblemItem[] = JSON.parse(text).map((problem: Problem) => ({ ...problem, checked: true }))

        if (existingProblems) problems = problems.filter((problem: ProblemItem) => filterProblem(problem, existingProblems[problem.pid]))

        setNewProblems(problems)
      }
    }

    reader.readAsText(files[0])
    setFile(files[0])
  }

  const loadExistingProblems = async () => {
    const response = await fetch(`${config.API_URL}/problems?columns=description,design_document,project_id,skeletons,solutions,tests`, {
      headers: { Authorization: `Bearer ${localStorage.accessToken}` }
    })

    if (!response.ok || !isMounted) return

    setExistingProblems(await response.json())
  }

  useEffect(() => {
    loadExistingProblems()

    return () => setMounted(false)
  }, [])

  const filterProblem = (p1: ProblemItem, p2: Problem) => {
    if (!p2) return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { checked, ...problem1 } = p1
    const { ...problem2 } = p2

    return JSON.stringify(problem1, Object.keys(problem1).sort()) != JSON.stringify(problem2, Object.keys(problem2).sort())
  }

  const handleChange = ({ target: { id, checked } }: ChangeEvent<HTMLInputElement>) =>
    setNewProblems(newProblems?.map(problem => problem.pid == id ? { ...problem, checked } : problem))
  const checkAll = ({ target: { checked } }: ChangeEvent<HTMLInputElement>) =>
    setNewProblems(newProblems?.map(problem => ({ ...problem, checked })))


  const handleSubmit = async () => {
    if (newProblems) {
      for (const problem of newProblems.filter(p => p.checked)) {
        const response = await fetch(`${config.API_URL}/problems`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.accessToken}`
          },
          body: JSON.stringify(problem)
        })
        if (response.ok) {
          history.push("/admin/problems")
        }
      }
    }
  }

  return <>
    <Helmet><title>Abacus | Admin Upload Problems</title> </Helmet>

    <Block size='xs-12' transparent>
      <h1>Upload Problems</h1>
      <Block transparent size='xs-12'>
        <Button content='Back' icon='arrow left' labelPosition='left' onClick={history.goBack} />
      </Block>

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
                  <input type="checkbox" onChange={checkAll} checked={newProblems.length > 0 && newProblems.filter(problem => !problem.checked).length == 0} />
                </Table.HeaderCell>
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Problem Name</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {newProblems.map((problem, index) => (
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
                    {Object.keys(existingProblems || {}).includes(problem.pid) ?
                      <Label color='blue' style={{ float: 'right' }}>Update Problem</Label> :
                      <Label color='green' style={{ float: 'right' }}>Brand New</Label>}
                  </Table.Cell>
                  <Table.Cell>{problem.name}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Button primary onClick={handleSubmit}>Import problem(s)</Button>
        </> : newProblems ? <Message warning icon='warning sign' content="The file contains no new or modified problem(s)." /> : <></>}
    </Block>
  </>
}

export default UploadProblems