import Editor from '@monaco-editor/react'
import type { IBlueProblem, IGoldProblem, IProblem } from "abacus"
import React, { ChangeEvent, MouseEvent, useMemo, useState } from 'react'
import { Input, InputOnChangeData, Menu, MenuItemProps } from 'semantic-ui-react'

interface SkeletonEditorProps {
  problem?: IBlueProblem
  setProblem?: React.Dispatch<React.SetStateAction<IBlueProblem | IGoldProblem | IProblem>>
}

const SkeletonsEditor = ({ problem, setProblem }: SkeletonEditorProps): React.JSX.Element => {
  const [activeLanguage, setActiveLanguage] = useState('python')

  if (!problem || !setProblem) return <></>

  const activeSkeleton = useMemo(() => {
    return problem.skeletons?.find(s => s.language == activeLanguage)
  }, [activeLanguage, problem])

  const handleSkeletonClick = (event: MouseEvent, data: MenuItemProps) => setActiveLanguage(data.tab)

  const handleSkeletonChange = (language?: string, value?: string) => {
    if (language && setProblem !== undefined) {
      setProblem({
        ...problem,
        skeletons: problem.skeletons?.map((skeleton) =>
          language == skeleton.language
            ? {
              ...skeleton,
              source: value || ''
            }
            : skeleton
        )
      })
    }
  }

  const handleChange = (_event: ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
    if (setProblem !== undefined) {
      setProblem({
        ...problem,
        skeletons: problem.skeletons?.map((skeleton) =>
          activeSkeleton?.language == skeleton.language ? { ...skeleton, file_name: value || '' } : skeleton
        )
      })
    }
  }

  return <>
    <Menu>
      {problem?.skeletons?.map(skeleton => (
        <Menu.Item
          key={`skeleton-${skeleton}`}
          name={skeleton.language}
          tab={skeleton.language}
          active={activeSkeleton?.language == skeleton.language}
          onClick={handleSkeletonClick}
        />
      ))}
      <Menu.Item position="right">
        <Input
          label="Filename"
          size="small"
          name="filename"
          value={activeSkeleton?.file_name}
          onChange={handleChange}
        />
      </Menu.Item>
    </Menu>
    <div>
      <Editor
        language={activeSkeleton?.language}
        width="100%"
        height="500px"
        theme="vs"
        value={activeSkeleton?.source}
        options={{ minimap: { enabled: false } }}
        onChange={(value?: string) => handleSkeletonChange(activeSkeleton?.language, value)}
      />
    </div>
  </>
}

export default SkeletonsEditor
