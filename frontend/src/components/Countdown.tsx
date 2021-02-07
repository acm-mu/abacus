import React, { useState, useEffect } from "react";
import Moment from "react-moment";

import { Block } from "./";
import config from '../environment'
import "./Countdown.scss";
import "./FlipClock.scss";


const Countdown = (): JSX.Element => {
  const [compName, setCompName] = useState('Loading Competition Info...');

  const now = new Date()

  const [startDate, setStartDate] = useState<Date>(now);
  const [endDate, setEndDate] = useState<Date>(now);
  const [time, setTime] = useState<Date>(now);

  const diff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime();

  useEffect(() => {
    fetch(`${config.API_URL}/contest`)
      .then((res) => res.json())
      .then((res) => {
        setCompName(res.competition_name);

        setStartDate(
          new Date(
            parseInt(res.start_date) * 1000 -
            new Date().getTimezoneOffset() * 60000
          )
        );

        setEndDate(
          new Date(
            parseInt(res.end_date) * 1000 -
            new Date().getTimezoneOffset() * 60000
          )
        );
      });
  }, [])

  setInterval(() => {
    setTime(new Date());
  }, 200);

  return (
    <Block size='xs-12'>
      <div id="countdown_during">
        <div className="upper">
          <p>
            <b>Start</b> {startDate.toLocaleString()}
          </p>
          <h1>{compName}</h1>
          <p>
            <b>End</b> {endDate.toLocaleString()}
          </p>
        </div>

        <div className="countdown">
          <div
            className="progress_bar"
            style={{
              width: `${Math.min(diff(time, startDate) / diff(endDate, startDate), 1) * 100}%`
            }}
          />
        </div>

        <div className="lower">
          <p>
            <b>Time elapsed </b>
            {endDate > time ?
              <Moment format="H:mm:ss" date={startDate} durationFromNow />
              : <Moment format="H:mm:ss" duration={startDate} date={endDate} />}
          </p>
          <p>
            <b>Time remaining </b>
            {endDate > time ?
              <Moment format="H:mm:ss" duration={time} date={endDate} />
              : "Finished"}
          </p>
        </div>
      </div>
    </Block>
  );
};

export default Countdown;
