import React, { useContext, useEffect, useState } from 'react'

import { Block, Countdown } from '../../components'
import { Form, Button } from 'semantic-ui-react'
import { ProblemType, SubmissionType } from '../../types'
import { useHistory, useParams } from 'react-router-dom'
import config from '../../environment'
import './Submit.scss'
import { UserContext } from '../../context/user'

interface Language {
  key: string;
  value: string;
  text: string;
  file_extension: string;
}
const languages: Language[] = [
  { key: 'python3', value: 'Python 3', text: 'Python 3', file_extension: '.py' },
  { key: 'java', value: 'Java', text: 'Java', file_extension: '.java' },
  // { key: 'c', value: 'C', text: 'C' }
]

const Submit = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [problem, setProblem] = useState<ProblemType>()
  const [language, setLanguage] = useState<Language>()
  const [file, setFile] = useState<File>()
  const history = useHistory()

  const { problem_id: id } = useParams<{ problem_id: string }>()
  useEffect(() => {
    fetch(`${config.API_URL}/problems?id=${id}`)
      .then(res => res.json())
      .then(res => {
        res = Object.values(res)[0] as ProblemType
        setProblem(res)
      })
  }, [])

  const handleSubmit = async () => {
    if (!(language && file && problem && user)) return
    const formData = new FormData()
    // formData.set('file_ext', language.file_extension)
    formData.set('problem_id', problem.problem_id)
    formData.set('file', file, file.name)
    formData.set('language', language.key)
    formData.set('team_id', user.user_id)
    formData.set('division', user.division)

    const res = await fetch(`${config.API_URL}/submissions`, {
      method: 'POST',
      body: formData
    })

    const body: SubmissionType = await res.json()

    if (res.status != 200) alert("An error occurred! Please try again")

    history.push(`/blue/submissions/${body.submission_id}`)
  }

  const uploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.length) {
      const file = event.target.files[0]
      const ext = file.name.substring(file.name.lastIndexOf("."), file.name.length)

      if (file.size > 1024 * 1024) {
        alert("File is greater than max size (1024 KB)")
        event.preventDefault()
        return
      }

      for (const language of languages) {
        if (ext == language.file_extension) {
          setLanguage(language)
          setFile(file)
          return
        }
      }
      alert("File type not supported")
      event.preventDefault()
    }
  }
  return (
    <>
      <Countdown />
      <Block size='xs-12'>
        <h1>Submit a solution to {problem?.problem_name} </h1>

        <Form onSubmit={handleSubmit}>
          <div id="file_dialog">
            <div className="message">
              {file ? <>
                <h3>Your submission will include the following files:</h3>
                <ul> <li>
                  {file.name}
                </li> </ul>
              </> : <>
                  <b>Drag & drop</b> a file here to upload<br />
                  <i>(Or click and choose file)</i>
                </>}
            </div>
            <input id="sub_files_input" type="file" name="sub-file" onChange={uploadChange} />
          </div>

          <Form.Select inline label='Language' placeholder="Select Language" value={language?.value} options={languages} />

          <Form.Group>
            <Button>Cancel</Button>
            <Form.Button primary content="Submit" />
          </Form.Group>
        </Form>
      </Block>
    </>
  )
}
export default Submit