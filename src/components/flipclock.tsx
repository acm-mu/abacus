"use client";

import React, { useState } from 'react'
import moment from 'moment';
import './flipclock.scss'

const FlipClock = ({ count_to }: { count_to: string }): React.JSX.Element => {
  const [flip, setFlip] = useState('')

  const now = moment()
  const duration = moment.duration(moment(count_to).diff(now))

  const timeRemaining = {
    Total: duration.asMilliseconds(),
    Months: duration.months(),
    Days: duration.days(),
    Hours: duration.hours(),
    Minutes: duration.minutes(),
    Seconds: duration.seconds()
  }

  return (
    <div className="flip-clock">
      {Object.entries(timeRemaining).map(([label, value]) => {
        const val = ('0' + value).slice(-2)
        return label !== 'Total' ? (
          <React.Fragment key={`fp-${label}`}>
            <span
              onAnimationStart={() => setFlip('flip')}
              onAnimationEnd={() => setFlip('')}
              className={`flip-clock__piece ${flip} `}>
              <b className="flip-clock__card card">
                <b className="card__top">{val}</b>
                <b className="card__bottom" data-value={val} />
                <b className="card__back" data-value={val}>
                  <b className="card__bottom" data-value={val} />
                </b>
              </b>
              <span className="flip-clock__slot">{label}</span>
            </span>
          </React.Fragment>
        ) : (
          <React.Fragment key={`fp-${label}`}></React.Fragment>
        )
      })}
    </div>
  )
}

export default FlipClock
