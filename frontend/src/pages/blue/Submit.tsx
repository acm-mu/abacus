import React, { useContext, useEffect, useState } from 'react'

import { Block, Countdown, FileDialog } from '../../components'
import { Form, Button } from 'semantic-ui-react'
import { ProblemType, SubmissionType } from '../../types'
import { Link, useHistory, useParams } from 'react-router-dom'
import config from '../../environment'
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
]

const Submit = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [submissions, setSubmissions] = useState<SubmissionType[]>()
  const [problem, setProblem] = useState<ProblemType>()
  const [language, setLanguage] = useState<Language>()
  const [file, setFile] = useState<File>()
  const history = useHistory()

  const { problem_id } = useParams<{ problem_id: string }>()
  useEffect(() => {
    fetch(`${config.API_URL}/problems?division=blue&id=${problem_id}`)
      .then(res => res.json())
      .then(res => {
        if (res) {
          const problem = Object.values(res)[0] as ProblemType
          setProblem(problem)
          fetch(`${config.API_URL}/submissions?team_id=${user?.user_id}&problem_id=${problem.problem_id}`)
            .then((res) => res.json())
            .then(res => {
              if (res) setSubmissions(Object.values(res))
            })
        }
      })
  }, [])

  const handleSubmit = async () => {
    if (!(language && file && problem && user)) return
    const formData = new FormData()
    formData.set('problem_id', problem.problem_id)
    formData.set('source', file, file.name)
    formData.set('language', language.key)
    formData.set('team_id', user.user_id)
    formData.set('division', user.division)

    const res = await fetch(`${config.API_URL}/submissions`, {
      method: 'POST',
      body: formData
    })

    const body: SubmissionType = await res.json()

    if (res.status != 200) {
      alert("An error occurred! Please try again")
      return
    }

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
      {!submissions || submissions?.filter((e) => e.status == "accepted").length == 0 ?
        <Block size='xs-12'>
          <h1>Submit a solution to {problem?.problem_name} </h1>

          <Form onSubmit={handleSubmit}>
            <FileDialog file={file} onChange={uploadChange} control={(file?: File) => (
              file ?
                <>
                  <h3>Your upload will include the following files:</h3>
                  <ul>
                    <li>{file.name}</li>
                  </ul>
                </> : <p>
                  <b>Drag & drop</b> a file here to upload <br />
                  <i>(Or click and choose file)</i>
                </p>
            )} />
            <Form.Select inline label='Language' placeholder="Select Language" value={language?.value} options={languages} />

            <Form.Group>
              <Button>Cancel</Button>
              <Form.Button primary content="Submit" />
            </Form.Group>
          </Form>
        </Block>
        : <Block size='xs-12' transparent>
          <h2>You Already Solved This Problem!</h2>
          <Link to={`/blue/submissions/${submissions.filter((e) => e.status == "accepted")[0].submission_id}`}>Go to your solved submission</Link>
        </Block>}
    </>
  )
}
export default Submit