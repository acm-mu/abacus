import './block.scss'

type BlockProps = {
  size: string
  center?: boolean
  transparent?: boolean
  children?: React.JSX.Element | React.JSX.Element[]
  className?: string
  menuAttached?: string
  style?: React.CSSProperties
}

export default function Block({ size, center, transparent, children, className, menuAttached, style }: BlockProps): React.JSX.Element {
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
