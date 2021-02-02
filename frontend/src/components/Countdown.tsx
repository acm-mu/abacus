import React, { useState, useEffect } from "react";
import { Message } from "semantic-ui-react";
import { Block } from "./";

import "./Countdown.scss";
import "./FlipClock.scss";

function formatTime(obj: Date | number) {
  let milliseconds = obj instanceof Date ? obj.getTime() : Number(obj);

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  milliseconds %= 1000 * 60 * 60;

  const minutes = Math.floor(milliseconds / (1000 * 60));
  milliseconds %= 1000 * 60;

  const seconds = Math.floor(milliseconds / 1000);

  return `${hours < 10 ? `0${hours}` : `${hours}`}:${
    minutes < 10 ? `0${minutes}` : `${minutes}`
  }:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
}

const Countdown = (): JSX.Element => {
  const [compName, setCompName] = useState();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [time, setTime] = useState<Date>();

  const diff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime();

  useEffect(() => {
    fetch("http://localhost/api/contest")
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
  }, []);

  setInterval(() => {
    setTime(new Date());
  }, 200);

  return (
    <>
      {startDate && endDate && time ? (
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
                  width:
                    Math.min(
                      diff(time, startDate) / diff(endDate, startDate),
                      1
                    ) *
                      100 +
                    "%",
                }}
              >
                &nbsp;
              </div>
            </div>

            <div className="lower">
              <p>
                <b>Time elapsed</b>{" "}
                {endDate > time
                  ? formatTime(diff(time, startDate))
                  : diff(endDate, startDate)}
              </p>
              <p>
                <b>Time remaining</b>{" "}
                {endDate > time ? formatTime(diff(endDate, time)) : "Finished"}
              </p>
            </div>
          </div>
        </Block>
      ) : (
        <Message
          warning
          icon="warning sign"
          header="Could not initialize countdown!"
          content="We are having problems communicating with our server!"
        />
      )}
    </>
  );
};

export default Countdown;
