import { Problem, Submission } from 'abacus'
import { Block, Countdown, FileDialog, NotFound, PageLoading } from 'components'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import { Language, languages } from 'utils'
import { v4 as uuidv4 } from 'uuid'

const SubmitPractice = (): JSX.Element => {
  const { id } = useParams<{ id: string }>()
  const [isLoading, setLoading] = useState(false)
  const [isPageLoading, setPageLoading] = useState(true)
  const submissions: Submission[] = []
  const [problem, setProblem] = useState<Problem>()

  // TODO: LANGUAGE
  const [language, setLanguage] = useState<Language>()
  const [file, setFile] = useState<File>()
  const history = useHistory()

  useEffect(() => {
    fetch(`/problems/${id}.json`)
      .then((response) => response.json())
      .then((data) => {
        setProblem(data)
        setPageLoading(false)
      })
  }, [])

  const testSubmission = async (submission: Submission): Promise<Submission> => {
    let runtime = -1
    let status = 'accepted'
    if (submission.tests) {
      for (const test of submission.tests) {
        // Await response from piston execution
        // TODO: LANGUAGE
        const res = await fetch('https://piston.codeabac.us/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: submission.language,
            source: submission.source,
            stdin: test.in,
            timeout: 15
          })
        })

        const json = await res.json()

        runtime = Math.max(runtime, json.runtime)
        test.stdout = json.output

        if (json.output != test.out) {
          status = 'rejected'
          test['result'] = 'rejected'
        } else {
          test['result'] = 'accepted'
        }
      }
      submission.status = status
    }
    submission.runtime = runtime
    submission.score = 0

    return submission
  }

  const handleSubmit = async () => {
    // TODO: LANGUAGE
    if (!(language && file && problem)) return

    setLoading(true)

    const { name: filename, size: filesize } = file
    const fileReader = new FileReader()

    let submissions: { [key: string]: Submission } = {}
    if (localStorage.submissions != undefined) {
      submissions = JSON.parse(localStorage.submissions)
    }

    fileReader.onloadend = async () => {
      const data = fileReader.result
      if (!data) return

      const sid = uuidv4().replace(/-/g, '')

      submissions[sid] = await testSubmission({
        sid,
        problem,
        pid: problem.id,
        tid: 'LOCAL',
        division: 'blue',
        // TODO: LANGUAGE
        language: language.key,
        // language: language.key,
        filename,
        filesize,
        md5: '',
        sub_no: Object.values(submissions).filter(({ pid }: { pid: string }) => pid == id).length,
        released: true,
        status: 'pending',
        score: 0,
        date: Date.now() / 1000,
        tests: problem.tests,
        runtime: 0,
        source: data.toString()
      })

      localStorage.setItem('submissions', JSON.stringify(submissions))

      history.push(`/blue/practice/${sid}`)
    }

    fileReader.readAsText(file)
  }

  const uploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.length) {
      const file = event.target.files[0]
      const ext = file.name.substring(file.name.lastIndexOf('.'), file.name.length)

      if (file.size > 1024 * 1024) {
        alert('File is greater than max size (1024 KB)')
        event.preventDefault()
        return
      }

      // TODO: LANGUAGE
      for (const language of languages) {
        if (ext == language.file_extension) {
          setLanguage(language)
          setFile(file)
          return
        }
      }
      alert('File type not supported')
      event.preventDefault()
    }
  }
  if (isPageLoading) return <PageLoading />
  if (!problem) return <NotFound />

  return (
    <>
      <Helmet>
        <title>Abacus | Submit Practice {problem.id}</title>
      </Helmet>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/practice">
            Practice
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section as={Link} to={`/blue/practice/${problem.id}`}>
            {problem.name}
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>Submit</Breadcrumb.Section>
        </Breadcrumb>
      </Block>
      {!submissions || submissions?.filter((e) => e.status == 'accepted').length == 0 ? (
        <Block size="xs-12">
          <h1>Submit a solution to {problem.name}</h1>

          <Form onSubmit={handleSubmit}>
            <FileDialog
              file={file}
              onChange={uploadChange}
              control={(file?: File) =>
                file ? (
                  <>
                    <h3>Your upload will include the following files:</h3>
                    <ul>
                      <li>{file.name}</li>
                    </ul>
                  </>
                ) : (
                  <p>
                    <b>Drag & drop</b> a file here to upload <br />
                    <i>(Or click and choose file)</i>
                  </p>
                )
              }
            />
            {/* TODO: LANGUAGE */}
            <Form.Select
              inline
              label="Language"
              placeholder="Select Language"
              value={language?.value}
              options={languages}
            />

            <Form.Group>
              <Button as={Link} to={`/blue/practice/${problem.id}`} disabled={isLoading}>
                Cancel
              </Button>
              <Form.Button loading={isLoading} disabled={isLoading} primary>
                Submit
              </Form.Button>
            </Form.Group>
          </Form>
        </Block>
      ) : (
        <Block size="xs-12" transparent>
          <h2>You Already Solved This Problem!</h2>
          <Link to={`/blue/submissions/${submissions.filter((e) => e.status == 'accepted')[0].sid}`}>
            Go to your solved submission
          </Link>
        </Block>
      )}
    </>
  )
}

export default SubmitPractice
