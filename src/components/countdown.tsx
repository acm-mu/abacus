import React from 'react'
import { Loader } from 'semantic-ui-react'
// import Moment from 'react-moment'
import moment from 'moment'
import Block from './block'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import './countdown.scss'
import FlipClock from './flipclock';

export default async function Countdown(): Promise<React.JSX.Element> {

  const payload = await getPayloadHMR({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'competition'
  })

  // TODO: Make this dynamic

  // const [time, setTime] = useState<Date>(new Date())
  // const [isMounted, setMounted] = useState(true)

  const diff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime()

  // useEffect(() => {
  //   const updateInterval = setInterval(() => {
  //     if (isMounted) {
  //       setTime(new Date()) q
  //     }
  //   }, 200)

  //   return () => {
  //     clearInterval(updateInterval)
  //     setMounted(false)
  //   }
  // }, [])

  if (!settings) return <Loader active inline="centered" content="Loading" />

  const DATE_FORMAT = "MM/DD/YYYY, hh:mm:ss A"

  const now = moment()

  const pstart = moment(settings.practiceStartDate)
  const pend = moment(settings.practiceEndDate)
  const start = moment(settings.startDate)
  const end = moment(settings.endDate)

  const inPractice = now.isBetween(pstart, pend)
  const inCompetition = now.isBetween(start, end)
  const isCountingDown = !inPractice && !inCompetition && now.isBefore(end)

  const competition_name = inPractice ? settings.practiceName : settings?.name
  const startDate = inPractice ? pstart : start
  const endDate = inPractice ? pend : end

  return (
    <Block size="xs-12">
      {isCountingDown ? (
        <>
          <h1>{competition_name}</h1>
          <FlipClock count_to={settings.practiceStartDate} />
        </>
      ) : (
        <>
          <div className="upper">
            <p>
              <b>Start</b> {startDate.format(DATE_FORMAT)}
            </p>
            <h1>{competition_name}</h1>
            <p>
              <b>End</b> {endDate.format(DATE_FORMAT)}
            </p>
          </div>

          <div className="countdown">
            <div
              className="progress_bar"
              style={{
                width: `${Math.min(diff(now.toDate(), startDate.toDate()) / diff(endDate.toDate(), startDate.toDate()), 1) * 100}%`
              }}
            />
          </div>

          <div className="lower">
            <p>
              <b>Time elapsed </b>
              {endDate.isAfter(now) ? (
                // <Moment format="H:mm:ss" date={startDate} durationFromNow />
                moment.duration(now.diff(startDate)).humanize()
              ) : (
                moment.duration(now.diff(startDate)).humanize()
                // moment(endDate).from(startDate) 
                // <Moment format="H:mm:ss" duration={startDate} date={endDate} />
              )}
            </p>
            <p>
              <b>Time remaining </b>
              {now.isBefore(endDate) ? endDate.fromNow() : 'Finished'}
            </p>
          </div>
        </>
      )}
    </Block>
  )
}

