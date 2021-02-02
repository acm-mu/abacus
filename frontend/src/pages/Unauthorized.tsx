import React from "react";
import { Block } from "../components";

const NotFound = (): JSX.Element => (
  <Block size='xs-3 center'>
    <img
      src="/images/401.png"
      style={{ width: "100%", height: "auto" }}
      alt="404 Not Found"
    />
    <h3>Error 401 - Unauthorized</h3>
    <h5>You must be logged in to do that!</h5>
  </Block>
);

export default NotFound;
