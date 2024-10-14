import Block from "@/components/block"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import { Accordion, AccordionContent, AccordionTitle, Icon } from "semantic-ui-react"
import configPromise from "@payload-config"
import RichText from "@/components/RichText"
import React from "react"

export default async function HelpPage() {
  const payload = await getPayloadHMR({ config: configPromise })
  const faqs = await payload.find({
    collection: 'faqs',
  })

  console.log(faqs)

  return (
    <>
      <Block size='xs-12'>
        <h1>Help Page</h1>
      </Block>

      <Block size='xs-12'>
        <h2>Frequently Asked Questions</h2>
        {faqs.docs.length ?
          // <Accordion fluid styled>
          //   {faqs.docs
          //     .map(({ question, answer }, index) => (
          //       <React.Fragment key={index}>
          //         <AccordionTitle index={index} active={false}>
          //           {question}
          //         </AccordionTitle>
          //         <AccordionContent active={false}>
          //           {answer && <RichText
          //             content={answer}
          //           />}
          //         </AccordionContent>
          //       </React.Fragment>
          //     ))}
          // </Accordion>
          <></>
          : <p>No FAQs found</p>}
      </Block>
    </>
  )
}