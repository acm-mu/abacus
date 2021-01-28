import React from "react";
import { Container } from "semantic-ui-react";
import { GoldNavigation } from "./gold/";
import { Block } from "../components";

const Gold = (): JSX.Element => (
  <>
    <GoldNavigation />
    <Container text className="main">
      <Block size='xs-12'>
        <h1>Gold Home</h1>
      </Block>
    </Container>
  </>
);

export default Gold;
