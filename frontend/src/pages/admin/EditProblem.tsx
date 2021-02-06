import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Input, Menu, Button, TextArea, MenuItemProps } from 'semantic-ui-react'
import { TestType } from '../../types'
import config from '../../environment'

const InitialProblem = {
  problem_name: '',
  id: '',
  problem_id: '',
  memory_limit: 0,
  cpu_time_limit: 0,
  description: '',
  tests: []
}

const EditProblems = (): JSX.Element => {
  const [problem, setProblem] = useState(InitialProblem)

  const [activeItem, setActiveItem] = useState('problem-info')
  const handleItemClick = (event: React.MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)

  const { problem_id } = useParams<{ problem_id: string }>()

  useEffect(() => {
    fetch(`${config.API_URL}/v1/problems?id=${problem_id}`)
      .then(res => res.json())
      .then(data => {
        data = Object.values(data)[0]
        setProblem(data)
      })
  }, [])

  return (
    <Form>
      <Input name='problem-id' value={`${problem.problem_id}`} style={{ display: "none" }} />

      <div className='edit-problem-header'>
        <h1>Edit Problem {problem.id}</h1>
        <Button icon='trash' color='red' />
        <Button icon='save' color='blue' style={{ display: 'inline-block' }} /> {/* SUBMIT */}
        <span style={{ display: 'inline-block' }}><i>problem_id: {problem.problem_id}</i></span>
      </div>

      <Menu attached='top' tabular>
        <Menu.Item name='Problem Info' tab='problem-info' active={activeItem === 'problem-info'} onClick={handleItemClick} />
        <Menu.Item name='Test Data' tab='test-data' active={activeItem === 'test-data'} onClick={handleItemClick} />
        <Menu.Item name='Description' tab='description' active={activeItem === 'description'} onClick={handleItemClick} />
        <Menu.Item name='Sample Files' tab='sample-files' active={activeItem === 'sample-files'} onClick={handleItemClick} />
      </Menu>

      {(() => {
        switch (activeItem) {
          case 'problem-info':
            return (<section>
              <Form.Field label='Problem ID' control={Input} value={problem.id} />
              <Form.Field label='Problem Name' control={Input} value={problem.problem_name} />
              <Form.Group widths='equal'>
                <Form.Field label='Memory Limit' control={Input} value={problem.memory_limit} />
                <Form.Field label='CPU Time Limit' control={Input} value={problem.cpu_time_limit} />
              </Form.Group>
            </section>)
          case 'test-data':
            return (<section>
              <Form.Field label='Tests'>
                <label>Tests</label>
                <Menu attached='top' tabular>
                  {problem?.tests.map((test: TestType, index: number) =>
                    <Menu.Item key={index} name={`${index}`} /> //onClick={setActive} />
                  )}
                  <Menu.Item name='+' /> {/*onClick={newItem}/>*/}
                </Menu>
                {/* <div className="ui bottom attached active tab segment" id="tests_content">
                  {problem?.tests.map((test: TestType, index: number) =>
                    <div key={index} className="two fields" style={{ display: "none" }}>
                      <div className="field">
                        <label>Input</label>
                        <textarea name={`${index}-in`}>{test.in}</textarea>
                      </div>
                      <div className="field">
                        <label>Answer</label>
                        <textarea name={`${index}-out`}>{test.out}</textarea>
                      </div>
                    </div>)}
                  <div className="field">
                    <div className="ui button negative" onclick="deleteActive(this)">Delete</div>
                  </div> */}
                {/* </div> */}
              </Form.Field>
            </section>)
          case 'description':
            return (<section>
              <Form.Group widths='equal'>
                <Form.Field label='Problem Description' control={TextArea} value={problem.description} />
                <Form.Field label='Preview'>
                  <div id="preview" className="markdown">{problem.description}</div></Form.Field>
              </Form.Group>
            </section>)
          case 'sample-files':
            return (<section>
              <h3>Sample Files</h3>
            </section>)
        }
      })()}
    </Form>
  )
}

export default EditProblems