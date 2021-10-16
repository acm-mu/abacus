import Editor from '@monaco-editor/react'
import React, { MouseEvent, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Input, InputOnChangeData, Menu, MenuItemProps } from 'semantic-ui-react'
import { syntax_lang } from 'utils'
import { ProblemStateProps } from '.'

// TODO: LANGUAGE
const SolutionsEditor = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const [activeSolution, setActiveSolution] = useState('python')

  if (!problem) return <></>

  const handleSolutionClick = (_event: MouseEvent, data: MenuItemProps) => setActiveSolution(data.tab)

  // TODO: LANGUAGE
  const handleSolutionChange = (language: string, value?: string) => {
    if (setProblem !== undefined) {
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          language == solution.language.name
            ? {
              ...solution,
              source: value || ''
            }
            : solution
        )
      })
    }
  }

  const handleChange = (_event: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
    if (setProblem !== undefined) {
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          activeSolution == solution.language.name ? { ...solution, file_name: value || '' } : solution
        )
      })
    }
  }

  return (
    <>
      <Menu>
        {/* TODO: LANGUAGE */}
        {problem?.solutions?.map((solution, index) => (
          <Menu.Item
            key={`skeleton-${index}`}
            name={solution.language.name}
            tab={solution.language}
            active={activeSolution == solution.language.name}
            onClick={handleSolutionClick}
          />
        ))}
        {/* TODO: LANGUAGE */}
        {setProblem && (
          <Menu.Item position="right">
            {problem.solutions?.map((solution) =>
              solution.language.name == activeSolution ? (
                <Input
                  label="Filename"
                  size="small"
                  name="filename"
                  value={solution.file_name}
                  onChange={handleChange}
                />
              ) : (
                <></>
              )
            )}
          </Menu.Item>
        )}
      </Menu>

      {problem?.solutions?.map((solution, index) => (
        <div key={`solution-${index}`}>
          {solution.language.name == activeSolution ? (
            setProblem ? (
              <Editor
                language={solution.language.name}
                width="100%"
                height="500px"
                theme="vs"
                value={solution.source}
                options={{ minimap: { enabled: false } }}
                // TODO: LANGUAGE
                onChange={(value?: string) => handleSolutionChange(solution.language.name, value)}
              />
            ) : (
              // TODO: LANGUAGE
              <SyntaxHighlighter language={syntax_lang(solution.language.name)}>{solution.source}</SyntaxHighlighter>
            )
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  )
}

export default SolutionsEditor
