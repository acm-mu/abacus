import Editor from '@monaco-editor/react';
import React, { MouseEvent, useState } from 'react';
import { Input, InputOnChangeData, Menu, MenuItemProps } from 'semantic-ui-react';
import { ProblemStateProps } from '.';

const SolutionsEditor = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const [activeSolution, setActiveSolution] = useState('python')

  if (!problem || !setProblem) return <></>

  const handleSolutionClick = (_event: MouseEvent, data: MenuItemProps) => setActiveSolution(data.tab)

  const handleSolutionChange = (language: string, value?: string) =>
    setProblem({
      ...problem,
      solutions: problem.solutions?.map((solution) =>
        language == solution.language ? {
          ...solution,
          source: value || ''
        } : solution
      )
    })


  const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) =>
    setProblem({
      ...problem,
      solutions: problem.solutions?.map((solution) =>
        activeSolution == solution.language ? { ...solution, file_name: value || '' } : solution
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
      <Menu.Item position='right'>
        {problem.solutions?.map((solution) =>
        (solution.language == activeSolution ?
          <Input
            label='Filename'
            size='small'
            name='filename'
            value={solution.file_name}
            onChange={handleChange} />
          : <></>))}
      </Menu.Item>
    </Menu>

    {problem?.solutions?.map((solution, index) =>
      <div key={`solution-${index}`}>
        {solution.language == activeSolution ?
          <Editor
            language={solution.language}
            width="100%"
            height="500px"
            theme="vs"
            value={solution.source}
            options={{ minimap: { enabled: false } }}
            onChange={(value?: string) => handleSolutionChange(solution.language, value)}
          /> : <></>}
      </div>
    )}
  </>
}

export default SolutionsEditor