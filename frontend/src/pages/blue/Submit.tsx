import type { IBlueProblem, IBlueSubmission } from 'abacus'
import { ProblemRepository, SubmissionRepository } from 'api'
import { Block, Countdown, FileDialog, NotFound, PageLoading, StatusMessage, Unauthorized } from 'components'
import { AppContext } from 'context'
import { usePageTitle } from 'hooks'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import { Language, languages } from 'utils'

const Submit = (): React.JSX.Element => {
  usePageTitle("Abacus | Blue Submit")

  const problemRepo = new ProblemRepository()
  const submissionRepo = new SubmissionRepository()

  const { user } = useContext(AppContext)
  const [submissions, setSubmissions] = useState<IBlueSubmission[]>()
  const [problem, setProblem] = useState<IBlueProblem>()
  const [isLoading, setLoading] = useState(true)
  const [language, setLanguage] = useState<Language>()
  const [file, setFile] = useState<File>()
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const navigate = useNavigate()

  const [isMounted, setMounted] = useState(true)

  const { pid } = useParams<{ pid: string }>()

  useEffect(() => {
    loadProblem().catch(console.error)
    return () => {
      setMounted(false)
    }
  }, [])

  const loadProblem = async () => {
    const response = await problemRepo.getMany({ filterBy: { division: 'blue', id: pid } })

    if (!isMounted) return

    if (response.ok && response.data) {
      const problem = response.data.items[0]

      setProblem(problem as IBlueProblem)
      if (problem) {
        const submissionResponse = await submissionRepo.getMany({
          filterBy: {
            teamId: user?.uid,
            problemId: problem.pid
          }
        })

        if (!isMounted) return

        if (response.ok && submissionResponse.data) {
          setSubmissions(Object.values(submissionResponse.data) as IBlueSubmission[])
        }
      }
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!(language && file && problem && user)) return
    setSubmitting(true)

    // const newSubmission = {
    //   pid: problem.pid,
    //   source: [file, file.name],
    //   language: language.key,
    //   division: user.division
    // }

    // const response = await submissionRepo.create(newSubmission)
    throw new Error("This method has not been fully implemented")

    // if (response.ok) {
    //   setError(response.errors)
    //   setSubmitting(false)
    //   return
    // }
    //
    // setSubmitting(false)
    //
    // navigate(`/blue/submissions/${response.data?.sid}`)
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

  if (isLoading) return <PageLoading />
  if (!problem) return <NotFound />
  if (user?.division != 'blue' && user?.role != 'admin') return <Unauthorized />

  if (user.disabled) {
    return (
      <>
        <Countdown />
        <Block size="xs-12">
          <h2>Your account has been disabled!</h2>
          <p>You are not allowed to submit problems because your account has been disabled.</p>
        </Block>
      </>
    )
  }

  if (submissions?.filter((e) => e.status == 'accepted').length !== 0) {
    return (
      <>
        <Countdown />
        <Block size="xs-12">
          <h2>You Already Solved This Problem!</h2>
          <p>
            <Link to={`/blue/submissions/${submissions?.filter((e) => e.status === 'accepted')[0].sid}`}>
              Go to your solved submission
            </Link>
          </p>
        </Block>
      </>
    )
  }

  if (submissions?.filter(({ status, released }) => status == 'pending' || !released).length !== 0) {
    return (
      <>
        <Countdown />
        <Block size="xs-12">
          <h2>Cannot submit to {problem.name}</h2>
          <p>You cannot submit until your last submission has been graded and released!</p>
          <p>
            <Link to="/blue/problems">Go back to problems.</Link>
          </p>
        </Block>
      </>
    )
  }

  return (
    <>
      <Countdown />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/blue/problems" content="Problems" />
          <Breadcrumb.Divider />
          <Breadcrumb.Section as={Link} to={`/blue/problems/${problem?.id}`} content={problem?.name} />
          <Breadcrumb.Divider />
          <Breadcrumb.Section active content="Submit" />
        </Breadcrumb>
      </Block>
      {error ? <StatusMessage message={{ type: 'error', message: error }} /> : <></>}
      <Block size="xs-12">
        <h1>Submit a solution to {problem?.name} </h1>

        <Form>
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
          <Form.Select
            inline
            label="Language"
            placeholder="Select Language"
            value={language?.value}
            options={languages}
          />

          <Form.Group>
            <Form.Button
              primary
              content="Submit"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </Form.Group>
        </Form>
      </Block>
    </>
  )
}
export default Submit
