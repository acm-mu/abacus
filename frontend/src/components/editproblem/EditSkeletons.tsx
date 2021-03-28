import Editor from "@monaco-editor/react"
import React, { useState, MouseEvent } from "react"
import { Input, InputOnChangeData, Menu, MenuItemProps } from "semantic-ui-react"
import { ProblemStateProps } from "."

const EditSkeletons = ({ problem, setProblem }: ProblemStateProps): JSX.Element => {
  const [activeSkeleton, setActiveSkeleton] = useState('python')

  if (!problem || !setProblem) return <></>

  const handleSkeletonClick = (event: MouseEvent, data: MenuItemProps) => setActiveSkeleton(data.tab)

  const handleSkeletonChange = (language: string, value?: string) =>
    setProblem({
      ...problem,
      skeletons: problem.skeletons?.map((skeleton) =>
        language == skeleton.language ? {
          ...skeleton,
          source: value || ''
        } : skeleton
      )
    })


  const handleChange = (language: string, { value: file_name }: InputOnChangeData) =>
    setProblem({
      ...problem,
      skeletons: problem.skeletons?.map((skeleton) =>
        language == skeleton.language ? {
          ...skeleton,
          file_name
        } : skeleton
      )
    })

  return <>
    <Menu>
      {problem?.skeletons?.map((skeleton, index) => (
        <Menu.Item key={`skeleton-${index}`} name={skeleton.language} tab={skeleton.language} active={activeSkeleton == skeleton.language} onClick={handleSkeletonClick} />
      ))}
    </Menu>
    {problem?.skeletons?.map((skeleton, index) =>
      skeleton.language == activeSkeleton ?
        <>
          <div key={`editor=${index}`} style={{ margin: '15px 0' }}>
            <Editor
              key={`editor-${index}`}
              language={skeleton.language}
              width="100%"
              height="500px"
              theme="vs"
              value={skeleton.source}
              options={{ minimap: { enabled: false } }}
              onChange={(value?: string) => handleSkeletonChange(skeleton.language, value)}
            />
          </div>
          <Input
            label='Filename'
            size='small'
            name='filename'
            value={skeleton.file_name}
            onChange={(event, data) => { handleChange(skeleton.language, data) }}
            style={{ margin: '15px' }} />
        </> : <></>
    )}
  </>
}

export default EditSkeletons