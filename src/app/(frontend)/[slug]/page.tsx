import { Accordion, AccordionContent, AccordionTitle, AccordionTitleProps, Icon } from "semantic-ui-react";
import Block from "@/components/block";
import React, { cache, useState } from "react";
import type { Page as PageType } from "@/payload-types";
import configPromise from '@payload-config';
import { draftMode } from "next/headers";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import RichText from "@/components/RichText";
import { notFound } from "next/navigation";

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: PageType | null

  page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    // this is where redirects would go
    notFound()
  }

  // const { layout } = page
  return (
    <>
      <Block size="xs-12">
        <h1>{page?.title}</h1>
      </Block>
      <Block size="xs-12">
        <RichText content={page?.content} enableGutter={false} />
      </Block>
    </>
  )

  // return page?.content ? <RichText content={page?.content} enableGutter={false} /> : <p>Missing content</p>

  // return (
  //   <>
  //     <RenderBlocks blocks={layout} />
  //   </>
  // )
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug
      },
    },
  })

  return result.docs?.[0] || null
})