
import { Problem, Submission } from 'abacus'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { LineChart, PieChart } from '@toast-ui/react-chart'
import { AppContext } from 'context'
import { Block } from 'components'
import config from 'environment'
import '@toast-ui/chart/dist/toastui-chart.min.css'
import { Helmet } from 'react-helmet'
import moment from 'moment'

const Home = (): JSX.Element => {
  const [submissions, setSubmissions] = useState<Submission[]>()
  const [problems, setProblems] = useState<Problem[]>([])
  const [isMounted, setMounted] = useState(true)

  const { settings } = useContext(AppContext)

  const fetchData = async () => {
    const getProblems = await fetch(`${config.API_URL}/problems`, { headers: { Authorization: `Bearer ${localStorage.accessToken}` } })

    if (!isMounted) return

    setProblems(Object.values(await getProblems.json()))

    const getSubmissions = await fetch(`${config.API_URL}/submissions`, { headers: { Authorization: `Bearer ${localStorage.accessToken}` } })


    if (!isMounted) return

    const subs: Submission[] = Object.values(await getSubmissions.json())
    setSubmissions(subs.filter(({ date }) => date * 1000 > Number(settings?.start_date) && date * 1000 < Number(settings?.end_date)))
  }

  useEffect(() => {
    fetchData()
    const updateInterval = setInterval(fetchData, 5 * 60 * 1000);
    return () => {
      setMounted(false)
      clearInterval(updateInterval)
    }
  }, []);

  const timeSubmissions = useMemo(() => {
    const numBuckets = (Number(settings?.end_date) - Number(settings?.start_date)) / (30 * 60 * 1000)

    const data: { [key: string]: { name: string, data: number[] } } = Object.assign({}, ...problems.map(problem => ({
      [problem.pid]: {
        data: [...Array(numBuckets + 1)].map(() => 0),
        name: problem.name
      }
    })));

    if (submissions) {
      for (const sub of submissions) {
        const startDate = Number(settings?.start_date) / 1000 || 0
        const timeBin = Math.floor((sub.date - startDate) / (1800));
        data[sub.problem.pid].data[timeBin]++;
      }
    }
    return data

  }, [submissions])

  const breakdownData = useMemo(() => {
    const statuses: { [key: string]: { name: string, data: number } } = {};

    if (submissions) {
      for (const { status } of submissions) {
        if (statuses[status] == undefined)
          statuses[status] = { name: status, data: 1 }
        else
          statuses[status].data++
      }
    }

    return {
      categories: ['Submission Status'],
      series: Object.values(statuses)
    }
  }, [submissions])

  const categories: string[] = []
  if (settings?.start_date && settings?.end_date) {
    for (let time = Number(settings?.start_date); time <= Number(settings?.end_date); time += 1800000) {
      categories.push(moment(time).format('hh:mm a'))
    }
  }

  const timelineData = {
    categories,
    series: Object.values(timeSubmissions)
  };

  const breakdownOptions = {
    theme: {
      series: {
        colors: ['#83cd64', '#db2828', '#cccccc', '#aaaaaa']
      }
    },
    chart: {
      width: 'vw',
      height: 450,
      animation: true
    },
    series: {
      selectable: true,
      clockwise: true,
      dataLabels: {
        visible: true,
        anchor: 'outer',
      }
    },
    legend: {
      align: 'bottom',
    }
  };

  const timelineOptions = {
    chart: {
      width: 'vw',
      height: 450,
      animation: true
    },
    series: {
      stack: {
        type: 'normal'
      },
      selectable: true,
      zoomable: true,
      eventDetectType: 'grouped',
    },
    legend: {
      align: 'bottom',
    }
    // chart?: {
    //   // ...
    // },
    // xAxis?: {
    //   // ...
    // },
    // yAxis?: {
    //   // ...
    // },
    // legend?: {
    //   // ...
    // },
    // exportMenu?: {
    //   // ...
    // },
    // tooltip?: {
    //   // ...
    // },
    // plot?: {
    //   // ...
    // },
    // responsive?: {
    //   // ...
    // },
    // theme?: {
    //   // More explanations in the `theme` chapter.
    // },
    // series?: {
    //   showDot?: boolean;
    //   spline?: boolean;
    //   zoomable?: boolean;
    //   eventDetectType?: 'near' | 'nearest' | 'grouped';
    //   shift?: boolean;
    //   stack?: boolean | {
    //     type: 'normal' | 'percent';
    //   }
    //   dataLabels?: {
    //     visible?: boolean;
    //     anchor?: 'center' | 'start' | 'end' | 'auto' | 'outer';
    //     offsetX?: number;
    //     offsetY?: number;
    //     formatter?: (value) => string;
    //   }
    // }
  };

  return <>
    <Helmet> <title>Abacus | Admin</title> </Helmet>
    <Block size='xs-12'>
      <h1>Admin Dashboard</h1>
    </Block>

    <Block size='xs-6'>
      <h2>Submission Timeline</h2>
      {submissions?.length ?
        <LineChart
          data={timelineData}
          options={timelineOptions}
        />
        : <p>There are not any submissions yet!</p>}
    </Block>

    <Block size='xs-6'>
      <h2>Submission Breakdown</h2>
      {submissions?.length ?

        <PieChart
          data={breakdownData}
          options={breakdownOptions}
        />
        : <p>There are not any submissions yet!</p>}
    </Block>
  </>
}
export default Home