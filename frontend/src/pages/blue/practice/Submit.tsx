import { Submission } from 'abacus'
import { Block, Countdown, FileDialog } from 'components'
import React, { ChangeEvent, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { Language, languages } from 'utils'
import { v4 as uuidv4 } from 'uuid'
import problem from './problem.json';

const SubmitPractice = (): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const submissions: Submission[] = []

  const [language, setLanguage] = useState<Language>()
  const [file, setFile] = useState<File>()
  const history = useHistory()


  const testSubmission = async (submission: Submission): Promise<Submission> => {
    let runtime = -1;
    let status = 'accepted'
    for (const test of submission.tests) {
      // Await response from piston execution
      const res = await fetch("https://piston.codeabac.us/execute", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: submission.language,
          source: submission.source,
          stdin: test.in
        })
      });

      const json = await res.json()

      runtime = Math.max(runtime, json.runtime);
      test.stdout = json.output;

      if (json.output != test.out) {
        console.log("Result: REJECTED");
        status = "rejected";
        test['result'] = "rejected";
      } else {
        console.log("Result: ACCEPTED");
        test['result'] = "accepted";
      }
    }

    submission.status = status
    submission.runtime = runtime
    submission.score = 0;

    return submission
  }

  const handleSubmit = async () => {
    if (!(language && file)) return

    setLoading(true)

    const { name: filename, size: filesize } = file
    const fileReader = new FileReader();

    let submissions: { [key: string]: Submission } = {}
    if (localStorage.submissions != undefined) {
      submissions = JSON.parse(localStorage.submissions)
    }

    fileReader.onloadend = async () => {
      const data = fileReader.result
      if (!data) return

      const sid = uuidv4().replace(/-/g, '');

      submissions[sid] = await testSubmission({
        sid,
        problem,
        pid: problem.id,
        tid: "LOCAL",
        division: 'blue',
        language: language.key,
        filename,
        filesize,
        md5: '',
        sub_no: Object.values(submissions).length,
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


  return <>
    <Countdown />
    {!submissions || submissions?.filter((e) => e.status == "accepted").length == 0 ?
      <Block size='xs-12'>
        <h1>Submit a solution to Practice Problem</h1>

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
            <Button as={Link} to='/blue/practice' disabled={loading}>Cancel</Button>
            <Form.Button loading={loading} disabled={loading} primary>Submit</Form.Button>
          </Form.Group>
        </Form>
      </Block>
      : <Block size='xs-12' transparent>
        <h2>You Already Solved This Problem!</h2>
        <Link to={`/blue/submissions/${submissions.filter((e) => e.status == "accepted")[0].sid}`}>Go to your solved submission</Link>
      </Block>}
  </>
}

export default SubmitPractice