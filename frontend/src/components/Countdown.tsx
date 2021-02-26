import "./Countdown.scss";

import React, { useEffect, useState } from "react";

import { Block } from "./";
import { CompetitionSettings } from "../types";
import FlipClock from "./FlipClock";
import { Loader } from "semantic-ui-react";
import Moment from "react-moment";
import config from '../environment'

const Countdown = (): JSX.Element => {
  const [isMounted, setMounted] = useState(true)
  const [isLoading, setLoading] = useState(true)
  const [settings, setSettings] = useState<CompetitionSettings>()
  const [time, setTime] = useState<Date>(new Date())

  const fetchData = async () => {
    const response = await fetch(`${config.API_URL}/contest`)
    const data = await response.json()
    if (isMounted) {
      setSettings({
        ...data,
        start_date: new Date(parseInt(data.start_date) * 1000),
        end_date: new Date(parseInt(data.end_date) * 1000)
      })
      setLoading(false)
    }
  }

  const calcProgress = (): string => {
    if (!settings) return "0"
    const elapsedTime = time.getTime() - settings.start_date.getTime()
    const totalTime = settings?.end_date.getTime() - settings?.start_date.getTime()
    return `${Math.min(elapsedTime / totalTime, 1) * 100}%`
  }

  const updateTimeInterval = setInterval(() => setTime(new Date()), 200)

  useEffect(() => {
    fetchData()
    return () => {
      setMounted(false)
      clearInterval(updateTimeInterval)
    }
  }, [])

  return (
    <Block size='xs-12'>
      {isLoading || !settings ?
        <Loader active inline='centered' content="Loading" /> :
        time < settings.start_date ?
          <FlipClock count_to={settings.start_date} /> :
          <>
            <div className="upper">
              <p>
                <b>Start </b>
                <Moment date={settings.start_date} format="MM/DD/YYYY, hh:mm:ss A" />
              </p>
              <h1>{settings?.competition_name}</h1>
              <p>
                <b>End </b>
                <Moment date={settings.end_date} format="MM/DD/YYYY, hh:mm:ss A" />
              </p>
            </div>

            <div className="countdown">
              <div className="progress_bar" style={{ width: calcProgress() }} />
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
      }
    </Block>
  );
};

export default Countdown;
