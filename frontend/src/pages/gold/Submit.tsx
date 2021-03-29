import { Problem } from "abacus";
import React, { useEffect, useState } from "react";
import { Form, Loader, DropdownProps, InputOnChangeData } from "semantic-ui-react";
import { Block, ScratchViewer } from "components";
import config from "environment"
import { Helmet } from "react-helmet";

const Submit = (): JSX.Element => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [problem, setProblem] = useState()
  const [project_id, setProjectId] = useState<string>()
  const [isLoading, setLoading] = useState(true)
  const [isMounted, setMounted] = useState(true)

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
    if (response.ok && isMounted) {
      setProblems(Object.values(await response.json()))
    }
    setLoading(false)
  }

  const handleProblemChange = (event: React.SyntheticEvent<HTMLElement, Event>, { key }: DropdownProps) => setProblem(key)
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => setProjectId(value)

  if (isLoading) return <Loader inline='centered' active />

  return <>
    <Helmet>
      <title>Abacus | Gold Submit</title>
    </Helmet>
    <Block size='xs-12'>
      <Form>
        <Form.Group widths='equal'>
          <Form.Select
            label='Problem'
            placeholder='Problem'
            name='problem'
            value={problem}
            onChange={handleProblemChange}
            options={problems.map((problem) => ({ key: problem.pid, text: problem.name, value: problem.pid }))}
          />
          <Form.Input
            label='Project Id'
            onChange={handleChange}
            placeholder="#######"
            value={project_id}
          />
        </Form.Group>
      </Form>
    </Block>

    <Block transparent size='xs-12'>
      <ScratchViewer project_id={project_id} />
    </Block>
  </>
}

export default Submit