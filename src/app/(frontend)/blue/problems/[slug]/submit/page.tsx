import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"
import Countdown from "@/components/countdown"
import Block from "@/components/block"
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Form, FormButton, FormGroup, FormSelect } from "semantic-ui-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function SubmitPage({ params: paramsPromise }) {
  const { slug } = await paramsPromise

  if (!slug) return notFound()

  let payload = await getPayloadHMR({ config: configPromise })

  let settings = await payload.findGlobal({
    slug: 'competition'
  })

  let problem = await payload.findByID({
    collection: 'blue-problems',
    id: slug,
    depth: 1,
  })

  const languages: { key: string, value: string, text: string, file_extension: string }[] = [
    { key: 'python', value: 'Python 3', text: 'Python 3', file_extension: '.py' },
    { key: 'java', value: 'Java', text: 'Java', file_extension: '.java' }
  ]

  return (
    <>
      <Countdown settings={settings} />
      <h1>Submit Page</h1>
      <Block transparent size='xs-12'>
        <Breadcrumb>
          <BreadcrumbSection as={Link} href='/blue/problems' content='Problems' />
          <BreadcrumbDivider />
          <BreadcrumbSection as={Link} href={`/blue/problems/${problem?.id}`} content={problem?.title} />
          <BreadcrumbDivider />
          <BreadcrumbSection active content='Submit' />
        </Breadcrumb>
      </Block>

      <Block size='xs-12'>
        <h1>Submit a solution to {problem?.title}</h1>

        <Form>
          {/* <FormSelect
            inline
            label='Language'
            placeholder='Select Language'
            options={languages}
          /> */}

          {/* <FormGroup>
            <FormButton primary>Submit</FormButton>
            <FormButton>Cancel</FormButton>
          </FormGroup> */}
        </Form>
      </Block>
    </>
  )
}