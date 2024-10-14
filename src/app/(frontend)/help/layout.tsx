import DefaultNavigation from "@/components/navigation/default"
import { Container, MenuItem } from "semantic-ui-react"

export default async function SlugLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <>
      <DefaultNavigation />
      <Container text className="main">
        {children}
      </Container>
    </>
  )
}