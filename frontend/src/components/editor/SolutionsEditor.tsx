import Editor from '@monaco-editor/react'
import type { IBlueProblem, IGoldProblem, IProblem } from "abacus"
import React, { MouseEvent, useMemo, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Input, InputOnChangeData, Menu, MenuItemProps } from 'semantic-ui-react'
import { syntax_lang } from 'utils'

interface SolutionEditorProps {
  problem: IBlueProblem,
  setProblem?: React.Dispatch<React.SetStateAction<IGoldProblem | IProblem | IBlueProblem>>
}

const SolutionsEditor = ({ problem, setProblem }: SolutionEditorProps): React.JSX.Element => {
  const [activeLanguage, setActiveLanguage] = useState('python')

  if (!problem) return <></>

  const activeSolution = useMemo(() => {
    return problem.solutions?.find(s => s.language == activeLanguage)
  }, [activeLanguage, problem])

  const handleSolutionClick = (_event: MouseEvent, data: MenuItemProps) => setActiveLanguage(data.tab)

  const handleSolutionChange = (language?: string, value?: string) => {
    if (language && setProblem !== undefined) {
      setProblem({
        ...problem,
        solutions: problem.solutions?.map((solution) =>
          language == solution.language
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
          activeLanguage == solution.language ? { ...solution, file_name: value || '' } : solution
        )
      })
    }
  }

  return (
    <>
      <Menu>
        {problem?.solutions?.map(solution => (
          <Menu.Item
            key={`skeleton-${solution}`}
            name={solution.language}
            tab={solution.language}
            active={activeSolution?.language == solution.language}
            onClick={handleSolutionClick}
          />
        ))}
        {setProblem &&
          <Menu.Item position="right">
            <Input
              label="Filename"
              size="small"
              name="filename"
              value={activeSolution?.file_name}
              onChange={handleChange}
            />
          </Menu.Item>}
      </Menu>

      <div>
        {activeSolution && <>
          {setProblem ?
            <Editor
              language={activeSolution.language}
              width="100%"
              height="500px"
              theme="vs"
              value={activeSolution.source}
              options={{ minimap: { enabled: false } }}
              onChange={(value?: string) => handleSolutionChange(activeSolution.language, value)}
            /> :
            <SyntaxHighlighter language={syntax_lang(activeSolution.language)}>{activeSolution.source}</SyntaxHighlighter>}
        </>}
      </div>
    </>
  )
}

export default SolutionsEditor
