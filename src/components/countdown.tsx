"use client"

import React, { useEffect, useState } from 'react'
import { Competition } from '@/payload-types'
import { Loader } from 'semantic-ui-react'
import { Temporal } from '@js-temporal/polyfill'
import Block from './block'
import FlipClock from './flipclock'
import './countdown.scss'

const { Instant } = Temporal

function isBefore(a: Temporal.Instant, b: Temporal.Instant): boolean {
  return Instant.compare(a, b) < 0
}

function humanizeDuration(duration: Temporal.Duration): string {
  const parts: string[] = [];

  return duration.days.toString()

  // if (duration.years > 0) parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
  // if (duration.months > 0) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
  // if (duration.days > 0) parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`);
  // if (duration.hours > 0) parts.push(`${duration.hours} hour${duration.hours > 1 ? 's' : ''}`);
  // if (duration.minutes > 0) parts.push(`${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}`);
  // if (duration.seconds > 0) parts.push(`${duration.seconds} second${duration.seconds > 1 ? 's' : ''}`);

  // return parts.length > 0 ? parts.join(', ') : '0 seconds';
}

export default function Countdown(
  {
    settings,
  }: Readonly<{
    settings: Competition,
  }>
): React.JSX.Element {

  const [now, setNow] = useState(Temporal.Now.instant())

  useEffect(() => {
    let updateInterval;

    if (settings) {
      updateInterval = setInterval(() => {
        setNow(Temporal.Now.instant())
      }, 200)
    }

    return () => {
      clearInterval(updateInterval)
    }
  }, [settings])

  if (!settings) {
    return (
      <Loader active inline="centered" content="Loading" />
    )
  }


  const pstart = Instant.from(settings.practiceStartDate)

  if (isBefore(now, pstart)) {
    return (
      <Block size='xs-12'>
        <h1>{settings.practiceName}</h1>
        <FlipClock now={now} countTo={pstart} />
      </Block>
    )
  }

  const pend = Instant.from(settings.practiceEndDate)
  const start = Instant.from(settings.startDate)
  const end = Instant.from(settings.endDate)

  // Now is between pstart and pend
  const inPractice = isBefore(pstart, now) && isBefore(now, pend)

  const startDate = inPractice ? pstart : start
  const endDate = inPractice ? pend : end

  const totalDuration = endDate.since(startDate).total({ unit: 'milliseconds' })
  const elapsedDuration = now.since(startDate).total({ unit: 'milliseconds' })

  const progress = Math.min(elapsedDuration / totalDuration, 1) * 100

  return (
    <Block size="xs-12">
      <div className="upper">
        <p>
          <b>Start</b> {startDate.toLocaleString()}
        </p>
        <h1>{inPractice ? settings.practiceName : settings?.name}</h1>
        <p>
          <b>End</b> {endDate.toLocaleString()}
        </p>
      </div>

      <div className="countdown">
        <div
          className="progress_bar"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="lower">
        <p>
          <b>Time elapsed </b>
          {isBefore(now, endDate) ? (
            humanizeDuration(now.since(startDate))
          ) : (
            humanizeDuration(now.until(endDate))
          )}
        </p>
        <p>
          <b>Time remaining </b>
          {isBefore(now, endDate) ? humanizeDuration(now.until(endDate)) : 'Finished'}
        </p>
      </div>
    </Block>
  )
}

