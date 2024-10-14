import Block from "@/components/block";
import configPromise from "@payload-config";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import RichText from "@/components/RichText";


export default async function BlueRules() {
  const payload = await getPayloadHMR({ config: configPromise })
  const rules = await payload.findGlobal({
    slug: 'blue-rules',
  })

  if (!rules.content) {
    return <></>
  }

  return (
    <Block size='xs-12'>
      <RichText content={rules.content} />
    </Block>
  )
}