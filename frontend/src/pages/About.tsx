import React from 'react';
import { Block } from 'components';

const About = (): JSX.Element => (
  <>
    <Block size="xs-12">
      <h1>About the Marquette ACM/UPE Programming Competition</h1>
    </Block>
    <Block size="xs-12">

      <h2>Overview</h2>
      <p>
        The Wisconsin-Dairyland chapter of the CSTA, in conjunction with the
        Marquette University chapters of ACM and UPE, welcomes high school
        students with Java, Python or Scratch programming experience to
        participate in a morning of computer science problem solving and/or
        storytelling. This Competition features three divisions:
      </p>

      <h2>Java/Python Division (Blue)</h2>
      <p>
        A traditional team-based programming competition, modeled on the ACM
        International Collegiate Programming Contest. Teams of three or four
        students will have three hours and two computers to work collaboratively
        to solve problems similar in scope to Advanced Placement Computer
        Science exam questions. Points will be awarded based on the number of
        problems correctly solved and the time taken to solve, with appropriate
        penalties for incorrect submissions.
      </p>

      <h2>Open/Scratch Division (Gold)</h2>
      <p>
        Teams of two or three students will have three hours and one computer to
        implement a themed Scratch project. Submissions will be judged on
        creativity, use of key Scratch constructs, and theme correspondence.
        This division will be suitable for introductory students familiar with
        Scratch.
      </p>

      <h2>AP Computer Science Principles (Eagle)</h2>
      <p>
        Teams of two or three students will be working together to solve
        challenges and present their results, similar to the concepts tested in
        the AP Computer Science Principles exam. (If you sign up for this
        division, we will email you by the first week of March with more details
        about this division).
      </p>
    </Block>
  </>
)

export default About;
