import React from "react";
import { Block } from "../components";

const NotFound = (): JSX.Element => (
  <Block size='xs-12'>
    <img
      src="/images/404.png"
      style={{ width: "100%", height: "auto" }}
      alt="404 Not Found"
    />
  </Block>
);

export default NotFound;
