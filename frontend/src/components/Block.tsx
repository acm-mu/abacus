import React from "react";
import "./Block.scss";

type BlockProps = {
  size: string;
  center?: boolean;
  transparent?: boolean;
  children?: JSX.Element | JSX.Element[];
  className?: string
};

const Block = (props: BlockProps): JSX.Element => (
  <div className={`${props.size || ""} block ${props.center ? "center" : ""} ${props.transparent ? "transparent" : ""} ${props.className || "" }`}>
    {props?.children}
  </div>
);

export default Block;
