import React from 'react';
import { Block } from 'components';
import { Helmet } from 'react-helmet';

const Eagle = (): JSX.Element => (
    <>
        <Helmet> <title>Abacus | Eagle</title> </Helmet>

        <Block size="xs-12">
            <h1>Eagle Division</h1>
        </Block>
        <Block size="xs-12">
            <h2>Overview</h2>
            <p>
                Teams of two to four students will be working together to solve a problem that is present in society and is awaiting a technological solution. The students then have three hours to develop a solution using their knowledge of computer science principles and technologies. Students are not required to write code or create a working prototype, but rather have a flushed out, technical solution. At the end of the three hours, each team will present (5 – 10 minutes) their solution to a small board of faculty members. The faculty will ask a few questions and ultimately vote on a winner. We will have a Google Meet call where students will present and gain feedback the feedback mentioned earlier.
            </p>
        </Block>
        <Block size="xs-12">
            <h2>Problem Statement</h2>
            <p>
                The competition has not yet started.
            </p>
        </Block>
    </>
)

export default Eagle;
