import { usePageTitle } from 'hooks'
import React from 'react'

const Submit = (): React.JSX.Element => {
  usePageTitle("Abacus | Gold Submit")

  // const submissionRepo = new SubmissionRepository()
  // const problemRepo = new ProblemRepository()
  //
  // const { pid: problem_id } = useParams<{ pid: string }>()
  // const [problems, setProblems] = useState<IGoldProblem[]>()
  // const [problem, setProblem] = useState<IGoldProblem>()
  //
  // const { project_id: default_project_id } = useParams<{ project_id: string }>()
  // const [project_url, setProjectUrl] = useState<string>(`https://scratch.mit.edu/projects/${default_project_id ?? ''}`)
  // const [description, setDescription] = useState<string>()
  //
  // const [isLoading, setLoading] = useState(true)
  // const [isSubmitting, setSubmitting] = useState(false)
  //
  // const [error, setError] = useState<string>()
  //
  // const { user } = useContext(AppContext)
  //
  // const navigate = useNavigate()
  //
  // const project_id = useMemo(() => {
  //   const match = project_url.match(/https:\/\/scratch\.mit\.edu\/projects\/(\d*)/)
  //   if (match) return match[1]
  //   return undefined
  // }, [project_url])
  //
  // useEffect(() => {
  //   loadProblems()
  //     .catch(console.error)
  // }, [])
  //
  // const loadProblems = async () => {
  //   const response = await problemRepo.getMany({
  //     filterBy: {
  //       division: 'gold'
  //     }
  //   })
  //
  //   if (response.ok && response.data) {
  //     setProblems(response.data as IGoldProblem[])
  //     setProblem(problems?.find(s => s.id == problem_id))
  //   }
  //
  //   setLoading(false)
  // }
  //
  // const handleSubmit = async () => {
  //   if (!(problem && project_id)) return
  //
  //   setSubmitting(true)
  //
  //   const response = await submissionRepo.create({
  //     pid: problem.pid,
  //     project_id,
  //     language: 'scratch',
  //     division: 'gold',
  //     design_document: description
  //   })
  //
  //   if (!response.ok) {
  //     setSubmitting(false)
  //     setError(response.errors)
  //     return
  //   }
  //
  //   setSubmitting(false)
  //   navigate(`/gold/submissions/${response.data?.sid}`)
  // }
  //
  // const handleProblemChange = (event: SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
  //   if (value) {
  //     setProblem(problems?.find(p => p.id == value))
  //   }
  // }
  // const handleChange = async (event: ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
  //   setProjectUrl(value)
  // }
  //
  // if (isLoading) return <PageLoading />
  // if (user?.division != 'gold' && user?.role != 'admin') return <Unauthorized />
  //
  // return (
  //   <>
  //     <Block transparent size="xs-12">
  //       <Breadcrumb>
  //         <Breadcrumb.Section as={Link} to="/gold/problems" content="Problems" />
  //         <Breadcrumb.Divider />
  //         <Breadcrumb.Section as={Link} to={`/gold/problems/${problem?.id}`} content={problem?.name} />
  //         <Breadcrumb.Divider />
  //         <Breadcrumb.Section active content="Submit" />
  //       </Breadcrumb>
  //     </Block>
  //     {error && <StatusMessage message={{ type: 'error', message: error }} />}
  //     <Block size="xs-12">
  //       <Form onSubmit={handleSubmit}>
  //         <Form.Group>
  //           <Form.Select
  //             width={4}
  //             label="Problem"
  //             placeholder="Problem"
  //             name="problem"
  //             value={problem?.pid}
  //             onChange={handleProblemChange}
  //             options={problems?.map(problem => ({
  //               key: problem.pid,
  //               text: problem.name,
  //               value: problem.pid
  //             })) ?? []}
  //           />
  //           <Form.Input
  //             width={4}
  //             label="Project Url"
  //             onChange={handleChange}
  //             placeholder="https://scratch.mit.edu/projects/<project_id>"
  //             value={project_url}
  //           />
  //           <Form.Button
  //             label="&nbsp;"
  //             color="orange"
  //             content="Submit"
  //             loading={isSubmitting}
  //             disabled={isSubmitting}
  //           />
  //         </Form.Group>
  //       </Form>
  //     </Block>
  //
  //     <Block transparent size="xs-12">
  //       <ScratchViewer project={project} />
  //     </Block>
  //
  //     {problem?.design_document ? (
  //       <Block transparent size="xs-12">
  //         <h2>Design Document</h2>
  //         <MDEditor value={description ?? ''} onChange={(value) => setDescription(value ?? '')} height={500} />
  //       </Block>
  //     ) : (
  //       <></>
  //     )}
  //   </>
  // )
  return <>Under Construction</>
}

export default Submit
