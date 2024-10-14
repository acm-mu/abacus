import { MenuItem } from "semantic-ui-react"
import Navigation from "../navigation"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@payload-config"
import NavLink from "../navlink"

export default async function DefaultNavigation() {

  const payload = await getPayloadHMR({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    limit: 5,
  })

  return (
    <Navigation>
      <MenuItem as={NavLink} href="/">Home</MenuItem>
      <MenuItem as={NavLink} href="/blue">Blue</MenuItem>
      {pages?.docs.map((page) => (
        <MenuItem as={NavLink} href={`/${page.slug}`} key={page.slug}>{page.tabTitle}</MenuItem>
      ))}
      <MenuItem as={NavLink} href="/help">Help</MenuItem>
    </Navigation>
  )
}