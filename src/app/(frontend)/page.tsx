import { Container, Icon, Message, MessageContent, MessageHeader } from 'semantic-ui-react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import Countdown from '@/components/countdown'
import Block from '@/components/block'
import DefaultNavigation from '@/components/navigation/default'

const Page = async (): Promise<React.JSX.Element> => {
  const payload = await getPayloadHMR({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'competition'
  })

  return (
    <>
      <DefaultNavigation />
      <Container text className="main">
        <Message icon color='green'>
          <Icon name='trophy' />
          <MessageContent>
            <MessageHeader>Final Standings</MessageHeader>
            Thank you to everyone who participated and congratulations to the winners! View the full standings for the Blue division <a href={'/blue/standings'} className='banner-link'>here</a> and the Gold division <a href={'/gold/standings'} className='banner-link'>here</a>.
          </MessageContent>
        </Message>

        <Countdown settings={settings} />

        <Block size='xs-12'>
          <h1>Welcome to Abacus</h1>
          <p>
            Abacus is a remote code execution application similar to AlgoExpert. It is developed by students at Marquette
            University.
          </p>
        </Block>
      </Container>
    </>
  )
}

export default Page