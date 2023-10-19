import React from 'react'
import { RickRoll } from './RickRoll'

const Footer = (): React.JSX.Element => (
  <footer>
    Developed with <RickRoll trigger={<a href="#">💙</a>} /> by members of{' '}
    <a href="https://mu.acm.org">Marquette ACM</a>
  </footer>
)

export default Footer
