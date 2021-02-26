import React from "react";
import "./Block.scss";

type BlockProps = {
  size: string
  center?: boolean;
  transparent?: boolean;
  children: JSX.Element | JSX.Element[];
  className?: string;
  style?: React.CSSProperties
};

const Block = ({ size, center, transparent, children, className, style }: BlockProps): JSX.Element => {
  className += center ? ' center' : ''
  className += transparent ? ' transparent' : ''

  return <div style={style} className={`${size} block ${className}`}>{children}</div>
}

export default Block;
