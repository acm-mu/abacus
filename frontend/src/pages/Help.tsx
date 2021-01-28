import React from "react";
import DefaultNavigation from "./DefaultNavigation";
import { Block } from "../components";

const About = (): JSX.Element => (
  <>
    <DefaultNavigation />
    <Block center size='xs-3'>
      <h1>Help Page</h1>
    </Block>
  </>
);

export default About;
