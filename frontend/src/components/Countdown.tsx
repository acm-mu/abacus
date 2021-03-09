import React, { useState, useContext, useEffect } from "react";
import { Loader } from "semantic-ui-react";
import Moment from "react-moment";
import { Block, FlipClock } from "components";
import AppContext from "AppContext";

import "./Countdown.scss";

const Countdown = (): JSX.Element => {
  const { settings } = useContext(AppContext)
  const [time, setTime] = useState<Date>(new Date())
  const [isMounted, setMounted] = useState<boolean>(true)

  const diff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime();

  useEffect(() => {
    return () => setMounted(false)
  }, [])

  setInterval(() => {
    if (isMounted) {
      setTime(new Date());
    }
  }, 200);

  return (
    <Block size='xs-12'>
      {settings ?
        <>
          {time < settings.start_date ?
            <>
              <h1>{settings?.competition_name}</h1>
              <FlipClock count_to={settings.start_date} />
            </>
            :
            <>
              <div className="upper">
                <p>
                  <b>Start</b> <Moment date={settings.start_date} format="MM/DD/YYYY, hh:mm:ss A" />
                </p>
                <h1>{settings?.competition_name}</h1>
                <p>
                  <b>End</b> <Moment date={settings.end_date} format="MM/DD/YYYY, hh:mm:ss A" />
                </p>
              </div>

              <div className="countdown">
                <div
                  className="progress_bar"
                  style={{
                    width: `${Math.min(diff(time, settings?.start_date) / diff(settings.end_date, settings?.start_date), 1) * 100}%`
                  }}
                />
              </div>

              <div className="lower">
                <p>
                  <b>Time elapsed </b>
                  {settings.end_date > time ?
                    <Moment format="H:mm:ss" date={settings.start_date} durationFromNow />
                    : <Moment format="H:mm:ss" duration={settings.start_date} date={settings.end_date} />}
                </p>
                <p>
                  <b>Time remaining </b>
                  {settings.end_date > time ?
                    <Moment format="H:mm:ss" duration={time} date={settings.end_date} />
                    : "Finished"}
                </p>
              </div>
            </>
          } </> :
        <Loader active inline='centered' content="Loading" />}
    </Block>
  );
};

export default Countdown;
