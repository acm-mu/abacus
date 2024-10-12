import { Container, Icon, MenuItem, Message, MessageContent, MessageHeader } from 'semantic-ui-react'
import Navigation from '@/components/navigation'
import NavLink from '@/components/navlink'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import Countdown from '@/components/countdown'
import Block from '@/components/block'

const Page = async (): Promise<React.JSX.Element> => {
  const payload = await getPayloadHMR({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    limit: 5,
  })

  return (
    <>
      <Navigation>
        <MenuItem as={NavLink} href="/">Home</MenuItem>
        {pages?.docs.map((page) => (
          <MenuItem as={NavLink} href={`/${page.slug}`} key={page.slug}>{page.tabTitle}</MenuItem>
        ))}
      </Navigation>

      <Container text className="main">
        <Message icon color='green'>
          <Icon name='trophy' />
          <MessageContent>
            <MessageHeader>Final Standings</MessageHeader>
            Thank you to everyone who participated and congratulations to the winners! View the full standings for the Blue division <a href={'/blue/standings'} className='banner-link'>here</a> and the Gold division <a href={'/gold/standings'} className='banner-link'>here</a>.
          </MessageContent>
        </Message>

        <Countdown />

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