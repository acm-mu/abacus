import { BlueProblem, Skeleton } from "@/payload-types"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import { draftMode } from "next/headers"
import configPromise from "@payload-config"
import { cache } from "react"
import { Temporal } from '@js-temporal/polyfill'
import { notFound } from "next/navigation"
import Block from "@/components/block"
import RichText from "@/components/RichText"
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Button, Divider } from "semantic-ui-react"
import Link from "next/link"
import "./page.scss";
import Countdown from '../../../../../components/countdown';

type Args = {
  params: Promise<{
    slug?: string
  }>
}

let { Instant, Now } = Temporal

export default async function BlueProblemPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  if (!slug) return notFound()

  const payload = await getPayloadHMR({ config: configPromise })

  let problem = await payload.findByID({
    collection: 'blue-problems',
    id: slug,
    depth: 1,
  })

  let settings = await payload.findGlobal({
    slug: 'competition'
  })

  let endDate = Instant.from(settings?.endDate)

  let hasCompetitionEnded = Instant.compare(Now.instant(), endDate) < 0

  let submissions = await payload.find({
    collection: 'blue-submissions',
    where: {
      problem: {
        equals: problem.id
      }
    }
  })

  if (!problem) {
    // this is where redirects would go
    notFound()
  }

  // Verify that problem.skeletons[0].file is a Skeleton and not string
  let skeleton = problem.skeletons?.[0].file as any

  return (
    <>
      <Countdown settings={settings} />
      <Block transparent size="xs-12">
        <Breadcrumb>
          <BreadcrumbSection as={Link} href="/blue/problems" content="Problems" />
          <BreadcrumbDivider />
          <BreadcrumbSection active content={problem.title} />
        </Breadcrumb>
      </Block>
      <Block size="xs-9" className="problem">
        <h1>
          Problem {problem.problemId}: {problem.title}
        </h1>
        <Divider />
        <RichText content={problem.description} enableGutter={true} />
      </Block>
      <Block size="xs-3" className="problem-panel">

        {skeleton.url ? (
          // <a
          //   href={skeleton.url}
          //   download={"download"}
          //   target="_blank"
          //   rel="noopener noreferrer"
          // >
          <Button labelPosition="left" content="Skeletons" icon="download" />
          // </a>
        ) : (<></>)}
        <Divider />
        <p>
          <b>Problem ID:</b> {problem.problemId}
        </p>


        {hasCompetitionEnded ? (
          <>
            <Button
              disabled={
                submissions?.docs.filter(({ status, released }) => status == 'accepted' || status == 'pending' || !released)
                  .length !== 0
              }
              as={Link}
              href={`/blue/problems/${problem?.id}/submit`}
              content="Submit"
              icon="upload"
              labelPosition="left"
            />
            {/* <ClarificationModal
              title={`${problem.name} | `}
              context={{ type: 'pid', id: problem.pid }}
              trigger={<Button content="Ask" icon="question" labelPosition="left" />}
            /> */}
            {/* <a target="_blank" rel="noreferrer" href={`${config.API_URL}/sample_files?pid=${problem.pid}`}>
              <Button labelPosition="left" content="Skeletons" icon="download" />
            </a> */}
            {/* <a target='_blank' rel='noreferrer'> */}
            <Button labelPosition='left' icon='download'>
              Skeletons
            </Button>
            {/* </a> */}
          </>
        ) : (
          // <a>
          <Button labelPosition='left' icon='download'>
            Skeletons
          </Button>
          // </a>
        )}
        {/* {latestSubmission} */}
        <Divider />
        <p>
          <b>Problem ID:</b> {problem.problemId}
        </p>
        <p>
          <b>CPU Time limit:</b> {problem.cpu_time_limit}
        </p>
        <p>
          <b>Memory limit:</b> {problem.memory_limit}
        </p>
      </Block>
    </>
  )
}