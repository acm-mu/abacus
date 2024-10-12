import { BlueProblem } from "@/payload-types"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import { draftMode } from "next/headers"
import configPromise from "@payload-config"
import { cache } from "react"
import { notFound } from "next/navigation"
import Block from "@/components/block"
import RichText from "@/components/RichText"
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Button, Divider } from "semantic-ui-react"
import Link from "next/link"
import "./page.scss";

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function BlueProblemPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  let problem: BlueProblem | null

  problem = await queryProblemBySlug({
    slug,
  })

  if (!problem) {
    // this is where redirects would go
    notFound()
  }

  return (
    <>
      <Block transparent size="xs-12">
        <Breadcrumb>
          <BreadcrumbSection as={Link} href="/blue/problems" content="Problems" />
          <BreadcrumbDivider />
          <BreadcrumbSection active content={problem.title} />
        </Breadcrumb>
      </Block>
      <Block size="xs-9" className="problem">
        <h1>
          Problem {problem.pid}: {problem.title}
        </h1>
        <Divider />
        <RichText content={problem.description} enableGutter={true} />
      </Block>
      <Block size="xs-3" className="problem-panel">
        {/* {settings && new Date() < settings?.end_date ? (
          <>
            <Button
              disabled={
                submissions?.filter(({ status, released }) => status == 'accepted' || status == 'pending' || !released)
                  .length !== 0
              }
              as={Link}
              to={`/blue/problems/${problem?.id}/submit`}
              content="Submit"
              icon="upload"
              labelPosition="left"
            />
            <ClarificationModal
              title={`${problem.name} | `}
              context={{ type: 'pid', id: problem.pid }}
              trigger={<Button content="Ask" icon="question" labelPosition="left" />}
            />
            <a target="_blank" rel="noreferrer" href={`/sample_files?pid=${problem.id}`}>
              <Button labelPosition="left" content="Skeletons" icon="download" />
            </a>
          </>
        ) : (
          <a target="_blank" rel="noreferrer" href={`/sample_files?pid=${problem.id}`}>
            <Button labelPosition="left" content="Skeletons" icon="download" />
          </a>
        )} */}
        {/* {latestSubmission} */}
        <Divider />
        <p>
          <b>Problem ID:</b> {problem.pid}
        </p>
        {/* {problem.cpu_time_limit ? (
          <p>
            <b>CPU Time limit:</b> {problem.cpu_time_limit}
          </p>
        ) : (
          <></>
        )}
        {problem.memory_limit ? (
          <p>
            <b>Memory limit:</b> {problem.memory_limit}
          </p>
        ) : (
          <></>
        )} */}
      </Block>
    </>
  )

}

const queryProblemBySlug = cache(async ({ slug }: { slug?: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'blue-problems',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      id: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})