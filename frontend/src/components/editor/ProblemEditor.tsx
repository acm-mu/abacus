import { Problem } from 'abacus'
import React, { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Button, MenuItemProps, Divider } from 'semantic-ui-react'
import { Block } from 'components'
import ProblemInfoEditor from './ProblemInfoEditor'
import TestDataEditor from './TestDataEditor'
import DescriptionEditor from './DescriptionEditor'
import SkeletonsEditor from './SkeletonsEditor'
import SolutionsEditor from './SolutionsEditor'
import TemplateEditor from './TemplateEditor'

interface ProblemEditorProps {
  problem?: Problem
  handleSubmit: (problem: Problem) => Promise<void>
}

const ProblemEditor = ({ problem: defaultProblem, handleSubmit }: ProblemEditorProps): React.JSX.Element => {
  const [problem, setProblem] = useState<Problem>(
    defaultProblem ?? {
      pid: '',
      id: '',
      name: '',
      division: '',
      description: ''
    }
  )
  const [isSaving, setSaving] = useState(false)

  const submitPress = () => {
    setSaving(true)
    handleSubmit(problem).then(() => setSaving(false))
  }

  const [activeItem, setActiveItem] = useState<string>('problem-info')
  const handleItemClick = (_event: MouseEvent, data: MenuItemProps) => setActiveItem(data.tab)
  const navigate = useNavigate()

  return (
    <>
      <Menu attached="top" tabular>
        <Menu.Item
          name="Problem Info"
          tab="problem-info"
          active={activeItem === 'problem-info'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="Description"
          tab="description"
          active={activeItem === 'description'}
          onClick={handleItemClick}
        />
        {problem.division == 'blue' ? (
          <>
            <Menu.Item name="Test Data" tab="test-data" active={activeItem === 'test-data'} onClick={handleItemClick} />
            <Menu.Item name="Skeletons" tab="skeletons" active={activeItem === 'skeletons'} onClick={handleItemClick} />
            <Menu.Item name="Solutions" tab="solutions" active={activeItem === 'solutions'} onClick={handleItemClick} />
          </>
        ) : (
          <></>
        )}
        {problem.division == 'gold' ? (
          <>
            <Menu.Item name="Template" tab="template" active={activeItem === 'template'} onClick={handleItemClick} />
          </>
        ) : (
          <></>
        )}
      </Menu>

      <Block size="xs-12" menuAttached="top">
        {(() => {
          switch (activeItem) {
            case 'problem-info':
              return <ProblemInfoEditor problem={problem} setProblem={setProblem} />
            case 'test-data':
              return <TestDataEditor problem={problem} setProblem={setProblem} />
            case 'description':
              return <DescriptionEditor problem={problem} setProblem={setProblem} />
            case 'skeletons':
              return <SkeletonsEditor problem={problem} setProblem={setProblem} />
            case 'solutions':
              return <SolutionsEditor problem={problem} setProblem={setProblem} />
            case 'template':
              return <TemplateEditor problem={problem} setProblem={setProblem} />
            default:
              return <></>
          }
        })()}
        <Divider />
        <Button floated="right" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button floated="right" primary onClick={submitPress} loading={isSaving} disabled={isSaving}>
          Save
        </Button>
      </Block>
    </>
  )
}

export default ProblemEditor
