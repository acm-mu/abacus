import React from "react";
import { Countdown, Block } from "../components";

const Home = (): JSX.Element =>
  <><Countdown />
    <Block size='xs-12'>
      <h1>Welcome to Abacus</h1>
      <p>Abacus is a remote code execution application similar to AlgoExpert</p>
    </Block>
  </>;

export default Home;
