import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Dropdown, Menu } from 'semantic-ui-react'
import { AppContext } from 'context'
import fulllogoy from 'assets/fulllogoy.png'
import { LoginModal } from 'components'
import { userHome } from 'utils'
import config from 'environment'

type Props = {
  children: React.ReactNode
  className?: string
}

const Navigation = (props: Props): React.JSX.Element => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AppContext)
  const [isMounted, setMounted] = useState(false)

  const handleLogout = () => {
    if (isMounted) {
      localStorage.removeItem('accessToken')
      // When clicking the logout button, the username onClick fires and redirects to user home.
      // Redirect to homepage 20ms later
      setTimeout(() => {
        setUser(undefined)
        navigate('/')
      }, 1)
    }
  }

  useEffect(() => {
    setMounted(true)
    return () => {
      setMounted(false)
    }
  })

  return (
    <>
      <Menu className={`fixed ${props.className}`} inverted>
        {config.isLocal && (
          <Menu.Item style={{ fontWeight: 'bold', position: 'fixed' }} content={config.environmentText} />
        )}
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img className="logo" src={fulllogoy} alt="Abacus" />
          </Menu.Item>

          {props.children}

          {
            <Menu.Menu position="right">
              {user ? (
                <>
                  <Dropdown
                    item
                    simple
                    text={user.display_name}
                    onClick={() => {
                      navigate(userHome(user))
                    }}>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleLogout} text="Log out" />
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <LoginModal trigger={<Menu.Item content="Log in" />} />
              )}
            </Menu.Menu>
          }
        </Container>
      </Menu>
    </>
  )
}

export default Navigation
