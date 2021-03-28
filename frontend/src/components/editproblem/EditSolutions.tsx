import Editor from '@monaco-editor/react';
import React, { MouseEvent, useState } from 'react';
import { Input, InputOnChangeData, Menu, MenuItemProps } from 'semantic-ui-react';
import { ProblemStateProps } from '.';

const EditSolutions = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const [activeSolution, setActiveSolution] = useState('python')
  const handleSolutionClick = (event: MouseEvent, data: MenuItemProps) => setActiveSolution(data.tab)

  const handleSolutionChange = (language: string, value?: string) => {
    if (problem && value)
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          language == solution.language ? {
            ...solution,
            source: value
          } : solution
        )
      })
  }

  const handleChange = (language: string, { value }: InputOnChangeData) =>
    setProblem({
      ...problem,
      solutions: problem.solutions?.map((solution) =>
        language == solution.language ? { ...solution, file_name: value || '' } : solution
      )
    })

  return <>
    <Menu>
      {problem?.solutions?.map((solution, index) => (
        <Menu.Item
          key={`skeleton-${index}`}
          name={solution.language}
          tab={solution.language}
          active={activeSolution == solution.language}
          onClick={handleSolutionClick} />
      ))}
    </Menu>
    {problem?.solutions?.map((solution, index) =>
      solution.language == activeSolution ?
        <>
          <div key={`editor=${index}`} style={{ margin: '15px 0' }}>
            <Editor
              key={`editor-${index}`}
              language={solution.language}
              width="100%"
              height="500px"
              theme="vs"
              value={solution.source}
              options={{ minimap: { enabled: false } }}
              onChange={(value?: string) => handleSolutionChange(solution.language, value)}
            />
          </div>
          <Input
            label='Filename'
            size='small'
            name='filename'
            value={solution.file_name}
            onChange={(event, data) => { handleChange(solution.language, data) }}
            style={{ margin: '15px' }} />
        </> : <></>
    )}
  </>
}

export default EditSolutions