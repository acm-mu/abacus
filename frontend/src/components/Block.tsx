import React from 'react'
import './Block.scss'

type BlockProps = {
  size: string
  center?: boolean
  transparent?: boolean
  children?: JSX.Element | JSX.Element[]
  className?: string
  menuAttached?: string
  style?: React.CSSProperties
}

const Block = ({ size, center, transparent, children, className, menuAttached, style }: BlockProps): JSX.Element => {
  let classList = `block ${size} ${className || ''}`

  if (center) classList += ' center'
  if (transparent) classList += ' transparent'
  if (menuAttached) classList += ` menu-attached-${menuAttached}`

  return (
    <div style={style} className={classList}>
      {' '}
      {children}{' '}
    </div>
  )
}

export default Block
