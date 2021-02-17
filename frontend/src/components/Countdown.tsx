import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import { CompetitionSettings } from "../types";
import config from '../environment'
import { Block } from "./";
import "./Countdown.scss";
import "./FlipClock.scss";
import { Loader } from "semantic-ui-react";

const Countdown = (): JSX.Element => {
  const [settings, setSettings] = useState<CompetitionSettings>()
  const [time, setTime] = useState<Date>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isMounted, setMounted] = useState<boolean>(false)

  const diff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime();

  useEffect(() => {
    setMounted(true)
    fetch(`${config.API_URL}/contest`)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setSettings({
            ...res,
            start_date: new Date(parseInt(res.start_date) * 1000),
            end_date: new Date(parseInt(res.end_date) * 1000)
          })
          setLoading(false)
        }
      });
    return () => { setMounted(false) }
  }, [isMounted])

  setInterval(() => {
    if (isMounted)
      setTime(new Date());
  }, 200);

  return (
    <Block size='xs-12'>
      {!isLoading && (settings && time) ?
        <div id="countdown_during">
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
        </div>
        : <Loader active inline='centered' content="Loading" />}
    </Block>
  );
};

export default Countdown;
