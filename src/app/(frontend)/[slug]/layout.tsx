import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"
import Navigation from "@/components/navigation"
import NavLink from "@/components/navlink"
import { Container, MenuItem } from "semantic-ui-react"

export default async function SlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        {children}
      </Container>
    </>

  )
}