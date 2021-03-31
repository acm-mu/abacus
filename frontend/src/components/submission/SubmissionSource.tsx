import React, { useContext } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { Table } from "semantic-ui-react";
import { syntax_lang } from "utils";
import SubmissionContext from "./SubmissionContext";

const SubmissionSource = (): JSX.Element => {
  const { submission } = useContext(SubmissionContext)

  if (!submission) return <></>

  return <>
    <p>Submission contains 1 file:</p>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>FILENAME</Table.HeaderCell>
          <Table.HeaderCell>FILESIZE</Table.HeaderCell>
          <Table.HeaderCell>MD5</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>{submission?.filename}</Table.Cell>
          <Table.Cell>{submission?.filesize} bytes</Table.Cell>
          <Table.Cell>{submission?.md5}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>

    <h3>{submission?.filename}</h3>
    <pre>{submission?.source && <SyntaxHighlighter language={syntax_lang(submission.language)} >{submission.source}</SyntaxHighlighter>}</pre>
  </>
}

export default SubmissionSource