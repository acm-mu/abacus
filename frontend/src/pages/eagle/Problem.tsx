import React, { useContext } from 'react';
import { Block, Countdown } from 'components';
import { Helmet } from 'react-helmet';
import { AppContext } from 'context';

const Home = (): JSX.Element => {

    const { settings } = useContext(AppContext);

    const helmet = <Helmet> <title>Abacus | Eagle Problem</title> </Helmet>

    return (
        <>
            {helmet}
            <Countdown />
            <Block size="xs-12">
                <h2>Problem Statement</h2>

                {(!settings || new Date() < settings.start_date) ?
                    <p>The competition has not yet started.</p> :
                    <p>The problem statement will be displayed here on competition day.</p>
                }
            </Block>
        </>
    )
}

export default Home;
