import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import Block from "@/components/block";
import Link from "next/link";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import configPromise from "@payload-config";
import { BlueProblem } from "@/payload-types";
import Countdown from "@/components/countdown";

export default async function BlueProblemsPage() {

  const payload = await getPayloadHMR({ config: configPromise })

  const settings = await payload.findGlobal({
    slug: 'competition'
  })

  const problems = await payload.find({
    collection: 'blue-problems',
    limit: 10,
    sort: 'pid',
  })

  return (
    <>
      <Countdown settings={settings} />
      <Block size="xs-12" transparent>
        <Table celled>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>&nbsp;</TableHeaderCell>
              <TableHeaderCell>Problem Name</TableHeaderCell>
              <TableHeaderCell>Last Submission</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!problems?.docs.length ? (
              <TableRow>
                <TableCell colSpan={'100%'} textAlign="center">
                  We can&apos;t find any problems. If you believe this is an error please contact us.
                </TableCell>
              </TableRow>
            ) : (
              problems.docs.map((problem: BlueProblem) => (
                <TableRow key={problem.id}>
                  <TableHeaderCell collapsing textAlign="center">
                    {problem.pid}
                  </TableHeaderCell>
                  <TableCell>
                    <Link href={`/blue/problems/${problem.id}`}>{problem.title}</Link>
                  </TableCell>
                  <TableCell>
                    &nbsp;
                    {/* {latestSubmission(problem.pid)} */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Block>
    </>
  )
}