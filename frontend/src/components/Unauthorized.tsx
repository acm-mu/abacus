import React from "react";
import { Block } from "../components";

const Unauthorized = (): JSX.Element => (
  <Block center size="xs-3">
    <img src="/images/401.png" />

    <h3>Error 401 - Unauthorized</h3>
    <h5>You must be logged in to do that!</h5>
  </Block>
);

export default Unauthorized;
